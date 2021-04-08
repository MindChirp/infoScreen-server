const { Pool, Client } = require("pg");
var pool;



if(true) {
  pool = new Pool({
    host: 'localhost',
    user: "postgres",
    password: "8Frikkfrikkern8",
    database: "infoscreen",
    port: "3000"
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


//Send the request to the database
  
pool.connect((err, client, done) => {
    if (err) {
      console.log(err);
      return;
    }

    //Get the time
    var date = new Date();
    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    client.query("DELETE FROM validation WHERE timecreated < (extract(epoch FROM now())-600);", (err, resu) => {
      done()
      if (err) {
        console.log(err.stack)
        return;
      } else {
        console.log(resu.rows)
      }
    })
  })