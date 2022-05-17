PDFDocument = require('pdfkit')
const QRCode = require('qrcode')
const fs = require('fs')
const fsExtra = require('fs-extra')
let path = require('path');

function buildPDFTicket(data, dataCallback, endCallback){

    const document = new PDFDocument();
    document.on('data', dataCallback);
    document.on('end', endCallback)
    let i = 0
    let busCardTickets = data.busCards
    let parameters = data.customParametersRaw
    busCardTickets.forEach((ticketData) =>{
        i++
        let redni_broj = i.toString() +'.'
        console.log('data inside ticket-',i,': ', ticketData)
        document.fontSize(30).text('Karta: ' + ticketData.brojkarte)
        let currentQRCode = ticketData.qrcode
        let currentImageName = 'qr'+i.toString()+'.png'
        console.log('currentQRCode: ',currentQRCode)
        let imagePath = path.join(__dirname, 'tmp', currentImageName)
        QRCode.toFile(imagePath,currentQRCode, function (err, string) {
            if (err) throw err
            console.log(string)
          } )
        document.fontSize(15).text('QR kod: ' + ticketData.qrcode)
        // console.log('usao2')
        // console.log('imagePath:',imagePath)
        // document.addPage()
        // document.image('tmp/qr1.png')
      
        // document.image(imagePath, {
        //     fit: [250, 300],
        //     align: 'center',
        //     valign: 'center'
        //   })
        console.log('slika_dodana')
        // document.fontSize(20).text('Ruta: '+ ticketData.naziv)
        // document.fontSize(20).text('Prijevoznik: '+ ticketData.txtprijevoznik)
        // document.fontSize(20).text('Polazak: '+ ticketData.polazak)
        // document.fontSize(20).text('Peron polaska: '+ ticketData.peronod)
        // document.fontSize(20).text('Sjedalo: '+ ticketData.sjedala)
        // document.fontSize(20).text('Dolazak: '+ ticketData.dolazak)
        // document.fontSize(20).text('Peron dolaska: '+ ticketData.perondo)
        // document.fontSize(20).text('Trajanje: '+ ticketData.trajanje)
    })

    // ZA BRISANJE FOLDERA
    // fs.readdir(path.join(__dirname,'tmp'), (err, files) => {
    //     if (err) throw err;
      
    //     for (const file of files) {
    //       fs.unlink(path.join(path.join(__dirname,'tmp'), file), err => {
    //         if (err) throw err;
    //       });
    //     }
    //   });
    console.log('obrisan folder')
    document.end();
}

module.exports={buildPDFTicket};