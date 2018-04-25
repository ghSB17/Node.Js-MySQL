var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "bamazon",

    // Your password
    password: "",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    promptManager();
});

function invalidInput() {
    console.log('Invalid Input!');
    promptManager();
}

function promptManager() {
    inquirer.prompt([{
        type: 'list',
        message: 'Choose an Option:',
        name: 'managerChoice',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
    }, ]).then(function (managerResponse) {
        switch (managerResponse.managerChoice) {
            case 'View Products for Sale':
                displayInventory();
                break;
            case 'View Low Inventory':
                displayLowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                addNewProduct();
                break;
            case 'Exit':
                connection.end();
        }
    })

}

function display(results) {

    console.log('Product Info');
    console.log('===| ========================================== | ======================= | ====== | ===================  ');
    console.log('ID |                Name                        |     department_Name     |  Price |  Quantity_Available  ');
    console.log('===| ========================================== | ======================= | ====== | ===================  ');
    for (var i = 0; i < results.length; i++) {

        console.log(results[i].item_id + '  |' +
            results[i].product_name + '|' +
            results[i].department_name + '|' +
            results[i].price + '|' +
            results[i].stock_quantity);
    }
    console.log('=====================================================================================================================');

}

function displayInventory() {

    connection.query('SELECT * FROM `products_TB`', function (error, results) {
        // error will be an Error if one occurred during the query
        if (error) throw error;
        // results will contain the results of the query
        display(results);
        promptManager();
    });

}

function displayLowInventory() {
    connection.query('SELECT * FROM `products_TB` WHERE stock_quantity < 5', function (error, results) {
        if (error) throw error;
        display(results);
        promptManager();
    });
}

function addToInventory() {
    var products = [];
    connection.query('SELECT product_name FROM `products_TB`', function (error, results) {
        for (var i = 0; i < results.length; i++) {
            products.push(results[i].product_name);
        }
        inquirer.prompt([{
                type: 'list',
                message: 'Choose a Product to Add Inventory:',
                name: 'productChoice',
                choices: products
            },
            {
                type: 'input',
                message: 'Enter the quantity:',
                name: 'quantity',
            },
        ]).then(function (managerResponse) {
            if (!isNaN(managerResponse.quantity)) {
                if (parseInt(managerResponse.quantity) > 0) {
                    connection.query('SELECT stock_quantity,price FROM `products_TB` WHERE product_name=?', [managerResponse.productChoice], function (err, results) {
                        if (err) throw error;
                        console.log(results[0].stock_quantity);
                        var quantityFinal = parseInt(results[0].stock_quantity) + parseInt(managerResponse.quantity);
                        console.log(quantityFinal);
                        connection.query('UPDATE `products_TB` SET stock_quantity=? WHERE product_name=?', [quantityFinal, managerResponse.productChoice], function (error, resultsUpdate) {
                            if (error) throw error;
                            console.log("Quantity Successfully Updated!");
                            displayInventory();
                        });

                    });
                } else {
                   invalidInput();
                }
            } else {
                invalidInput();
            }
        })
    })
}

function addNewProduct() {

}