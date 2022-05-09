prepareRequestBody= (req) => {
    return {...{
            'username': 'pminternet',
            'password': 'pmprodaja',
        },...req.body
    }
}

addToRequestBody= (req, additionalData) => {
    return {...req.body,
        ...{
            'username': 'pminternet',
            'password': 'pmprodaja',
        },
          ...additionalData
    }
}

prepareBusCardsDataRequest = (req, customParameters) => {
    reservationData = customParameters.reservations
    return {
        'username': 'pminternet',
        'password': 'pmprodaja',
        'rezervacije': reservationData,
      //,...req.body
    }
}

prepareReservationData = (reqBody) => {
    var reservationsAllWays = reqBody.reservations
    var allReservations = []
    reservationsAllWays.forEach(reservationsWay => {
        reservationsWay = JSON.parse(reservationsWay)
        allReservations.push(reservationsWay)
    })
    var preparedReservations = allReservations.map(reservation => {
        return {
            linija: reservation.line,
            bus: reservation.bus,
            datum: reservation.date,
            stanicaod: reservation.stationfrom,
            stanicado: reservation.stationto,
            povlastica: reservation.discount,
            povratna: reservation.isreturn,
        }
    })

    delete reqBody.reservations
    reqBody.rezervacije = preparedReservations
    return reqBody

}

exports.prepareBusCardsDataRequest = prepareBusCardsDataRequest
exports.prepareRequestBody = prepareRequestBody
exports.prepareReservationData = prepareReservationData
exports.addToRequestBody = addToRequestBody
