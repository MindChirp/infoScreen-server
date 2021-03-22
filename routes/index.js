const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const session = require("express-session");
const multiparty = require("multiparty");

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
//Just incase someone were to stumble upon the server.. Oopsies :)
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*

LEGACY. GITHUB IS NOW USED AS THE AUTHENTICATION SERVER.

router.post("/version-control/:ver", function(req, res) {
  var clientVer = req.params.ver;
  console.log(clientVer);
  if(clientVer == "0.0.2") {
    res.send("OK!");
  } else{
    res.send("OUT OF DATE.");
  }
})

*/



router.post("/register", async(req, res) => {
  var data = new multiparty.Form();
  data.parse(req, async (err, fields, files) => {
    if(err) {
      res.end();
      throw err;
    }

    var user = fields.user[0];
    var email = fields.email[0];
    var pass = fields.password[0];
    var date = new Date();
    var today = date.getDate() + "/" + parseInt(date.getMonth()+1) + "/" + date.getFullYear(); 
    try {
      const client = await pool.connect();
      const result = await client.query("INSERT INTO users VALUES('" + user + "', '" + email + "', '" + today + "', 1, '" + pass + "', 0);");
      const results = (result) ? result.rows : null;
      if(results.length == 0) {
        res.send(["OK"]);
      } else {
        res.send(["ERROR", "Wtf, could not create the user"]);
      }
    } catch (error) {
      console.log(error);
      res.send(["ERROR", error]);
    }


  })
})


/* Receive login data */
router.post("/auth", async (req, res) => {
  if(req.session.loggedIn) {
    res.send(["USER ALREADY SIGNED IN"]);
    return;
  }
  var data = new multiparty.Form();
  data.parse(req, async (err, fields, files) => {
    if (err) {
      res.end();
      throw err;
    }

    var user = fields.user[0];
    var pass = fields.password[0];
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM users WHERE email='" + user + "' AND password='" + pass + "';");
      const results = (result) ? result.rows : null;
      if(results.length != 0) {
        req.session.loggedin = true;
        console.log(results[0].developer);
        req.session.isDeveloper = results[0].developer;
        res.send(["OK", results]);
      } else {
        res.send(["INCORRECT"]);
      }
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
  })
})



/*

THIS IS LEGACY CODE FROM ANOTHER PROJECT. HOWEVER, IT MIGHT BE USED TO STORE PROFILE PICTURES AND SO ON..

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

*/




module.exports = router;
