var express = require('express');
const { body,validationResult } = require('express-validator');
var api = require("../api/api");
var filterHelpers = require("../helpers/filterHelpers")
const {addToRequestBody} = require("../helpers/requestHelpers");
var router = express.Router();

router.post('/transactionResponse', function(req, res) {
    dataBody = JSON.parse(req.body.transaction_response)
    transactionResponseCode = dataBody.responseCode
    transactionResponseMessage =dataBody.responseMessage
    orderNumber = dataBody.order_number
    customParameters = dataBody.custom_params
    console.log('Placanje uspjesno')
    console.log('customParameters: ', customParameters)
    
    if (transactionResponseCode == "0000" && transactionResponseMessage == "transaction approved" ) {
        api.getBusCards(req, customParameters).then((r) => {
            console.log('customParameters')
            console.log(customParameters)
            console.log('r.data:')
            console.log(r.data)
            res.send(r.data)
        }).catch((e) => {
            res.send(e)
        })
    }

});

module.exports = router;
