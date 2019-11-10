var inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazondb"
})

connection.connect(function (err) {
    if (err) {
        console.log(err)
    }
    console.log(`Connected as ${connection.threadId}`)
    displayItems();
})

function displayItems(){
    connection.query("SELECT * FROM products", function(err, response){
        if(err) throw err;
        console.table(response);
        connection.end();
        pickItem();
    });
}

function pickItem(){
    
}
