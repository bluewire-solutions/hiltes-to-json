const fs = require('fs')
const csv = require('fast-csv')

function parse (filename) {
  const data = {}

  data.bestand = []
  data.hwg = []
  data.wg = []
  data.lieferant = []
  data.farbcode = []
  data.products = []

  return new Promise((resolve, reject) => {
    fs.createReadStream(filename)
      .pipe(csv.parse({
        headers: false,
        delimiter: ';',
        trim: true,
        encoding: 'latin1'
      }))
      .on('error', error => console.error(error))
      .on('data', row => {
        const tableName = row[0]
        switch (tableName) {
          case 'Datei': {
            // drop
            break
          }
          case 'Filiale': {
            // drop
            break
          }
          case 'land': {
            // drop
            break
          }
          case 'anrede': {
            // drop
            break
          }
          case 'nlart': {
            // drop
            break
          }
          case 'hwg': {
            data.hwg[row[1]] = row[2]
            break
          }
          case 'wg': {
            data.wg[row[1]] = row[2]
            break
          }
          case 'lieferant': {
            data.lieferant[row[1]] = {
              company: row[2],
              address1: row[3],
              address2: row[4],
              address3: row[5],
              zip: row[6],
              city: row[7],
              phone: row[8],
              mobile: row[9],
              fax: row[10],
              web: row[11]
            }
            break
          }
          case 'farb': {
            data.farbcode[row[1]] = row[2]
            break
          }
          case 'Bestand': {
            // process.stdout.write('.');
            data.bestand.push({
              EAN: row[3],
              Abteilung: row[4],
              HWG: row[5],
              WG: row[6],
              Lieferant: row[7],
              Zielgruppe: row[8],
              Artikelname: row[9],
              Farbe: row[10],
              Farbcode: row[11],
              Wareneingangsdatum: row[14],
              Groesse: row[15],
              Preis1UVP: row[18],
              Preis2VKP: row[19],
              Preis3: row[20],
              MwSt: row[21],
              Modell: row[22],
              Saison: row[24],
              Jahr: row[25],

              Menge: 1
            })
            break
          }
          default: {
            console.error('Don\'t know how to handle ' + tableName)
          }
        }
        // console.log(row)
      })
      .on('end', rowCount => {
        // pre-join data / sanitize
        data.bestand.forEach((el) => {
          // pre-join
          el.HWGName = data.hwg[el.HWG]
          el.WGName = data.wg[el.WG]
          el.FarbcodeName = data.farbcode[el.Farbcode]
          el.LieferantData = data.lieferant[el.Lieferant]

          // sanitize
          el.Preis1UVP = parseInt(el.Preis1UVP, 10) / 100
          el.Preis2VKP = parseInt(el.Preis2VKP, 10) / 100
          el.Preis3 = parseInt(el.Preis3, 10) / 100
          el.MwSt = parseInt(el.MwSt, 10) / 100
          el.EAN = el.EAN.substring(el.EAN.length - 13, el.EAN)

          // restructure
          if (typeof data.products[el.Modell] === 'undefined') {
            data.products[el.Modell] = []
          }

          if (typeof data.products[el.Modell][el.EAN] === 'undefined') {
            data.products[el.Modell][el.EAN] = el
          } else {
            data.products[el.Modell][el.EAN].Menge++
          }
        })

        resolve(data)
      })
  })
}

module.exports = parse
