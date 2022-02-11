const axios = require('axios').default;

getQiqoActiveDepartures = (req) => {
    var returnPromise = new Promise((resolve, reject) => {
        axios.post('http://testshop.qiqo.hr:9094/DesktopModules/btServices/API/bt/PolasciAktivniGet', req)
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
        axios.post('http://testshop.qiqo.hr:9094/DesktopModules/btServices/API/bt/PolasciGet', req)
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
        axios.post('http://testshop.qiqo.hr:9094/DesktopModules/btServices/API/bt/LinijaCjenikGet', req)
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
        axios.post('http://testshop.qiqo.hr:9094/DesktopModules/btServices/API/bt/LinijaCjenikRelacijaGet', req)
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
        axios.post('http://testshop.qiqo.hr:9094/DesktopModules/btServices/API/bt/VozniRedStanice', req)
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
        axios.post('http://testshop.qiqo.hr:9094/DesktopModules/btServices/API/bt/VozniRed', req)
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
        axios.post('http://testshop.qiqo.hr:9094/DesktopModules/btServices/API/bt/RezervacijeGet', req)
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
