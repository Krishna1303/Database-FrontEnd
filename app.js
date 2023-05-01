const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const credentials = require(path.join(__dirname, 'credentials.js'));

const errorMessages = {
  "1": "Please enter your name",
  "2": "Please enter your email address",
  "3": "Please enter your phone number",
  "4": "Please enter your address line 1",
  "5": "Please enter the city",
  "6": "Please enter the state",
  "7": "Please enter the zip code",
  "8": "Please select atleast one column"
}
const errorMessagesButtonText = {
  "1": "Back to add user form",
  "2": "Back to home"
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: credentials.host,
  user: credentials.user,
  password: credentials.password,
  database: credentials.database
});
console.log(db.host);
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
var logger = (req, res, next) => {
  console.log(req.originalUrl);
  next();
}
app.use(logger);
app.get('/addUserForm', (req, res) => {
  res.render('addUser.ejs', {});
})
app.post('/addUser', (req, res) => {
  if (req.body.name) {
    if (req.body.email) {
      if (req.body.phoneNo) {
        if (req.body.address1) {
          if (req.body.city) {
            if (req.body.state) {
              if (req.body.zipcode) {
                const sql = `INSERT INTO user(name,email,phoneNo,address1,address2,city,state,zipcode) VALUES (
                            '${req.body.name}','${req.body.email}','${req.body.phoneNo}','${req.body.address1}','${req.body.address2}','${req.body.city}','${req.body.state}','${req.body.zipcode}')`;
                db.query(sql, (err, result) => {
                  if (err) {
                    throw err;
                  }
                  res.redirect('/users');
                });
              }
              else {
                res.redirect('/errorPage?en=7&ebtn=1');
              }
            }
            else {
              res.redirect('/errorPage?en=6&ebtn=1');
            }
          }
          else {
            res.redirect('/errorPage?en=5&ebtn=1');
          }
        }
        else {
          res.redirect('/errorPage?en=4&ebtn=1');
        }
      }
      else {
        res.redirect('/errorPage?en=3&ebtn=1');
      }
    }
    else {
      res.redirect('/errorPage?en=2&ebtn=1');
    }
  }
  else {
    res.redirect('/errorPage?en=1&ebtn=1');
  }
});
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM user';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.render('users.ejs', { users: result });
  });
});
app.get('/queryPage', (req, res) => {
  res.render('select_query.ejs', { results: [] });
});
app.post('/queryPageResults', (req, res) => {
  console.log(req.body.columns);
  console.log(typeof req.body.columns);
  const selectedColumns = JSON.parse(req.body.columns);
  let sqlQuery = 'SELECT ';
  if (!selectedColumns || selectedColumns.length === 0) {
    sqlQuery += '*';
  } else {
    sqlQuery += selectedColumns.join(',');
  }
  sqlQuery += ' FROM user';
  db.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.render('query_result.ejs', { results: results,columns:selectedColumns });
  });
});

app.get('/errorPage', (req, res) => {
  const errorNumber = req.query.en;
  const errorButtonTextNumber = req.query.ebtn;
  res.render('error.ejs', { data: { message: errorMessages[errorNumber], buttonText: errorMessagesButtonText[errorButtonTextNumber] } });
})

app.get('/', async (req, res) => {
  res.redirect('/users');
});
