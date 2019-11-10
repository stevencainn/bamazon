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
    managerChoices();
})

function managerChoices() {
    inquirer.prompt({
        name: "managerAnswer",
        type: "list",
        message: "Do you want to [View Products] for Sale, View [Low Inventory], [Add to Inventory], [Add New Product] ",
        choices: ["View Products", "Low Inventory", "Add to Inventory", "Add New Product"]
    })
        .then(function (answer) {
            switch (answer.managerAnswer) {
                case "View Products":
                    displayItems();
                    break;
                case "Low Inventory":
                    // shows low inventory
                    break;
                case "Add to Inventory":
                    //adds item to inventory
                    break;
                case "Add New Product":
                    //adds new item
                    break;
            }
        });
}


function displayItems() {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        console.table(response);
    });
};
