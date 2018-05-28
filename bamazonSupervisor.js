// --------------------------------------------------------------Disclaimer -----------------------------------------------------------//
// any non-standard indentation is intentionally used. It helps me visualize and keep track. Can clean up before production //
// --------------------------------------------------------------Disclaimer ----------------------------------------------------------//
var inquirer = require('inquirer');
var ids = [];
var Table = require('cli-table');
var header = ['dept_id','dept_name', 'over_head_cost','product_sales','total_profit']
var table = new Table({
    head: header
});
// -------mySQL section----[START]-------
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,             // Your port; if not 3306
    user: "root",           // Your username
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
    var query = "SELECT department_name, over_head_costs, product_sales"
    query += 'FROM products'
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log('\nCurrent inventory: ');
        for (var i=0; i <res.length; i++){
          table.push([res[i].id,  res[i].product_name, '$'+res[i].price, res[i].stock_quantity]);
          }
          console.log(table.toString());
          connection.end();  
    });
};
//-----------[  viewSales() ]----[   END  ]----------

//**********[  createNewDept() ]****[  START  ]**********
function createNewDept(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // -----[START  display inventory] -----  (I want to reuse viewProducts(), but async nature starts inquirer before table is drawn. Can't get timing down)
        console.log('\nCurrent inventory: ');
        header.push('department')
        for (var i=0; i <res.length; i++){
            table.push([res[i].id, res[i].product_name, '$'+res[i].price, res[i].stock_quantity,  res[i].department_name]);
            ids.push(res[i].id);  
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
        }
        },
        {type: "input",
        name: "overhead",
        message: "How much is the overhead?",
        validate: function(input) {
            // if they input a number, move on
            if ( !isNaN(input) )  {  return true  }
            // OTHERWISE ...let them know and return false to not validate input (try again)
            else {  console.log("\nDoesn't look like a valid number. Please try again\n");   return false  };
        }
        },
        {type: "input",
        name: "id",
        message: "What is the dept id#?",
        validate: function(input) {
            // if they input a number, move on
            if ( !isNaN(input) )  {  return true  }
            // OTHERWISE ...let them know and return false to not validate input (try again)
            else {  console.log("\nDoesn't look like a valid number. Please try again\n");   return false  };
        }
        }
    ]).then(function(response){
                connection.query("INSERT INTO departments (department_id, department_name, over_head_costs) VALUES(?,?,?)",[response.id , response.name, response.overhead] , function(err, res) {  
                    if (err) throw err; 
                    console.log('Dept Added!'); 
                    connection.end();    
        });
})
    })     
};
//**********[  createNewDept() ]****[   END  ]**********

//----------- start of connection---------
  connection.connect(function(err) {
    if (err) throw err;
    clearScreen();
    supervisorView();
      });
