const mysql = require("mysql"); 
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Yunona701701",
  database: "email",
});
connection.connect((err) => { 
    if(err) throw err;
    console.log("database connected!!!");
});
module.exports = connection;