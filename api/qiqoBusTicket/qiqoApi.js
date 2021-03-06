const axios = require('axios').default;
const qiqoBaseAPI = 'https://demoticket.ak-split.hr:9294/DesktopModules/btServices/API/bt'
//const qiqoBaseAPI = 'http://testshop.qiqo.hr:9094/DesktopModules/btServices/API/bt'

getQiqoActiveDepartures = (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        axios.post(`${qiqoBaseAPI}/PolasciAktivniGet`, req)
            .then(function (response) {
                resolve(response)
            })
            .catch(function (error) {
                reject(error)
                console.log(error);
            });
    })
    return returnPromise
}
getQiqoDepartures = (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        axios.post(`${qiqoBaseAPI}/PolasciGet`, req)
            .then(function (response) {
                resolve(response)
            })
            .catch(function (error) {
                reject(error)
                console.log(error);
            });
    })
    return returnPromise
}
getQiqoLinePriceList = (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        axios.post(`${qiqoBaseAPI}/LinijaCjenikGet`, req)
            .then(function (response) {
                resolve(response)
            })
            .catch(function (error) {
                reject(error)
                console.log(error);
            });
    })
    return returnPromise
}
getQiqoLineRelationPriceList = (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        axios.post(`${qiqoBaseAPI}/LinijaCjenikRelacijaGet`, req)
            .then(function (response) {
                resolve(response)
            })
            .catch(function (error) {
                reject(error)
                console.log(error);
            });
    })
    return returnPromise
}

getQiqoAllStationsList = (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        axios.post(`${qiqoBaseAPI}/VozniRedStanice`, req)
            .then(function (response) {
                resolve(response)
            })
            .catch(function (error) {
                reject(error)
                console.log(error);
            });
    })
    return returnPromise
}

getQiqoTimeTables = (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        axios.post(`${qiqoBaseAPI}/VozniRed`, req)
            .then(function (response) {
                resolve(response)
            })
            .catch(function (error) {
                reject(error)
                console.log(error);
            });
    })
    return returnPromise
}

getQiqoReservations = (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        axios.post(`${qiqoBaseAPI}/RezervacijeGet`, req)
            .then(function (response) {
                resolve(response)
            })
            .catch(function (error) {
                reject(error)
                console.log(error);
            });
    })
    return returnPromise
}

exports.getQiqoActiveDepartures = getQiqoActiveDepartures
exports.getQiqoDepartures = getQiqoDepartures
exports.getQiqoLinePriceList = getQiqoLinePriceList
exports.getQiqoLineRelationPriceList = getQiqoLineRelationPriceList
exports.getQiqoAllStationsList = getQiqoAllStationsList
exports.getQiqoTimeTables = getQiqoTimeTables
exports.getQiqoReservations = getQiqoReservations
