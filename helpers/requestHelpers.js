prepareRequestBody= (req) => {
    return {...req.body,
        ...{
            'username': 'pminternet',
            'password': 'pmprodaja'
        }
    }
}

prepareReservationData = (reqBody) => {
    var reservationsAllWays = JSON.parse(reqBody.reservations)
    var allReservations = []
    reservationsAllWays.forEach(reservationsWay => {
        reservationsWay.forEach(reservation => {
            allReservations.push(reservation)
        })
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

exports.prepareRequestBody = prepareRequestBody
exports.prepareReservationData = prepareReservationData
