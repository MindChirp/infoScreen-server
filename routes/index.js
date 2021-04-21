const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const session = require("express-session");
const multiparty = require("multiparty");
const useragent = require("express-useragent");
const validator = require("email-validator");
const nodemailer = require("nodemailer");
const multer = require("multer");
const upload = multer();
const fs = require("file-system");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/images/uploadedImages/organisations');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const { View } = require("grandjs");

View.settings.set("views", "../public/emailviews");
const verifyMail = View.importJsx("verification.jsx");
const { Pool, Client } = require("pg");
var pool;


if(process.env.DEVELOPERMODE) {
  pool = new Pool({
    host: 'localhost',
    user: process.env.USERD,
    password: process.env.PASSWORDD,
    database: process.env.DATABASED,
    port: process.env.PORTD
  })
} else {
  pool = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: {
     rejectUnauthorized: false
   }
 })
}

pool.on("error", (err, client) => {
  console.log("Unexpected error ", err);
  process.exit(-1);
})




router.get('/main', function(req, res, next) {
  if(!req.session.loggedin) {
    res.redirect("/");
    return;
  }
  var source = req.headers['user-agent'],
  ua = useragent.parse(source);
  if(ua.isIE) {
    //Is internet explorer, redirect
    res.render("notSupported");
  }
  res.render("main");
});



router.get('/', function(req, res, next) {
  var source = req.headers['user-agent'];
  ua = useragent.parse(source);
  if(ua.isIE) {
    //Is internet explorer, redirect
    res.locals.title = "Your Browser is Not Supported";
    res.locals.body = "Try using Chrome, Edge, Opera, or something else.";
    res.render("notSupported");
    return;
  } else if(ua.isMobile) {
    res.locals.title = "Mobile Devices aren't Supported Yet"
    res.locals.body = "Try using a desktop device instead.";
    res.render("notSupported")
    return;
  }
  if(!req.session.loggedin) {
    res.locals.signedIn = false;
    res.render("notSignedIn");

    return;
  } 
  res.redirect("/main");

});

router.get('/signOut', (req, res) => {
  if(!req.session.loggedin) {res.redirect("/"); return;}

  req.session.loggedin = false;
  res.redirect("/");
})






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

    //Validate the email
    var isEmailValid = validator.validate(email);
    if(!isEmailValid) {
      res.status(400).send({message: "Email doesn't exist"});
      return;
    }

    var date = new Date();
    var today = date.getDate() + "/" + parseInt(date.getMonth()+1) + "/" + date.getFullYear(); 

    pool.connect((err, client, done) => {
      if (err) throw err
      
      //"INSERT INTO users VALUES('" + user + "', '" + email + "', '" + today + "', 1, '" + pass + "', 0);" LEGACY
      client.query("INSERT INTO users (name, email, date, subscriber, password, dev, validated) VALUES('" + user + "', '" + email + "', '" + today + "', true, crypt('" + pass + "', gen_salt('bf')), false, false);", (err, resu) => {
        done()
        if (err) {
          console.log(err.stack)
          res.send(["ERROR", err]);
        } else {
          if(resu.rows.length == 0) { 
            //Start the verification process
            var response = startVerification(user, email);
            res.status(200).send();
          } else {
            res.send(["ERROR", "Wtf, could not create the user"])
          }
        }
      })
    })
  })
})

function startVerification(user, email) {
  //Add an entry to the validation table
  pool.connect((err, client, done)=>{
    if(err) throw err;
    client.query("INSERT INTO validation (name, email) VALUES ('" + user + "', '" + email + "');", (err, results) => {
      done();
      if(err) {return err} else {
        
        //Send a verification email
        sendVerificationEmail(user, email)
        
        return;
      }
    })
  })
}


function sendVerificationEmail(user, email) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MailUsername,
      pass: process.env.MailPassword
    }
  });

  try {

    var theTemplate = View.renderToHtml(verifyMail);
    var mailOpts = {
      from: 'kevikensen@gmail.com',
      to: email,
      subject: 'Verify Your InfoScreen Account',
      html: theTemplate,
      attachments: [{
        filename: 'icon.png',
        path: './public/images/resources/icon.png',
        cid: 'icon-image'
      }]
    };
    
    transporter.sendMail(mailOpts, (error, info)=>{
      if(error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })

  } catch (error) {
    
  }
}

// Post feedback to database
router.post("/postFeedBack", async (req, res) => {
  if(!req.session.loggedin) {res.send(["ERROR", "User must be signed in"]); return;}

  var data = new multiparty.Form();
  data.parse(req, async (err, fields, files) => {
    if (err) {
      res.end();
      throw err;
    }
    console.log(files);
    var subj = fields.subject[0];
    var email = fields.email[0];
    var body = fields.body[0];
    console.log(email)

    pool.connect((err, client, done) => {
      if (err) throw err
      client.query("INSERT INTO feedback (subject, email, body) VALUES('" + subj + "', '" + email + "', '" + body + "');", (err, resu) => {
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



router.post('/applyOrg', (req, res)=>{

  if(!req.session.loggedin) {res.status(403).send({message:'User not signed in'})};
  if(req.session.hasOrgRegistered) {
    res.status(403).send({message: 'You have already registered an organisation'});
    return;
  }
  var data = new multiparty.Form();
  data.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).send(err);
      throw err;
    }
    var name = fields.name[0];
    var body = fields.desc[0];
    var pass = fields.pass[0];
    var email = req.session.email;

    var usrName = req.session.name;
  
    
    pool.connect((err, client, done) => {
      if (err) {
        console.log(err);
        return;
      }
      client.query("INSERT INTO organisations (name, owner, description, password, email) VALUES('" + name + "', '" + usrName + "', '" + body + "', crypt('" + pass + "', gen_salt('bf')), '" + email + "') RETURNING id;", (err, resu) => {
        done()
        if (err) {
          console.log(err.stack)
          res.status(1).send({message: err});
          res.end();
          return;
        } else {
          if(resu.rows[0]) {                 

            res.send({id: resu.rows[0].id});
            res.end();
          } else {
            res.status(500).send({
              message: 'Could not create organisation'
            });
          }
        }
      })
    })

  })

});

router.post("/org/upload/pfp", async function(req, res) {
  /*if(!req.session.loggedin) {
    res.status(403).send();
  }*/

  var data = new multiparty.Form();
  data.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).send(err);
      throw err;
    }

    var orgId = fields.id[0];
    var imgData = fields.data[0];
//    console.log(Buffer.from(buffer, "binary"));
    await saveImageFromBlob(imgData, "./public/images/uploadedImages/organisations/", orgId)
    .then((result)=>{
      req.session.hasOrgRegistered = true;
      res.status(200).send();
    })
    .catch((result) => {

      res.status(500).send({message: result.error});
    })
  })

}); 

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

async function saveImageFromBlob(baseString, path, name) {
  return new Promise(async(resolve, reject) => {

    var imageBuffer = decodeBase64Image(baseString);

    //Get the image file type
    var type = baseString.split("/")[1].split(";")[0];

    //Save the image
    try {
      fs.writeFile(path + name + "." + type, imageBuffer.data, (err) => {
        if(err) {
          console.log(err);
          reject({status: 'Could not save file', error: err});
        } else {
          resolve()
        }
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  })
}

/* Receive login data */
router.post("/auth", async (req, res) => {

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

    console.log(user, pass);
  
    pool.connect((err, client, done) => {
      if (err) {
        console.log(err);
        return;
      }
      client.query("SELECT name, email, dev, subscriber, date, organisation, id, validated, admin FROM users WHERE email='" + user + "' AND password=crypt('" + pass + "', password);", (err, resu) => {
        done()
        if (err) {
          console.log(err.stack)
          res.status(1).send({message: err});
          res.end();
          return;
        } else {
          if(resu.rows[0]) {
            
            //Cancel the sign in if the user is not validated            
            if(!resu.rows[0].validated) {res.status(403).send({message: 'User not verified. Check email.'}); res.end(); return;}
            

            req.session.loggedin = true;
            req.session.isDeveloper = resu.rows[0].developer;
            req.session.admin = resu.rows[0].admin;
            req.session.name = resu.rows[0].name;
            req.session.id = resu.rows[0].id;
            req.session.email = resu.rows[0].email;

            res.send(["OK", resu.rows]);
            res.end();
          } else {
            req.session.loggedin = false;
            req.session.isDeveloper = 0;
            res.status(403).send({
              message: 'Access denied!'
            });
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


router.get('/organisation/checkStatus', function(req, res) {
  //Check the status of an organisation
  if(!req.session.loggedin) {
    res.status(403).send();
  }

  var name = req.session.name;
  var id = req.session.id;
  var email = req.session.email;


  //Fetch organisation status
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query("SELECT name, accepted, id, owner FROM organisations WHERE owner='" + name + "' AND email='" + email + "';", (err, resu) => {
      done()
      if (err) {
        res.status(500).send({message:'Could not load organisation information'})
      } else {
        if(resu.rows.length > 0) {
          res.status(200).send(resu.rows[0]);
        } else {
          res.status(204).send({message:'No organisation found'});
        }
      }
    })
  })


})



module.exports = router;
