var express = require('express');
const { body,validationResult } = require('express-validator');
var api = require("../api/api");
var requestHelpers = require("../helpers/requestHelpers")
const {addToRequestBody} = require("../helpers/requestHelpers");
var router = express.Router();


router.post('/transactionResponse', function(req, res) {
    dataBody = JSON.parse(req.body.transaction_response)
    transactionResponseCode = dataBody.responseCode
    transactionResponseMessage = dataBody.responseMessage
    orderNumber = dataBody.order_number
    customParametersRaw = dataBody.custom_params
    let ticketRequestData = requestHelpers.prepareBusCardsDataRequest(customParametersRaw)
    console.log('Placanje uspjesno')
    // console.log('customParametersRaw: ', customParametersRaw)
    
    // if(numberOfReservations != numberOfPassengers){
    //     // console.log('usli u 1. uvjet')
    //     for(let i = 0; i < numberOfPassengers; i++) {
    //         busCardReservationsPrepHolder = {
    //             rezervacijap: reservationResponses[i+numberOfPassengers].rezervacija.toString(),
    //             voznakarta: '',
    //             povlastica:  privilegeResponses[i].povlastica.toString(),
    //             povratna: true,
    //             ukupno:  privilegeResponses[i].cijenapov.toString(),
    //             napomena: ''
    //         }
    //         busCardReservationPrep.push(busCardReservationsPrepHolder)
    //     }
    // } else {
    //     // console.log('usli u 2. uvjet')
    //     for(let i = 0; i < numberOfPassengers; i++) {
    //         busCardReservationsPrepHolder = {
    //             rezervacija: reservationResponses[i].rezervacija.toString(),
    //             voznakarta: '',
    //             povlastica:  privilegeResponses[i].povlastica.toString(),
    //             povratna: false,
    //             ukupno:  privilegeResponses[i].cijena.toString(),
    //             napomena: ''
    //         }
    //         busCardReservationPrep.push(busCardReservationsPrepHolder)
    //     }
    // }
    // console.log('ticketRequestData: ', ticketRequestData)


    if (transactionResponseCode == "0000" && transactionResponseMessage == "transaction approved" ) {
        api.getBusCards(ticketRequestData).then((r) => {
            // console.log('customParameters')
            // console.log(customParameters)
            console.log('r.data:')
            console.log(r.data)
            res.send(r.data)
        }).catch((e) => {
            res.send(e)
        })
    }

});

module.exports = router;
