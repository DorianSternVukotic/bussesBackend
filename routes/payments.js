var express = require('express');
const { body,validationResult } = require('express-validator');
var api = require("../api/api");
var requestHelpers = require("../helpers/requestHelpers")
const {addToRequestBody} = require("../helpers/requestHelpers");
var router = express.Router();
const pdf = require('html-pdf');
const QRCode = require('qrcode');

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
let hardcodedBusCards = [
    {
        "rezervacija": 18195370,
        "idkarte": 9503453,
        "brojkarte": "BRID-13611-16",
        "qrcode": "78706979190;BRID-13611-16;2021-11-02;4;-1;0;-1;-1;2021-11-02;1;PULA;47;ZAGREB;2;Redovni putnici;120.56;0;16;AK Split;1;;",
        "internetalert": true,
        "errorcode": 0,
        "errordescription": "OK"
    },
    {
        "rezervacija": 18195371,
        "idkarte": 9503454,
        "brojkarte": "BRID-13612-16",
        "qrcode": "78706979190;BRID-13612-16;2021-11-02;4;-1;1;-1;-1;2022-01-31;1;PULA;47;ZAGREB;9;Osobe+60g. pov.k.-40% 3 mj.;120;0;16;AK Split;1;;",
        "internetalert": true,
        "errorcode": 0,
        "errordescription": "OK"
    }
]



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


    if (transactionResponseCode == "0000" && transactionResponseMessage == "transaction approved" ) {
        api.getBusCards(ticketRequestData).then((r) => {
            // console.log('customParameters')
            // console.log(customParameters)
            console.log('r.data:', r.data)
            let busCards = r.data
            let i = 0
            busCards.forEach((busTicket)=>{
                i++
                console.log('data inside ticket-',i,': ', busTicket)
                let currentQRCode = busTicket.qrcode
                console.log('currentQRCode: ',currentQRCode)
                let currentImageName = 'qr'+ (orderNumber+i).toString()+'.png'
                console.log('currentImageName: ',currentImageName)
                //PROBLEM JE TU
                let imagePath = path.join(__dirname, '.','tmp', currentImageName)
                console.log('imagePath: ',imagePath)
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
            let pdfName = './ticket'+ orderNumber.toString()+'.pdf'
            pdf.create(html, options).toFile(pdfName, (err, res) => {
                if (err) {
                  console.log(err);
                }
              });
            // let busCards = r.data  -> Ova linija ce biti korisna kasnije
            // const stream = res.writeHead(200, {
            //     'Content-Type': 'application/pdf',
            //     'Content-Disposition':'attachment;filename=karta.pdf'
            // })
            // pdfService.buildPDFTicket( 
            //     ticketData,
            //     (chunk) => stream.write(chunk),
            //     () => stream.end()
            // )
            // res.send(r.data)
        }).catch((e) => {
            res.send(e)
        })
    }

});

router.get('/ticket', function(req, res){
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
