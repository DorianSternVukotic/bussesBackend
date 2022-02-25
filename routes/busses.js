var express = require('express');
var api = require("../api/api");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send(api.getBussesPolasci(req));
});

router.post('/activeDepartures', function(req, res, next) {
    api.getActiveDepartures(req).then((r) => {
        res.send(r.data)
    }).catch((e) => {
        res.send(e)
    })
});

router.post('/activeDepartures', function(req, res, next) {
    api.getActiveDepartures(req).then((r) => {
        res.send(r.data)
    }).catch((e) => {
        res.send(e)
    })
});

router.post('/departures', function(req, res, next) {
    api.getDepartures(req).then((r) => {
        res.send(r.data)
    }).catch((e) => {
        res.send(e)
    })
});

router.post('/linePriceList', function(req, res, next) {
    api.getLinePriceList(req).then((r) => {
        res.send(r.data)
    }).catch((e) => {
        res.send(e)
    })
});

router.post('/lineRelationPriceList', function(req, res, next) {
    api.getLineRelationPriceList(req).then((r) => {
        res.send(r.data)
    }).catch((e) => {
        res.send(e)
    })
});

router.post('/allStationsList', function(req, res, next) {
    api.getAllStationsList(req).then((r) => {
        res.send(r.data)
    }).catch((e) => {
        res.send(e)
    })
});

router.post('/timeTables', function(req, res, next) {
    api.getTimeTables(req).then((r) => {
        res.send(r.data)
    }).catch((e) => {
        res.send(e)
    })
});

router.post('/reservations', function(req, res, next) {
    api.getReservations(req).then((r) => {
        console.log(r.data)
        res.send(r.data)
    }).catch((e) => {
        res.send(e)
    })
});

module.exports = router;
