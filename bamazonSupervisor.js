// --------------------------------------------------------------Disclaimer -----------------------------------------------------------//
// any non-standard indentation is intentionally used. It helps me visualize and keep track. Can clean up before production //
// --------------------------------------------------------------Disclaimer ----------------------------------------------------------//
var inquirer = require('inquirer');
var Table = require('cli-table');
var header = ['dept_id','dept_name', 'over_head_cost','product_sales','total_profit'] //Default header items from products table
var table = new Table( { head: header } );
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
//**********[  supervisorView() ]****[  START  ]**********
function supervisorView(){
    inquirer.prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
              "View Product Sales by Department",
              "Create New Department"
            ]
          })
          .then(function(answer) {
            switch (answer.action) {
            case  "View Product Sales by Department":  viewSales(); break;
            case "Create New Department":  createNewDept();  break;
            }
          });
    };
//**********[  supervisorView() ]****[  END ]**********

//-----------[  viewSales() ]----[  START  ]----------
function viewSales(){
    //  select all items needed in header. Use Aliases for (sum of product sales) and (for total profits) 
    query = 'SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) AS product_sales, SUM(product_sales) - over_head_costs AS total_profit'
    // get info from departments and prodcts table using INNER JOIN. Only get info for matching department names. (if you add a dept but have no products, the dept will not show) 
    query+= ' FROM departments INNER JOIN products ON departments.department_name = products.department_name'
    //group the info by department_id and display that way 
    query+= ' GROUP BY department_id;'
connection.query(query, function(err, res) {
        if (err) throw err;
        console.log('\n(CONFIDENTIAL) Financial Summary: ');
        // ---[  START ] --- [ Create table of items from database ] ----
        for (var i=0; i <res.length; i++){
          table.push([res[i].department_id,  res[i].department_name, '$'+res[i].over_head_costs.toFixed(2), '$'+res[i].product_sales.toFixed(2), '$'+res[i].total_profit.toFixed(2)]);
          }
        console.log(table.toString());
        // ---[  END ] --- [ Create table of items from database ] ---- 
        console.log('...technically this is inaccurate. Product sales above is technically "department revenue".\n You need to subtract overhead cost AND cost of goods to get total profit.\n\nThis only makes sense if...\n(1) All products "fell off of a truck" and is free for Bamazon OR \n(2) Creative accounting to appease venture capitalists and source another round of seed funding\nfor a Bay Area startup that burns through piles of cash without making a profit\n(i.e. SELECT bamazon FROM unicorns INNER JOIN tech bubble)\n\nLuckily we are in the coding bootcamp and not the DATA SCIENCE cohort!  ')
        connection.end();  
    }); // end of connection query
}; // end of viewSales
//-----------[  viewSales() ]----[   END  ]----------

//**********[  createNewDept() ]****[  START  ]**********
function createNewDept(){
    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err;
        // ---[  START ] --- [ Create table of items from database ] ----
        console.log('\nCurrent inventory: ');
        var header = ['dept_id','dept_name', 'over_head_cost']; //These are the only items in department table
        var table = new Table( { head: header } );
        for (var i=0; i <res.length; i++){
            table.push([res[i].department_id, res[i].department_name, '$'+res[i].over_head_costs ]);
        }
        console.log(table.toString());
        // -----[END  display inventory] -----
    inquirer.prompt([  // inquire about what to change
        {type: "input",
        name: "name",
        message: "What is the new dept name?",
        validate: function(input) {
            // if they input something, move on
            if ( !!input )  {  return true  }
            // OTHERWISE ...let them know and return false to not validate input (try again)
            else {  console.log("\nCan you please type something in?\n");   return false  };
        } // end of validate
        }, //end of 1st inquirer prompt
        {type: "input",
        name: "overhead",
        message: "How much is the overhead?",
        validate: function(input) {
            // if they input a number, move on
            if ( !isNaN(input) )  {  return true  }
            // OTHERWISE ...let them know and return false to not validate input (try again)
            else {  console.log("\nDoesn't look like a valid number. Please try again\n");   return false  };
        } // end of validate
        } //end of 2nd inquirer prompt
    ]).then(function(response){
            // updates database by inserting new values 
            connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES(?,?)",[response.name, response.overhead] , function(err, res) {  
                if (err) throw err; 
                console.log('Dept Added!'); 
                connection.end();    
            }); //end of connection query to update
    }) //end of promise section of inquirer
    }) //end of initial query    
}; // end of createNewDept()
//**********[  createNewDept() ]****[   END  ]**********

//----------- start of connection---------
  connection.connect(function(err) {
    if (err) throw err;
    clearScreen();
    supervisorView();
});