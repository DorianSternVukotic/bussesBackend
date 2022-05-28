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

prepareBusCardsDataRequest = (customParametersRaw) => {
    let customParameters = JSON.parse(customParametersRaw)
    let numberOfReservations = customParameters.reservationsData.length
    let numberOfPassengers = customParameters.passengerNames.length
    // console.log('numReservations: ',numberOfReservations,' ; numPassengers: ',numberOfPassengers)
    // customParameters.reservationsRaw = JSON.parse(customParameters.reservationsData)
    let buyerInfo = JSON.parse(customParameters.buyer)
    // console.log('buyerInfo: ',buyerInfo)
    // console.log('customParameters: ', customParameters)
    let busCardReservationPrep = []
    let reservationResponses = customParameters.reservedTickets
    let privilegeResponses = customParameters.selectedPrivileges
    // console.log('reservationResponses: ',reservationResponses)
    // console.log('privilegeResponses: ',privilegeResponses)
    for(let i = 0; i < numberOfPassengers; i++) {
        let reservationStringHolder = ''
        let privilegeStringHolder = ''
        let totalStringHolder = ''
        reservationStringHolder = reservationResponses[i].rezervacija.toString()
        privilegeStringHolder =  privilegeResponses[i].povlastica.toString()
        // reservationStringHolder = reservationResponses[i].rezervacija
        // privilegeStringHolder =  privilegeResponses[i].povlastica
        let busCardReservationsPrepHolder = {
            rezervacija: reservationStringHolder,
            voznakarta: '',
            povlastica:  privilegeStringHolder,
            napomena: ''
        }
        if(numberOfReservations != numberOfPassengers){
            let returnReservationStringHolder = ''
            returnReservationStringHolder = reservationResponses[i+numberOfPassengers].rezervacija.toString()
            totalStringHolder =  privilegeResponses[i].cijenapov.toString()
            // returnReservationStringHolder = reservationResponses[i+numberOfPassengers].rezervacija
            // totalStringHolder =  privilegeResponses[i].cijenapov
            busCardReservationsPrepHolder.rezervacijap =  returnReservationStringHolder
            busCardReservationsPrepHolder.ukupno =  totalStringHolder
            busCardReservationsPrepHolder.povratna = 'true'
        } else {
            totalStringHolder =  privilegeResponses[i].cijena.toString()
            // totalStringHolder =  privilegeResponses[i].cijena
            busCardReservationsPrepHolder.ukupno =   totalStringHolder
            busCardReservationsPrepHolder.povratna = 'false'
        }
        busCardReservationPrep.push(busCardReservationsPrepHolder)
    }
    return {...{
            'username': 'pminternet',
            'password': 'pmprodaja',
            'rezervacije': busCardReservationPrep
        }
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
