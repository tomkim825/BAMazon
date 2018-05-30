// --------------------------------------------------------------Disclaimer -----------------------------------------------------------//
// any non-standard indentation is intentionally used. It helps me visualize and keep track. Can clean up before production //
// --------------------------------------------------------------Disclaimer ----------------------------------------------------------//
var inquirer = require('inquirer');
var ids = [];
var Table = require('cli-table');
var header = ['id#','product', 'price','quantity in stock']
var table = new Table(  { head: header } );
// -------mySQL section----[START]-------
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,           // Your port; if not 3306
    user: "root",         // Your username
    password: "",       // Your password
    database: "bamazon"
  });
// -------mySQL section----[ END ]-------
//*******************************************************************
// **     Above reserved for initializing app  + global variables   **
//*******************************************************************

//--------[  clearScreen() ]-----[  START  ]-----------
function clearScreen(){
    process.stdout.write('\033c');   // clears the console before displaying result [windows powershell users]
    console.log('\033[2J');   // clears the console before displaying result [linux users... probably mac also. Does nothing on windows powershell] 
}
//--------[  clearScreen() ]-----[  END  ]-----------
//**********[  managerView() ]****[  START  ]**********
function managerView(){
    inquirer.prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
              "View Products for Sale",
              "View Low Inventory",
              "Add to Inventory",
              "Add New Product",
              "Exit"
            ]
          })
          .then(function(answer) {
            switch (answer.action) {
            case  "View Products for Sale":  viewProduct(); break;
            case "View Low Inventory":  viewLowInventory();  break;
            case  "Add to Inventory":  addInventory();  break;
            case "Add New Product":  addProduct();  break;
            case "Exit":  connection.end();  break; //end connection and back to terminal line
            } // end of switch case
            clearScreen(); // clear screen after function is finished but before it recursively starts over
          } ); // end of inquirer promise
    }; 
//**********[  managerView() ]****[  END ]**********

//-----------[  viewProduct() ]----[  START  ]----------
function viewProduct(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log('Current inventory: ');
        // ---[  START ] --- [ Create table of items from database ] ----
        var header = ['id#','product', 'price','quantity in stock']; // all headers are listed
        var table = new Table(  { head: header } ); // create new table everytime, else table is appended too long. Need to refresh/recreate to remove "sold out" if applicable 
        for (var i=0; i <res.length; i++){
          table.push([res[i].id,  res[i].product_name, '$'+res[i].price, res[i].stock_quantity]);// pushes row onto table
          }
        console.log(table.toString());
        // ---[  END ] --- [ Create table of items from database ] ----
        managerView(); //recursively call inquirer for next choice 
    }); // end of connection query
};
//-----------[  viewProduct() ]----[   END  ]----------

//**********[  viewLowInventory() ]****[  START  ]**********
function viewLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
        if (err) throw err;
        console.log('Inventory less than 5: ');
        // ---[  START ] --- [ Create table of items from database ] ----
        var header = ['id#','product','quantity in stock']; // price header not listed
        var table = new Table(  { head: header } );// create new table everytime, else table is appended too long. Need to refresh/recreate to remove "sold out" if applicable 
        for (var i=0; i <res.length; i++){
          table.push([res[i].id, res[i].product_name, res[i].stock_quantity]);// pushes row onto table
          }
        console.log(table.toString());
         // ---[  END ] --- [ Create table of items from database ] ----  
         managerView(); //recursively call inquirer for next choice 
    }); // end of connection query
};
//**********[  viewLowInventory() ]****[   END  ]**********

//-----------[  addInventory() ]----[  START  ]----------
function addInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log('Current inventory: ');
        // ---[  START ] --- [ Create table of items from database ] ----
        var header = ['id#','product', 'quantity in stock']; // price header not listed
        var table = new Table(  { head: header } );// create new table everytime, else table is appended too long. Need to refresh/recreate to remove "sold out" if applicable 
        for (var i=0; i <res.length; i++){
          table.push([res[i].id, res[i].product_name, res[i].stock_quantity]); // pushes row onto table
          ids.push(res[i].id);  // pushes just ID#s to array for validation later
        }
        console.log(table.toString());
        // ---[  END ] --- [ Create table of items from database ] ---- 
        inquirer.prompt([  // inquire about what to change
            {type: "input",
            name: "id",
            message: "What is the ID# for the product you would like to add to?",
            validate: function(input) {
                // if they input an ID that is in the created array of IDs, move on
                if ( ids.indexOf( parseInt(input) ) !== -1 )  {  return true  }
                // OTHERWISE ...let them know and return false to not validate input (try again)
                else {  console.log("\nCan't find that ID #. Please try again\n");   return false  };
            } // end of validate
            }, //end of 1st inquirer prompt
            {type: "input",
            name: "quantity",
            message: "How many would you like to add?",
            validate: function(input) {
                // if they input a number, move on
                if ( !isNaN(input) && (input >0) )  {  return true  }
                // OTHERWISE ...let them know and return false to not validate input (try again)
                else {  console.log("\nDoesn't look like a valid number. Please try again\n");   return false  };
            } // end of validate
            }, //end of 2nd inquirer prompt
        ]).then(function(response){  //promise section of addInventory() inquirer
                    connection.query("SELECT stock_quantity, product_name FROM products WHERE id = ?",[response.id], function(err, res) { //check quantity to see if it was sold out. If it was, the sold out portion will be removed 
                    if (err) throw err;
                    if(res[0].stock_quantity === 0) { //if the item stock is 0, it will have '!! [sold out]' prepended to it
                        var newProductName = res[0].product_name.slice(15) // slice out the  '!! [sold out]' before adding new inventory. UPDATE name in code below
                        connection.query("UPDATE products  SET product_name = ? WHERE id = ?",[newProductName , response.id] , function(err, res) {   if (err) throw err; });
                    } // end of if statement to check if sold out
                    }); //end of 1st query connection to check if it is sold out
                    // code below to update quantity by adding to current quantity 
                    connection.query("UPDATE products  SET stock_quantity= stock_quantity + ? WHERE id = ?",[response.quantity , response.id] , function(err, res) {  
                        if (err) throw err; 
                        console.log('Inventory updated!'); 
                        managerView();//recursively call inquirer for next choice 
                    }); // end of 3rd query update
        }) //end of promise section of addInventory() inquirer
    })
};
//-----------[  addInventory() ]----[   END  ]----------

//**********[  addProduct() ]****[  START  ]**********
function addProduct(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log('Current inventory: ');
        // ---[  START ] --- [ Create table of items from database ] ----
        var header = ['id#','product', 'price','quantity in stock','department']; //added department so user can see it for reference
        var table = new Table(  { head: header } ); 
        for (var i=0; i <res.length; i++){
            table.push([res[i].id, res[i].product_name, '$'+res[i].price, res[i].stock_quantity,  res[i].department_name]); // pushes row onto table
            ids.push(res[i].id);  // pushes just ID#s to array for validation later
        }
        console.log(table.toString());
       // ---[  END ] --- [ Create table of items from database ] ---- 

    inquirer.prompt([  // inquire about what to change
        {type: "input",
        name: "name",
        message: "What is the product name?",
        validate: function(input) {
            // if they input something, move on
            if ( !!input )  {  return true  }
            // OTHERWISE ...let them know and return false to not validate input (try again)
            else {  console.log("\nCan you please type something in?\n");   return false  };
        } // end of validate
        }, //end of 1st inquirer prompt
        {type: "input",
        name: "deptName",
        message: "What department is this product in?",
        validate: function(input) {
            // if they input something, move on
            if ( !!input )  {  return true  }
            // OTHERWISE ...let them know and return false to not validate input (try again)
            else {  console.log("\nCan you please type something in?\n");   return false  };
        } // end of validate
        }, //end of 2nd inquirer prompt
        {type: "input",
        name: "price",
        message: "What is the price?",
        validate: function(input) {
            // if they input a number, move on
            if ( !isNaN(input) )  {  return true  }
            // OTHERWISE ...let them know and return false to not validate input (try again)
            else {  console.log("\nCan you please type in the price?\n");   return false  };
        } // end of validate
        }, //end of 3rd inquirer prompt
        {type: "input",
        name: "quantity",
        message: "How many would you like to add?",
        validate: function(input) {
            // if they input a number, move on
            if ( !isNaN(input) )  {  return true  }
            // OTHERWISE ...let them know and return false to not validate input (try again)
            else {  console.log("\nDoesn't look like a valid number. Please try again\n");   return false  };
        } // end of validate
        }, //end of 4th inquirer prompt
        ]).then(function(response){
             // updates database by inserting new values 
            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES(?,?,?,?)",[ response.name, response.deptName, response.price , response.quantity] , function(err, res) {  
            if (err) throw err; 
            console.log('Product Added!'); 
            managerView(); //recursively call inquirer for next choice 
            }); // end of connection query to push new product
    }) // end of promise section of addProduct() inquirer
    }) // end of 1st connection query to load values for table before inquirer.      
};
//**********[  addProduct() ]****[   END  ]**********

//----------- start of connection---------
  connection.connect(function(err) {
    if (err) throw err;
    clearScreen();
    managerView();
      });
