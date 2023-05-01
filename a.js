const readXlsxFile = require('read-excel-file/node')
readXlsxFile(path.join(__dirname,'users.csv')).then((rows) => {
    rows.shift()
    db.connect((error) => {
      if (error) {
        console.error(error)
      } else {
        let query = 'INSERT INTO user (name,email,phoneNo,address1,address2,city,state,zipcode) VALUES ?'
        db.query(query, [rows], (error, response) => {
          console.log(error || response)
        })
      }
    })
  });