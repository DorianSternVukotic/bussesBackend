var express = require('express');
var api = require("../api/api");
var filterHelpers = require("../helpers/filterHelpers")
const {addToRequestBody} = require("../helpers/requestHelpers");
const {getLineRelationPriceListFilteredForStationsAndPrivileges} = require("../api/api");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    //Should this have a response?
    res.send('respond with a resource');
});

router.post('/transactionResponse', function(req, res, next) {
    //Some code to handle the transactionresponse, the code below is just some copy-pasta
    api.getTransactionResponse(req).then((r) => {
        res.send(r.data)
    }).catch((e) => {
        res.send(e)
    })
});

module.exports = router;
