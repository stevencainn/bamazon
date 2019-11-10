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
        pickItem();
    });
}

function pickItem(){
    inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the item_id you would like to purchase?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?"
    }]).then(function(answer){
        
        var product = answer.item;
        var quantity = answer.quantity;
        var userCost;
        var updateQuantity;

        connection.query("SELECT * FROM products WHERE ?", {item_id: product}, function(err, response){
            if(err) throw err;
            console.log(response[0]);
            if(quantity > response[0].stock_quantity){
                console.log("Insufficient Quantity!!")
            }else {
                userCost = quantity * response[0].price;
                updateQuantity = response[0].stock_quantity - quantity;
                console.log(`
                You have purchased ${quantity} of ${response[0].product_name}
                Your total is: ${userCost}`);
            }

            connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: updateQuantity}, {item_id: product}], function(err, response){
                if (err) throw err;
                console.log("Inventory Updated")
            })

    



            connection.end();

        })
    })

};
