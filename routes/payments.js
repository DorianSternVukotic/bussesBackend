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
const cheerio = require('cheerio')

let html = `<b>hello world</b>`
const options = {
  format: 'A4'
}
let harcodedRacunVozneKarteGetResponse = {
    racunid: 234522,
    errorcode: 0,
    errordescription: 'OK'
}

/* let harcodedRacunPrintResponse = {
    brojracuna: '10089/2003/1',
    datum: '2021-11-03T11:21:19.91',
    iznos: 80.0,
    osnovica: 80.0,
    neoporezivo: 0.0,
    pdv: 20.0,
    ukupno: 100.0,
    nacinplacanja: 'Kartice',
    napomena: 'K:BRID-47847-5',
    zki: 'e68d136bfe5c7fa4eb33eedce585bf7d',
    jir: '8eab0d92-f6d5-4f8e-9133-1bd2c10be6a8',
    prodajnomjesto: 'Internet prodaja',
    qrcode: 'https://porezna.gov.hr/rn?zki=e68d136bfe5c7fa4eb33eedce585bf7d&datv=20211103_1121&izn=100,00',
    stavke: [
        {
            artikal: 'Prijevoz',
            kolicina: 1.0,
            cijena: 80.0,
            osnovica: 80.0,
            neoporezivo: 0.0,
            pdv: 20.0,
            ukupno: 100.0,
            tarifa: 25.0
        }
    ],
    razradaporeza: [
        {
            tarifa: 25.0,
            osnovica: 80.0,
            neoporezivo: 0.0,
            pdv: 20.0,
            nepodlopor: false,
            oslobpdv: false
        }
    ],
    errorcode: 0,
    errordescription: 'OK'
} */


// router.get('/transactionResponse', function(req, res) {
router.post('/transactionResponse', function(req, res) {
    dataBody = JSON.parse(req.body.transaction_response)
    transactionResponseCode = dataBody.responseCode
    transactionResponseMessage = dataBody.responseMessage
    orderNumber = dataBody.order_number
    customParametersRaw = dataBody.custom_params
    console.log('customParametersRaw:',customParametersRaw)
    let ticketRequestData = requestHelpers.prepareBusCardsDataRequest(customParametersRaw)
    console.log('Placanje uspjesno')
    let receipt = {}


    if (transactionResponseCode == "0000" && transactionResponseMessage == "transaction approved" ) {
        
        api.getBusCards(ticketRequestData).then((r) => {
            // console.log('customParameters')
            // console.log(customParameters)
            //console.log('r.data:', r.data)
            let busCards = r.data
            let qrCounter = 0
			let busCardIds = []
            //TU mi dođe kod
            busCards.forEach((busTicket)=>{
                qrCounter++
                busCardIds.push(busTicket.idkarte)
               
                // console.log('data inside ticket-', qrCounter,': ', busTicket)
                let currentQRCode = busTicket.qrcode
                // console.log('currentQRCode: ',currentQRCode)
                let currentImageName = 'qr'+ (orderNumber+ qrCounter).toString()+'.png'
                // console.log('currentImageName: ',currentImageName)
                // console.log('path.dirname:',process.cwd())
                let imagePath = path.join(process.cwd(),'documents','resources','tickets', currentImageName)
                // console.log('qrCounter:',qrCounter)
                // console.log('imagePath: ',imagePath)
                QRCode.toFile(imagePath,currentQRCode, function (err, string) {
                    if (err) throw err
                    //console.log(string)
                  } )
                
            })
            // let customParametersRaw = harcodedCustomParameters
            let ticketData = {
                busCards: busCards,
                customParametersRaw: customParametersRaw
            }
            //console.log('ticketRequestData:', ticketRequestData)
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


            // console.log('busCardIds:', busCardIds)
            // console.log('receiptRequestData: ', receiptRequestData)
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

                   
                    //receiptDetailsResponse = harcodedRacunPrintResponse
					// console.log('uspjeli dobiti podatke racuna natrag')
                    // console.log('resol.data: ', resol.data)
                    // console.log(' receiptDetailsResponse: ',  receiptDetailsResponse)
                    receipt = receiptDetailsResponse

                    //QR kod racuna generiranje
                    let receiptQRCode = receipt.qrcode
                    // console.log('currentQRCode: ',currentQRCode)
                    let currentReceiptName = 'qr'+ (receiptId).toString()+'.png'
                    // console.log('currentImageName: ',currentImageName)
                    // console.log('path.dirname:',process.cwd())
                    let receiptQRCodePath = path.join(process.cwd(),'documents','resources','receipts', currentReceiptName)
                    // console.log('qrCounter:',qrCounter)
                    // console.log('imagePath: ',imagePath)
                    QRCode.toFile(receiptQRCodePath,receiptQRCode, function (err, string) {
                        if (err) throw err
                        //console.log(string)
                    } )
                    //console.log('receipt created - qr code')
					
                    let sourceTicket = path.join(process.cwd(),'documents','templates', 'izgled-karte.html')
                    let ticketFileName = 'karte'+ (receiptId).toString()+'.html'
                    let destinationTicket = path.join(process.cwd(),'documents','processing', ticketFileName)
                    //let destinationTicket = path.join('..','processing', ticketFileName)
                    let sourceReceipt = path.join(process.cwd(),'documents','templates', 'izgled-racuna.html')
                    let receiptFileName = 'racun'+ (receiptId).toString()+'.html'
                    let destinationReceipt = path.join(process.cwd(),'documents','processing', receiptFileName)
                    //let destinationReceipt = path.join('..','processing', receiptFileName)
                    
                    // console.log('sourceTicket:', sourceTicket)
                    // console.log('sourceReceipt:', sourceReceipt)
                    // console.log('destinationTicket:', destinationTicket)
                    // console.log('destinationReceipt:', destinationReceipt)

                    fse.copySync(sourceTicket, destinationTicket)
                    fse.copySync(sourceReceipt, destinationReceipt)
                    console.log('finished creating files')
                    

                     //OVDJE: 
                    //2. html se izmjenjuje i puni podacima iz ovog requesta
                    //TODO: check if ticket is read
                    let raw_html_ticket = fs.readFileSync(destinationTicket)
                    console.log('raw_html:', raw_html_ticket)
                    let $ = cheerio.load(raw_html_ticket)
                    
                    
                   
                    //KOD ZA PUNJENJE PODACIMA $('.apple', '#fruits')


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
