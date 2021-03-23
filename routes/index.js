const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const session = require("express-session");
const multiparty = require("multiparty");
const useragent = require("express-useragent");

const { Pool, Client } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

pool.on("error", (err, client) => {
  console.log("Unexpected error ", err);
  process.exit(-1);
})




router.get('/main', function(req, res, next) {
  console.log(req.session)
  /*
  if(!req.session.loggedin) {
    res.redirect("/");
    return;
  }*/
  var source = req.headers['user-agent'],
  ua = useragent.parse(source);
  if(ua.isIE) {
    //Is internet explorer, redirect
    res.render("notSupported");
  }
  res.render("main")
});



router.get('/', function(req, res, next) {
  var source = req.headers['user-agent'],
  ua = useragent.parse(source);
  if(ua.isIE) {
    //Is internet explorer, redirect
    res.render("notSupported");
  }

  

  if(!req.session.loggedin) {
    res.locals.signedIn = false;
    res.render("notSignedIn");

    res.send("USER NOT SIGNED IN");
  } 
  res.render('index', { title: 'Express' });
});






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

    pool.connect((err, client, done) => {
      if (err) throw err
      client.query("INSERT INTO users VALUES('" + user + "', '" + email + "', '" + today + "', 1, '" + pass + "', 0);", (err, resu) => {
        done()
        if (err) {
          console.log(err.stack)
          res.send(["ERROR", err]);
        } else {
          if(resu.rows.length == 0) {
            res.send(["OK"]);
          } else {
            res.send(["ERROR", "Wtf, could not create the user"])
          }
        }
      })
    })
  })
})



// Post feedback to database
router.post("/postFeedBack", async (req, res) => {
  if(!req.session.loggedin) {res.send(["ERROR", "User must be signed in"]); return;}

  var data = new multiparty.Form();
  data.parse(req, async (err, fields, files) => {
    if (err) {
      res.end();
      throw err;
    }

    var subj = fields.subject[0];
    var email = fields.email[0];
    var body = fields.body[0];

    pool.connect((err, client, done) => {
      if (err) throw err
      client.query("INSERT INTO feedback VALUES('" + subj + "', '" + email + "', '" + body + "');", (err, resu) => {
        done()
        if (err) {
          console.log(err.stack)
          res.send(["ERROR", err]);
        } else {
          if(resu.rows.length == 0) {
            res.send(["OK"]);
          } else {
            res.send(["ERROR", resu]);
          }
        }
      })
    })
  })
});





/* Receive login data */
router.post("/auth", async (req, res) => {
  console.log(req.session.loggedin);
  if(req.session.loggedin) {
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

    pool.connect((err, client, done) => {
      if (err) throw err
      client.query("SELECT * FROM users WHERE email='" + user + "' AND password='" + pass + "';", (err, resu) => {
        done()
        if (err) {
          console.log(err.stack)
          res.send(["ERROR", err]);
        } else {
          if(resu.rows[0]) {
            console.log("SETTING STATE TO LOGGED IN")
            req.session.loggedin = true;
            req.session.isDeveloper = resu.rows[0].developer;
            res.send(["OK", resu.rows]);
          }
        }
      })
    })
  })
});


router.get('/feedBackLogs', async function(req, res) {
  req.setTimeout(7000, ()=>{
    res.send(["ERROR", "Request timed out"]);
  })
  if(!req.session.loggedin) {
    res.send(["ERROR", "Server cannot authenticate the user"]);
    return;
  }
  if(req.session.isDeveloper) {

    //Fetch the logs
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('SELECT * FROM feedback', (err, resu) => {
        done()
        if (err) {
          console.log(err.stack)
          res.send(["ERROR", err]);
        } else {
          if(resu.rows.length > 0) {
            res.send(["OK", resu.rows]);
          } else {
            res.send(["ERROR", "There is nothing to load"]);
          }
        }
      })
    })
    
  } else {
    var msg = "USER IS NOT DEVELOPER";
    console.log(msg);
    res.send([msg]);
  }
});


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
