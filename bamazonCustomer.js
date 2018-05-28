// --------------------------------------------------------------Disclaimer -----------------------------------------------------------//
// any non-standard indentation is intentionally used. It helps me visualize and keep track. Can clean up before production //
// --------------------------------------------------------------Disclaimer ----------------------------------------------------------//
var inquirer = require('inquirer');
var ids =[]; // push id #s into this array to validate inquirer entry 
var Table = require('cli-table');
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
//**********[  inquireCustomer() ]****[  START  ]**********
function inquireCustomer(){
    clearScreen(); // start each session with a clean screen
    // ---[  START ] --- [ Create table of items from database ] ----
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log('Welcome to BAM-azon, where BAM!... deals suddenly appear and quickly sell out.\n\nCurrent inventory: ');
        var table = new Table( { head: ['id#', 'product', 'price'] } ); // create new table everytime, else table is appended too long. Need to refresh/recreate to show "sold out" if applicable 
        for (var i=0; i <res.length; i++){
          table.push([res[i].id, res[i].product_name, '$'+res[i].price]); // pushes row onto table
          ids.push(res[i].id); // pushes just ID#s to array for validation later
        };
        console.log(table.toString());
    // ---[  END ] --- [ Create table of items from database ] ----
    inquirer.prompt([  //---[start of main inquirer]----
        {type: "input",
        name: "id",
        message: "What is the ID# for the product you would like?",
        validate: function(input) {
            // if they input an ID that is in the created array of IDs, move on
            if ( ids.indexOf( parseInt(input) ) !== -1 )  {  return true  }
            // OTHERWISE ...let them know and return false to not validate input (try again)
            else {  console.log("\nCan't find that ID #. Please try again\n");   return false  };
        } // end of validate
        }, //end of 1st inquirer prompt
        {type: "input",
        name: "quantity",
        message: "How many would you like?",
        validate: function(input) {
            // if they input a number, move on
            if ( !isNaN(input) )  {  return true  }
            // OTHERWISE ...let them know and return false to not validate input (try again)
            else {  console.log("\nDoesn't look like a valid number. Please try again\n");   return false  };
        } // end of validate
        } //end of 2nd inquirer prompt
    ])
    .then(function(response){  //promise section of main inquirer
        connection.query("SELECT * FROM products WHERE?",{id : response.id}, function(err, res) {
            if (err) throw err;  //if no error, check order values below....
            // -------------order quantity OK------------- 
            if (parseInt(response.quantity) < res[0].stock_quantity){
                console.log('\nGot it. You ordered ' + response.quantity+ ' ' + res[0].product_name);
                var cost = res[0].price * parseInt(response.quantity);
                console.log('Total cost is: $'+ cost.toFixed(2));
                // update database with reduced stock and add sales to product sales section
                connection.query("UPDATE products  SET stock_quantity=stock_quantity - ?, product_sales=product_sales + ? WHERE id = ?",[parseInt(response.quantity), cost , response.id] , function(err, res) {  if (err) throw err  } );
            } // -------------order ALL remaining stock-------------  they technically should be able to clear out inventory. David mentioned there should be a catch for this so I put one in. 
            else if ((parseInt(response.quantity) === res[0].stock_quantity) &&(res[0].stock_quantity>1) ){ 
                console.log("\nWhoa! Slow down there, Tracy McGREEDY! Can you not clear out our inventory?\nWe got other customers and this doesn't exactly help our 2-star yelp rating! Want to try again?");
            } // -------------order last  remaining item in stock, then delete from database------------- 
             else if ((parseInt(response.quantity) === res[0].stock_quantity) &&(res[0].stock_quantity === 1) ){ 
                console.log("\nLucky you! Snagged the last one!");
                var cost = res[0].price * parseInt(response.quantity);
                console.log('Total cost is: $'+ cost.toFixed(2));
                // Add 'SOLD OUT" to name and update database stock. Add sales to product sales section
                connection.query("UPDATE products  SET product_name = CONCAT('! [SOLD OUT] ! ',product_name), stock_quantity=stock_quantity - ?, product_sales=product_sales + ? WHERE id = ?",[parseInt(response.quantity), cost , response.id] , function(err, res) {  if (err) throw err  } );
            } // -------------order beyond what is in stock-------------  
            else {
                console.log("\nSorry, insufficient quantity. You do realize we're not actually Amazon, right? Our warehouse is some dude's garage. Want to try again?");
            };
            console.log('\n');
            inquirer.prompt([ // ----[start of continue inquirer]---- Prompt to recursively continue or exit
            {type: "confirm",
            name: "continue",
            message: "Would you like to purchase something else?"
            }
        ])
        .then(function(response){
            // if they want to continue, recursively continue
            if (response.continue){ inquireCustomer() }
            // OTHERWISE, end connection
            else { connection.end() };
        });   // ----[end of continue inquirer promise]----
        }); // ----[end of mysql connection in promise of main inquirer]----
    }) //----[end of main inquirer]----
}) // ----[end of mysql connection in inquireCustomer()]----
} //----[end of inquireCustomer()]----
//**********[  inquireCustomer() ]****[  END ]**********
// code to start everything off
  connection.connect(function(err) {
    if (err) throw err;
          inquireCustomer();
      });
