var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require("express-session");
var multiparty = require("multiparty");
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}) 
/*
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "infoscreen"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});*/



router.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    res.send(JSON.stringify(results));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post("/version-control/:ver", function(req, res) {
  var clientVer = req.params.ver;
  console.log(clientVer);
  if(clientVer == "0.0.2") {
    res.send("OK!");
  } else{
    res.send("OUT OF DATE.");
  }
})


router.get("/db")
/* Receive login data */
router.post("/auth", async (req, res) => {
  var data = new multiparty.Form();
  data.parse(req, async (err, fields, files) => {
    if (err) {
      res.end();
      throw err;
    }

    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM test_table");
      const results = { 'results': (result) ? result.rows : null};
      res.send(["OK", results])
      client.release();

      return;

/*
      var results = [
        {
          name: 'Frikk Ormestad Larsen',
          email: 'frikk44@gmail.com',
          creationDate: "2002-08-04T22:00:00.000Z",
          subscriber: 1,
          password: 'frikkern123'
        }
      ]
  */    
      //res.send(["OK", results]);
    } catch (error) {
      console.log(error);
      res.send("ERROR " + err);
    }


    return;

    //If the login sohuld be made on the calendardb servers
    //Passwords are currently unencrypted, but hey, fuck that
    console.log(fields.user[0]);
      db.query("SELECT * FROM users WHERE email=? AND password=?", [fields.user[0], fields.password[0]], function (error, results, fields) {
        if (error) {
          res.send(["ERROR: COULD NOT HANDLE REQUEST"]);
        } else {
          if (results.length > 0) {
            res.send(["OK", results]);
            req.session.loggedIn = true;
            req.session.username = results[0].username;
            req.session.save();
          } else {
            res.send(["INCORRECT"]);
          }
        }
      })
  })
})


router.post("/bilder/upload", function(req, res) {
  if(req.session.loggedin && req.session.admin) {
    var data = new multiparty.Form({uploadDir:'../public/images/uploadedImages'});
    data.parse(req, function(err, fields, files) {
      if(err) throw err;
      var count = Object.keys(files).length;
      var namesArr = [];

      console.log(count);

      res.send(namesArr);
    });
  } else {
    res.end();
  }

}); 




module.exports = router;
