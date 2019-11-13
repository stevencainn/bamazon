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
                    lowInv();
                    break;
                case "Add to Inventory":
                    addStock();
                    break;
                case "Add New Product":
                    addNew();
                    break;
            }
        });
}


function displayItems() {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        console.table(response);
        connection.end();
    });
};


function lowInv() {
    connection.query("SELECT * FROM Products WHERE stock_quantity <=25", function (err, response) {
        if (err) throw err;
        console.table(response);
        connection.end();
    })

};


function addStock() {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        console.table(response);

        inquirer
            .prompt([
                {

                    name: "item",
                    type: "input",
                    message: "What is the item_id of the item you would like to update stock on?"
                }, {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to add?"
                }
            ]).then(function (answer) {

                var productUpdate = answer.item;
                var quantityUpdate = answer.quantity;
                var itemInventory;

                connection.query("SELECT * FROM products WHERE ?", { item_id: productUpdate }, function (err, response) {
                    if (err) throw err;
                    itemInventory = (response[0].stock_quantity + parseInt(quantityUpdate));
                    console.log(itemInventory);
                    
                    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: itemInventory }, { item_id: productUpdate }], function (err, response) {
                        if (err) throw err;
                        console.log("Inventory Updated");
                        connection.end();

                    })
                })
            })
    });
}


function addNew(){
    inquirer
            .prompt([
                {

                    name: "item",
                    type: "input",
                    message: "What is the item you would like to add?"
                }, {
                    name: "dep",
                    type: "input",
                    message: "Department of item?"
                },{
                    name: "price",
                    type: "input",
                    message: "Price of product?"
                },{
                    name: "stock",
                    type: "input",
                    message: "How many would you like to list?"
                }
                ]).then(function (answer){
                var product = answer.item;
                var department = answer.dep;
                var price = answer.price;
                var stock = answer.stock



                connection.query(`INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES(?, ?, ?, ?)`, [product, department, price, stock], function(err, response){
                    if (err) throw err;
                        console.log("Product Added to Shop!");
                        connection.end();

                })

            })   
    }
