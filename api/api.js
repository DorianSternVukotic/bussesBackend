var qiqoAPI =require("./qiqoBusTicket/qiqoApi");
var requestHelpers =require("../helpers/requestHelpers");

getActiveDepartures = (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoActiveDepartures(requestHelpers.prepareRequestBody(req)).then((result) => {
            resolve(result)
        }).catch(e => reject(e))
    })
    return returnPromise
}

getDepartures = (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoDepartures(requestHelpers.prepareRequestBody(req)).then((result) => {
            resolve(result)
        }).catch(e => reject(e))
    })
    return returnPromise
}

getLinePriceList= (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoLinePriceList(requestHelpers.prepareRequestBody(req)).then((result) => {
            resolve(result)
        }).catch(e => reject(e))
    })
    return returnPromise
}
getLineRelationPriceList= (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        qiqoAPI.getQiqoLinePriceList(requestHelpers.prepareRequestBody(req)).then((result) => {
            resolve(result)
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
    reqBody = requestHelpers.prepareReservationData(reqBody)
    //console.log(reqBody)
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
