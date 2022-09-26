const mysql = require("mysql"); 
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});
connection.connect((err) => { 
    if(err) throw err;
    console.log("database connected!!!");
});
module.exports = connection;