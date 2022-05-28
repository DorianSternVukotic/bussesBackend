var express = require('express');
const { body,validationResult } = require('express-validator');
var api = require("../api/api");
var requestHelpers = require("../helpers/requestHelpers")
const {addToRequestBody} = require("../helpers/requestHelpers");
var router = express.Router();
const pdf = require('html-pdf');
const QRCode = require('qrcode');
const puppeteer = require('puppeteer')
const path = require('path')
const nodemailer = require('nodemailer');
const fs = require('fs')

let html = `<b>hello world</b>`
const options = {
  format: 'A4'
}
let harcodedCustomParameters = {
    reservationsData:[
        "{\"linija\":62,\"bus\":1,\"datum\":\"2022-05-20\",\"stanicaod\":1,\"stanicado\":2}",
        "{\"linija\":62,\"bus\":1,\"datum\":\"2022-05-20\",\"stanicaod\":1,\"stanicado\":2}",
        "{\"linija\":62,\"bus\":1,\"datum\":\"2022-05-20\",\"stanicaod\":1,\"stanicado\":2}",
        "{\"linija\":62,\"bus\":1,\"datum\":\"2022-05-20\",\"stanicaod\":1,\"stanicado\":2}",
        "{\"linija\":39,\"bus\":1,\"datum\":\"2022-05-22\",\"stanicaod\":2,\"stanicado\":1}",
        "{\"linija\":39,\"bus\":1,\"datum\":\"2022-05-22\",\"stanicaod\":2,\"stanicado\":1}",
        "{\"linija\":39,\"bus\":1,\"datum\":\"2022-05-22\",\"stanicaod\":2,\"stanicado\":1}",
        "{\"linija\":39,\"bus\":1,\"datum\":\"2022-05-22\",\"stanicaod\":2,\"stanicado\":1}"
    ],
    passengerNames:[
        {"first":"a","last":"b"},{"first":"b","last":"c"},{"first":"c","last":"d"},{"first":"d","last":"e"}
    ],
    selectedPrivileges:[
        {"linija":62,"stanicaod":1,"stanicado":2,"povlastica":3821,"cijena":0,"cijenapov":286,"cijenaeur":0,"cijenaeurpov":0,"povlasticatxt":"P/Povratnakarta/90dana","povlasticaentxt":"Regularpassengers","dana":90,"tipkarte":"6","errorcode":0,"errordescription":"OK"},
        {"linija":62,"stanicaod":1,"stanicado":2,"povlastica":3823,"cijena":0,"cijenapov":159,"cijenaeur":0,"cijenaeurpov":0,"povlasticatxt":"P/djeca2-12g/50%/90dana","povlasticaentxt":"Regularpassengers","dana":90,"tipkarte":"6","errorcode":0,"errordescription":"OK"},
        {"linija":62,"stanicaod":1,"stanicado":2,"povlastica":3821,"cijena":0,"cijenapov":286,"cijenaeur":0,"cijenaeurpov":0,"povlasticatxt":"P/Povratnakarta/90dana","povlasticaentxt":"Regularpassengers","dana":90,"tipkarte":"6","errorcode":0,"errordescription":"OK"},
        {"linija":62,"stanicaod":1,"stanicado":2,"povlastica":3821,"cijena":0,"cijenapov":286,"cijenaeur":0,"cijenaeurpov":0,"povlasticatxt":"P/Povratnakarta/90dana","povlasticaentxt":"Regularpassengers","dana":90,"tipkarte":"6","errorcode":0,"errordescription":"OK"}
    ],
    reservedTickets:[
        {"rezervacija":7355744,"sjedalo":1,"cijena":0,"errorcode":0,"errordescription":"OK"},
        {"rezervacija":7355745,"sjedalo":1,"cijena":0,"errorcode":0,"errordescription":"OK"},
        {"rezervacija":7355746,"sjedalo":1,"cijena":0,"errorcode":0,"errordescription":"OK"},
        {"rezervacija":7355747,"sjedalo":1,"cijena":0,"errorcode":0,"errordescription":"OK"},
        {"rezervacija":7355748,"sjedalo":1,"cijena":0,"errorcode":0,"errordescription":"OK"},
        {"rezervacija":7355749,"sjedalo":1,"cijena":0,"errorcode":0,"errordescription":"OK"},
        {"rezervacija":7355750,"sjedalo":1,"cijena":0,"errorcode":0,"errordescription":"OK"},
        {"rezervacija":7355751,"sjedalo":1,"cijena":0,"errorcode":0,"errordescription":"OK"}
    ],
    buyer:{
        email:"mailaosamtimater",
        phone:"nititi"
    }
}



// router.get('/transactionResponse', function(req, res) {
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
                    console.log(string)
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
                console.log('rec.data: ', rec.data)
				let receiptId = receiptResponse.racunid

                let receiptDetailsRequestData = JSON.parse(JSON.stringify(ticketRequestData))
                delete receiptDetailsRequestData.rezervacije
                receiptDetailsRequestData.racunid = receiptId
                console.log('receiptDetailsRequestData: ', receiptDetailsRequestData)
				
				api.getReceiptDetails (receiptDetailsRequestData).then((resol) =>{
					let receiptDetailsResponse = resol.data
					console.log('uspjeli')
                    console.log('resol.data: ', resol.data)
                    receipt = receiptDetailsResponse

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
                        console.log(string)
                    } )
					
                    
                    let sourceTicket = path.join(process.cwd(),'documents','templates', 'izgled-karte.html')
                    let ticketFileName = 'karte'+ (receiptId).toString()+'html'
                    let destinationTicket = path.join(process.cwd(),'documents','processing', ticketFileName )
                    let sourceReceipt = path.join(process.cwd(),'documents','templates', 'izgled-racuna.html')
                    let receiptFileName = 'racuna'+ (receiptId).toString()+'html'
                    let destinationReceipt = path.join(process.cwd(),'documents','processing', receiptFileName )
                    
                    fs.copyFileSync(sourceTicket, destinationTicket, (err) => {
                        if (err) throw err
                    });
                    fs.copyFileSync(sourceReceipt, destinationReceipt, (err) => {
                        if (err) throw err
                    });
                    //OVDJE: 
                    //2. html se izmjenjuje i puni podacima iz ovog requesta
                    //KOD ZA PUNJENJE PODACIMA


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
