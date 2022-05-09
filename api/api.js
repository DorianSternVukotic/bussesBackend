var qiqoAPI =require("./qiqoBusTicket/qiqoApi");
var requestHelpers =require("../helpers/requestHelpers");
const {filterLineRelationPriceListByRelations} = require("../helpers/filterHelpers");

getTransactionResponse = (req) =>{
    var returnPromise = new Promise((resolve, reject) => {
        //Code to handle the transactionResponseData
    })
    return returnPromise
}

getActiveDepartures = (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoActiveDepartures(requestHelpers.prepareRequestBody(req)).then((result) => {
            resolve(result)
        }).catch(e => reject(e))
    })
    return returnPromise
}

getDepartures = (req) => {
    // console.log('req-api-departures')
    // console.log(req)
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoDepartures(requestHelpers.prepareRequestBody(req)).then((result) => {
            // console.log('departuresResults')
            // console.log(result)
            resolve(result)
        }).catch(e => reject(e))
    })
    return returnPromise
}

getLinePriceList= (req) => {
    // console.log('req-api-line')
    // console.log(req)
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoLinePriceList(requestHelpers.prepareRequestBody(req)).then((result) => {
            resolve(result)
        }).catch(e => reject(e))
    })
    return returnPromise
}

getLineRelationPriceList= (req) => {
    // console.log('req-relation api-line')
    // console.log(req)
    let requestBody = requestHelpers.prepareRequestBody(req)
    // console.log('prepared-req-relation api-line')
    // console.log(requestBody)
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoLinePriceList(requestBody).then((result) => {
            var filteredResults = filterLineRelationPriceListByRelations(result.data, requestBody.stanicaod, requestBody.stanicado)
            // console.log('filteredResults')
            // console.log(filteredResults)
            result.data = filteredResults
            resolve(result)
        }).catch(e => reject(e))
    })
    return returnPromise
}

getLineRelationPriceListFilteredForStations= (req) => {
    var reqBody = requestHelpers.prepareRequestBody(req)
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoLinePriceList(reqBody).then((result) => {
            var filteredResults = filterLineRelationPriceListByRelations(result.data, reqBody.stanicaod, reqBody.stanicado)
            resolve(filteredResults)
        }).catch(e => reject(e))
    })
    return returnPromise
}

getLineRelationPriceListFilteredForStationsAndPrivileges= (reqBody) => {
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoLinePriceList(reqBody).then((result) => {
            var filteredResults = filterLineRelationPriceListByRelations(result.data, reqBody.stanicaod, reqBody.stanicado)
            resolve(filteredResults)
        }).catch(e => reject(e))
    })
    return returnPromise
}

getAllStationsList= (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoAllStationsList(requestHelpers.prepareRequestBody(req)).then((result) => {
            resolve(result)
        }).catch(e => reject(e))
    })
    return returnPromise
}

getTimeTables= (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoTimeTables(requestHelpers.prepareRequestBody(req)).then((result) => {
            resolve(result)
        }).catch(e => reject(e))
    })
    return returnPromise
}

getReservations= (req) => {
    var reqBody = requestHelpers.prepareRequestBody(req)
    reqBody.reservations=JSON.parse(reqBody.reservations)
    reqBody = requestHelpers.prepareReservationData(reqBody)
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoReservations(reqBody).then((result) => {
            resolve(result)
        }).catch(e => reject(e))
    })
    return returnPromise
}


exports.getActiveDepartures = getActiveDepartures
exports.getDepartures = getDepartures
exports.getLinePriceList = getLinePriceList
exports.getLineRelationPriceList = getLineRelationPriceList
exports.getAllStationsList = getAllStationsList
exports.getTimeTables = getTimeTables
exports.getReservations = getReservations
exports.getLineRelationPriceListFilteredForStations = getLineRelationPriceListFilteredForStations
exports.getLineRelationPriceListFilteredForStationsAndPrivileges = getLineRelationPriceListFilteredForStationsAndPrivileges
