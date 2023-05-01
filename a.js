const readXlsxFile = require('read-excel-file/node')
readXlsxFile(exFile).then((rows) => {
    rows.shift()
    database.connect((error) => {
      if (error) {
        console.error(error)
      } else {
        let query = 'INSERT INTO user (id, name, email) VALUES ?'
        connection.query(query, [rows], (error, response) => {
          console.log(error || response)
        })
      }
    })
  })