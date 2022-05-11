var express = require('express');
var api = require("../api/api");
var filterHelpers = require("../helpers/filterHelpers")
const {addToRequestBody} = require("../helpers/requestHelpers");
const {getLineRelationPriceListFilteredForStationsAndPrivileges} = require("../api/api");
var router = express.Router();
// const fs = require('fs');
// const path = require("path");

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
        // console.log(r.data)    
        let kosherDepartures = filterHelpers.filterDepartureResults(r.data)
        res.send(kosherDepartures)
    }).catch((e) => {
        res.send(e)
    })
});

router.post('/departuresWithPrivilegePrices', function(req, res, next) {
    api.getDepartures(req).then((r) => {
        let kosherDepartures = filterHelpers.filterDepartureResults(r.data)
        let newKoshherDeparturePromises = []
        kosherDepartures.forEach((kosherDeparture) => {
            let totalDeparturePrivilegePrice = 0

            let addPriceToKosherDeparturePromise = new Promise((resolve, reject) => {
                let newRequestBody = addToRequestBody(req, {
                    'linija': kosherDeparture.id
                })
                console.log('newRequestBody')
                console.log(newRequestBody)

                newRequestBody.peopleByPrivilege = JSON.parse(newRequestBody.peopleByPrivilege)
                let peopleByPrivilege = newRequestBody.peopleByPrivilege

                console.log('newRequestBody AFTE modify')
                console.log(newRequestBody)
                getLineRelationPriceListFilteredForStationsAndPrivileges(newRequestBody)
                  .then(privilegesResults => {
                    console.log('inside then')

                      privilegesResults.forEach(singlePrivilege => {
                          let povlastica = singlePrivilege.povlastica.toString()
                          console.log('peopleByPrivilege.privileges')
                          console.log(peopleByPrivilege.privileges)
                          if (peopleByPrivilege.privileges[povlastica]) {
                              let priceToUse = singlePrivilege.cijenapov ? singlePrivilege.cijenapov : singlePrivilege.cijena
                              totalDeparturePrivilegePrice += priceToUse * peopleByPrivilege.privileges[povlastica]
                          }
                      })

                      let newKosherDeparture = {
                          ...kosherDeparture,
                          totalPriceForPassangersIncludingPrivileges: totalDeparturePrivilegePrice
                      }
                      resolve(newKosherDeparture)

                  })
                  .catch(e => {
                      reject(e)
                  })
            })

            newKoshherDeparturePromises.push(addPriceToKosherDeparturePromise)

        })


        Promise.all(newKoshherDeparturePromises).then(newKosherDepartures => {
            res.send(newKosherDepartures)
            //res.send(kosherDepartures)
        }).catch((e) => {
            console.log('catch but because some promises not returned')
            res.send(e)
        })

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

router.post('/lineRelationPriceListFilteredForStations', function(req, res, next) {
    api.getLineRelationPriceListFilteredForStations(req).then((r) => {
        res.send(r)
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
    // let rawdata = fs.readFileSync(path.resolve(__dirname, '../persistent.json'));
    // let fileData = JSON.parse(rawdata);
    api.getReservations(req).then((r) => {
        // console.log(r.data)
        // fileData.order_number += 1
        // fs.writeFileSync(path.resolve(__dirname, '../persistent.json'), JSON.stringify(fileData));
        res.send(r.data)
    }).catch((e) => {
        res.send(e)
    })
});

module.exports = router;
