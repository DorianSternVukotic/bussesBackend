var express = require('express');
const { body,validationResult } = require('express-validator');
var api = require("../api/api");
var filterHelpers = require("../helpers/filterHelpers")
const {addToRequestBody} = require("../helpers/requestHelpers");
var router = express.Router();

router.post('/transactionResponse', function(req, res) {
    dataBody = req.body
    transactionResponseCode = req.body.responseCode
    transactionResponseMessage = req.body.responseMessage
    orderNumber = req.body.order_number
    customParameters = req.body.custom_params

    if (transactionResponseCode == "0000" && transactionResponseMessage == "approved" ) {
        api.getBusCards(req, customParameters).then((r) => {
            //TODO: Create Buscard order and bus cards model as well as controllers.
            console.log('req')
            console.log(req)
            console.log('r.data:')
            console.log(r.data)
            res.send(r.data)
        }).catch((e) => {
            res.send(e)
        })
    }

});

module.exports = router;
