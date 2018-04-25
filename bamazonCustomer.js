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

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayInventory();
});

//Display the content of the Table products_tb to the User
function displayInventory() {
    connection.query('SELECT * FROM `products_TB`', function (error, results) {
        // error will be an Error if one occurred during the query
        if(error) throw error;
        // results will contain the results of the query
        
        console.log('Product Info');
        console.log('===| ========================================== | ======================= | ====== | ===================  ');
        console.log('ID |                Name                        |     department_Name     |  Price |  Quantity_Available  ');
        console.log('===| ========================================== | ======================= | ====== | ===================  ');
        for( var i=0;i<results.length;i++){
            
            console.log(results[i].item_id + '  |'
            +results[i].product_name+ '|'
            +results[i].department_name+ '|'
            +results[i].price+ '|'
            +results[i].stock_quantity);
        }
        console.log('=====================================================================================================================');
      });
      promptCustomer();
}
// Create a "Prompt" with a series of questions.
function promptCustomer() {
    var productList=[];
    var product ='';
    connection.query('SELECT item_id, product_name FROM `products_TB`', function (error, results) {
        for(var i=0;i<results.length;i++) {
            productList.push( results[i].product_name );
        }
        inquirer.prompt([
                {
                    type: 'list',
                    message: 'Choose a Product:',
                    name: 'productChoice',
                    choices: productList
                },
        ]).then( function(productResponse) {
                
                product = productResponse.productChoice;
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'Enter the Quantity You Would Like to Purchase:',
                        name: 'quantityChoice'
                    },
                ]).then( function(qunatityResponse) {
                    updateProduct(product,qunatityResponse.quantityChoice);
                });
        });
    });
}

function updateProduct( product, quantity ){
    connection.query('SELECT stock_quantity,price FROM `products_TB` WHERE product_name=?', [product], function(err,results){
        if(err) throw error;
        console.log(results[0].stock_quantity);
        if( parseInt(results[0].stock_quantity)>parseInt(quantity) ) {
            var quantityFinal=parseInt(results[0].stock_quantity)-parseInt(quantity);
            var cost = parseFloat(results[0].price)*parseInt(quantity);
            console.log(quantityFinal);
            connection.query('UPDATE `products_TB` SET stock_quantity=? WHERE product_name=?', [quantityFinal,product], function(error, resultsUpdate){
                console.log('You are charged: $'+cost+' for '+quantity+' of '+product);
                connection.end();
            })
        } else {
            console.log('Insufficient Quantity!');
            connection.end();
        }
    })
}