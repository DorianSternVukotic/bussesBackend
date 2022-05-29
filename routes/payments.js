const express = require('express')
const { body,validationResult } = require('express-validator');
const api = require("../api/api");
const requestHelpers = require("../helpers/requestHelpers")
const {addToRequestBody} = require("../helpers/requestHelpers");
const router = express.Router();
const pdf = require('html-pdf');
const QRCode = require('qrcode');
const puppeteer = require('puppeteer')
const path = require('path')
const nodemailer = require('nodemailer');
const fs = require('fs')
const fse = require('fs-extra')
const cheerio = require('cheerio');

let harcodedRacunVozneKarteGetResponse = {
    racunid: 234522,
    errorcode: 0,
    errordescription: 'OK'
}

router.post('/transactionResponse', function(req, res) {
    dataBody = JSON.parse(req.body.transaction_response)
    transactionResponseCode = dataBody.responseCode
    transactionResponseMessage = dataBody.responseMessage
    orderNumber = dataBody.order_number
    customParametersRaw = dataBody.custom_params
    // console.log('customParametersRaw:',customParametersRaw)
    let ticketRequestData = requestHelpers.prepareBusCardsDataRequest(customParametersRaw)
    console.log('Placanje uspjesno')
    let receipt = {}

    if (transactionResponseCode == "0000" && transactionResponseMessage == "transaction approved" ) {
        
        api.getBusCards(ticketRequestData).then((r) => {
            let busCards = r.data
            let qrCounter = 0
			let busCardIds = []
            busCards.forEach((busTicket)=>{
                qrCounter++
                busCardIds.push(busTicket.idkarte)
                
                let currentQRCode = busTicket.qrcode
                let currentImageName = 'qr'+ (orderNumber + qrCounter).toString()+'.png'
                let imagePath = path.join(process.cwd(),'documents','resources','tickets', currentImageName)
                QRCode.toFile(imagePath,currentQRCode, function (err, string) {
                    if (err) throw err
                  } )
            })
			let receiptRequestData = JSON.parse(JSON.stringify(ticketRequestData))
            delete receiptRequestData.rezervacije
            let vozneKarteArray = []
            busCardIds.forEach((ticket) => {
                let holder = {
                    kartaid: ticket
                }
                vozneKarteArray.push(holder)
            })
            receiptRequestData.voznekarte = vozneKarteArray

            api.getBusCardReceipt(receiptRequestData).then((rec) =>{
				let receiptResponse = rec.data
                // console.log('rec.data: ', rec.data)

                //HARDCODED receipt, ovo mi ne dolazi dobro od QIQA
                receiptResponse = harcodedRacunVozneKarteGetResponse
				let receiptId = receiptResponse.racunid
                let receiptDetailsRequestData = JSON.parse(JSON.stringify(ticketRequestData))
                delete receiptDetailsRequestData.rezervacije
                receiptDetailsRequestData.racunid = receiptId
                //hardcoded data inside
                //console.log('receiptDetailsRequestData: ', receiptDetailsRequestData)
				
				api.getReceiptDetails (receiptDetailsRequestData).then((resol) =>{
					let receiptDetailsResponse = resol.data
                    receipt = receiptDetailsResponse
                    let receiptQRCode = receipt.qrcode
                    let currentReceiptName = 'qr'+ (receiptId).toString()+'.png'
                    let receiptQRCodePath = path.join(process.cwd(),'documents','resources','receipts', currentReceiptName)
                    QRCode.toFile(receiptQRCodePath,receiptQRCode, function (err, string) {
                        if (err) throw err
                    })
					
                    let sourceTicket = path.join(process.cwd(),'documents','templates', 'izgled-karte.html')
                    let ticketFileName = 'karte'+ (receiptId).toString()+'.html'
                    let destinationTicket = path.join(process.cwd(),'documents','processing', ticketFileName)
                    let sourceReceipt = path.join(process.cwd(),'documents','templates', 'izgled-racuna.html')
                    let receiptFileName = 'racun'+ (receiptId).toString()+'.html'
                    let destinationReceipt = path.join(process.cwd(),'documents','processing', receiptFileName)
                    fse.copySync(sourceTicket, destinationTicket)
                    fse.copySync(sourceReceipt, destinationReceipt)
                    console.log('finished creating files')

                    let passedDataHolder = JSON.parse(JSON.parse(JSON.stringify(customParametersRaw)))
                    let rawReservations = passedDataHolder.reservationsDataRaw
                    let formattedReservations = []
                    let passengers = passedDataHolder.passengerNames
                    let privilegesPassed = passedDataHolder.selectedPrivileges
                    let isReturnTrip = false
                    let pricesHolder = passedDataHolder.prices
                    let printPrices = JSON.parse(pricesHolder)
                    let ticketDataCollectionRaw = JSON.parse(passedDataHolder.reservationsDataCollection)
                    let seatHolder = passedDataHolder.reservedTickets
                    let stationNames = passedDataHolder.stations
                    let ticketDataCollection = []
                    ticketDataCollectionRaw.forEach((ticketDataRecord)=>{
                        ticketDataCollection.push(ticketDataRecord)
                    })
                    rawReservations.forEach((element)=>{
                        formattedReservations.push(JSON.parse(element))
                    })
                    if (formattedReservations.length > passengers.length){
                        isReturnTrip = true
                    }
                    let ts = Date.now()
                    let currentTimestamp = new Date(ts)
                    let mainTimestamp = currentTimestamp.toLocaleString('hr-HR')
                    let busCardsPrint = []
                    let i = 0
                    busCards.forEach((ticket)=>{
                        let passengerName = passengers[i].first + ' ' + passengers[i].last
                        let ticketTypeTxt = privilegesPassed[i].povlasticatxt
                        let currentImageName = 'qr'+ (orderNumber + i).toString()+'.png'
                        let qrCodePath = path.join(process.cwd(),'documents','resources','tickets', currentImageName)
                        let departTime = ticketDataCollection[0].departuretime
                        let timeToDepartArray =  departTime.split(':')
                        let timeToDepart = timeToDepartArray[0] + ':' + timeToDepartArray[1]
                        let date = new Date(formattedReservations[passengers.length].datum)
                        let croatianDate = date.toLocaleDateString('hr-HR')
                        let dateToDepart = timeToDepart + ' ' + croatianDate.replaceAll(' ','')
                        let singleTicket = {
                            ticketNumber: ticket.brojkarte,
                            passengerFullName: passengerName,
                            ticketType: ticketTypeTxt,
                            relation: stationNames[0] + '-' + stationNames[1],
                            departuredate: dateToDepart,
                            bus: ticketDataCollection[0].bus,
                            seat: seatHolder[i].sjedalo,
                            qrcode: qrCodePath,
                        }
                        busCardsPrint.push(singleTicket)
                        if (isReturnTrip) {
                            let departTime = ticketDataCollection[passengers.length].departuretime
                            let timeToDepartArray =  departTime.split(':')
                            let timeToDepart = timeToDepartArray[0] + ':' + timeToDepartArray[1]
                            let date = new Date(formattedReservations[passengers.length].datum)
                            let croatianDate = date.toLocaleDateString('hr-HR')
                            let dateToDepart = timeToDepart + ' ' + croatianDate.replaceAll(' ','')
                            let singleTicket = {
                                ticketNumber: ticket.brojkarte,
                                passengerFullName: passengerName,
                                ticketType: ticketTypeTxt,
                                relation: stationNames[1] + '-' + stationNames[0],
                                departuredate: dateToDepart,
                                bus: ticketDataCollection[passengers.length].bus,
                                seat:  seatHolder[passengers.length + i].sjedalo,
                                qrcode: qrCodePath,
                            }
                            busCardsPrint.push(singleTicket)
                        }
                        i++
                    })

                    let mainTicketData = {
                        line: stationNames[0] + '-' + stationNames[1],
                        departureTime: ticketDataCollection[0].departuretime,
                        peron: ticketDataCollection[0].peron,
                        bus: ticketDataCollection[0].bus,
                        timeIssued: mainTimestamp,
                        ticketsPrice: printPrices.priceOnTickets,
                        reservationPrice: printPrices.priceReservation,
                        totalPrice: printPrices.totalPriceTaxIncluded,
                        individualTickets: busCardsPrint
                    }
                    console.log('mainTicketData: ', mainTicketData)

                    let raw_html_ticket = fs.readFileSync(destinationTicket, 'utf8')
                    console.log('raw_html:', raw_html_ticket)
                    let $ = cheerio.load(raw_html_ticket)
                    let relacijaString = '<strong>Relacija prijevoza:</strong> ' + mainTicketData.line
                    let vrijemePolaskaString = '<strong>Vrijeme polaska:</strong> ' + mainTicketData.departureTime
                    let peronString = '<strong>Peron:</strong> ' + mainTicketData.peron
                    let busString = '<strong>Bus:</strong> ' + mainTicketData.bus
                    let timestampString = '<strong>Izdano:</strong> ' + mainTicketData.timeIssued
                    let prijevozCijenaString = '<strong class="text-uppercase">Prijevoz:</strong> ' + mainTicketData.ticketsPrice + '.00'
                    let naknadaRezervacijaString = '<strong class="text-uppercase">Naknada za rezervaciju:</strong> ' + mainTicketData.reservationPrice
                    let ukupnoString = '<strong class="text-uppercase">UKUPNO KN:</strong> ' + mainTicketData.totalPrice
                    
                    let rowToAdd = []
                    mainTicketData.individualTickets.forEach((ticketPrint)=>{
                        let ticketArray = [
                            `<!-- card details
                            <div class="col-md-6 col-sm-12 col-lg-4">
                                <div class="card p-3 mb-4">
                                    <div class="mt-0">
                                        <p class="line-height-m">
                                            <strong>BROJ KARTE:</strong> `, 
                            ticketPrint.ticketNumber,
                            `<br>
                            <strong>IME:</strong> `,
                            ticketPrint.passengerFullName,
                            `<br>
                            <strong>VRSTA:</strong> `,
                            ticketPrint.ticketType,
                            `<br>
                            <strong>RELACIJA:</strong> `,
                            ticketPrint.relation,
                            `<br><br> 
                            <strong>POLAZAK:</strong> `,
                            ticketPrint.departuredate,
                            ` <br> 
                            <strong>BUS:</strong> `,
                            ticketPrint.bus,
                            `  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>SJEDALO:</strong> `,
                            ticketPrint.seat,
                            `</strong>						
                            </p>
                  
                            <div class="mt-2 text-center">
                                <img src="`,
                            ticketPrint.qrcode.replace(/\\\\/g, '\\'),
                                `"> 
                            </div>
                        </div>
                    </div>
                </div>
                        `
                        ]
                        let oneTicket = ticketArray.join()
                        console.log('one ticket: ',oneTicket)
                        rowToAdd.push(oneTicket)
                    })
                    let rowString = rowToAdd.join()

                    $('#relacija').html(relacijaString)
                    $('#vrijeme-polaska').html(vrijemePolaskaString)
                    $('#peron').html(peronString)
                    $('#bus').html(busString)
                    $('#timestamp').html(timestampString)
                    $('#prijevoz-cijena').html(prijevozCijenaString)
                    $('#naknada-rezervacija').html(naknadaRezervacijaString)
                    $('#ukupno').html(ukupnoString)
                    $('#ticket-row').html(rowString)
                    let ticketContents = $.html()
                    fse.writeFileSync(destinationTicket, ticketContents, 'utf8')

                    let mainReceiptData = {
                        datum: receipt.datum,
                        broj: receipt.brojracuna,
                        artikli: receipt.stavke,
                        ukupno: receipt.ukupno,
                        pdv: receipt.pdv,
                        zki: receipt.zki,
                        jir: receipt.jir,
                        qrcode: receiptQRCodePath
                    }
                    console.log('mainReceiptData: ', mainReceiptData)

                    

                    //************************************************************************
                    //KOD ZA PUNJENJE PODACIMA racun
                    
                    // let raw_html_receipt = fs.readFileSync(destinationReceipt, 'utf8')
                    // console.log('raw_html:', raw_html_receipt)
                    
                    // $ = cheerio.load(raw_html_receipt)
                    // //ovo srediti i sve double checkat
                    // let datumHelperArray = [
                    //     `
                    //     <p><strong>Datum računa:</strong> `,
                    //     mainReceiptData.datum,
                    //     `/p>
                    //     <p><strong>Broj računa:</strong> `,
                    //     mainReceiptData.broj,
                    //     `/p>	
                    //     `
                    // ]
                    // let zkiJirHelperArray = [
                    //     `
                    //     ZKI: `,
                    //     mainReceiptData.zki,
                    //     `<br>
					//     JIR: `,
                    //     mainReceiptData.jir,
                    //     `
                    //     <br>
                    //     <img src="`,
                    //     mainReceiptData.qrcode.replace(/\\\\/g, '\\'),
                    //     `>
				  
                    //     `
                    // ]
                    // let datumBrojString = datumHelperArray.join()
                    // let napomenaString = ''
                    // let pdvIznosString = '' +  mainReceiptData.pdv
                    // let popustString = ''
                    // let ukupanIznosString = '' +  mainReceiptData.ukupno
                    // let zkiJirString = zkiJirHelperArray.join()
                    // let stavkeArray = []
                    // receipt.stavke.forEach((receiptListing)=>{
                    //     let stavkaArray = [
                    //         `
                    //         <tr>
                    //           <td>`,
                    //           receiptListing.artikal,
                    //           `</td>
                    //           <td class="text-right">`,
                    //           receiptListing.kolicina,
                    //           `</td>
                    //           <td class="text-right">`,
                    //           receiptListing.ukupno,
                    //           `</td>
                    //           </tr>`
                    //     ]
                    //     let oneStavka = stavkaArray.join()
                    //     console.log('oneStavka: ',oneStavka)
                    //     stavkeArray.push(oneStavka)
                    // })
                    // let stavkeString = stavkeArray.join()
                    // $('#datum-broj').html(datumBrojString)
                    // $('#napomena').html(napomenaString)
                    // $('#pdv-iznos').html(pdvIznosString)
                    // $('#popust').html(popustString)
                    // $('#ukupan-iznos').html(ukupanIznosString)
                    // $('#zki-jir').html(zkiJirString)
                    // $('#qr-racuna').html(qrRacunaString)
                    // $('#receipt-articles').html(stavkeString)
                    // let receiptContents = $.html()
                    // fse.writeFileSync(destinationReceipt, receiptContents, 'utf8')
                    //************************************************************************


                    //3. Html se prebaci u pdf pomocu puppeteera 
                    // https://stackblogger.com/how-to-install-and-use-puppeteer-in-ubuntu/

                    // async function printPDF() {
                    //     const browser = await puppeteer.launch({ headless: true });
                    //     const page = await browser.newPage();
                    //     await page.goto(destinationTicket, {waitUntil: 'networkidle0'});
                    //     const pdf = await page.pdf({ format: 'A4' });
                       
                    //     await browser.close();
                    //     return pdf
                    //   })
                    

                    // let pdfName = './ticket'+ orderNumber.toString()+'.pdf'
                    // pdf.create(html, options).toFile(pdfName, (err, res) => {
                    //     if (err) {
                    //     console.log(err);
                    //     }
                    // });

                    //4.  KOD ZA SLANJE MAILA treba provjeriti link: https://nodemailer.com/usage/
                    // let transporter = nodemailer.createTransport({
                    //     service:
                    // })


                    //5. korisnika se redirecta - otkriti link
                    //res.redirect('https://app.example.io');
				}).catch((e) => {
					res.send(e)
				})
			}).catch((e) => {
				res.send(e)
			})
        }).catch((e) => {
            res.send(e)
        })
    }

});

router.get('/ticket', function(req, res){
    //Streamanje filea
    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition':'attachment;filename=karta.pdf'
    })
    pdfService.buildPDFTicket( 
        busCards,
        (chunk) => stream.write(chunk),
        () => stream.end()
    )
})

module.exports = router;
