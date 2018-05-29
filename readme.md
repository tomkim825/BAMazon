# Bamazon-CLI

## learning objectives:
This assignment demonstrates knowledge of mySQL, SQL databases, and manipulating databases via Node. 

## Walkthough
There are 3 different functionalities of bamazon: 
1. bamazonCustomer
2. bamazonManager
3. bamazonSupervisor
run whichever one you would like

```
Before running this app, 
run npm i ... or run these commands one at a time 

npm install inquirer
npm install mysql

*******		SQL database		 *******
Please run the SQL schemas and seeds to populate the database so the app runs correctly	

*******     Commands to run Bamazon     *******

node bamazonCustomer.js
node bamazonManager.js
node bamazonSupervisor.js
```

## bamazonCustomer
![gif of customer terminal](https://github.com/tomkim825/BAMazon/blob/master/customer.gif)

All items in 'products' table will be displayed, showing, ids, names, and prices. Then user will be prompted to pick the id of the product they want to buy. Next, the user will be prompted how many.

- if the quantity is within stock quanitites, the total cost will be shown and the database will be updated to reflect it. The sales will be also noted for supervisor view
- if the quantity is equal to stock quantities, the user will be prompted to select less
	- if the quantity is equal to stock quantity and the last remaining item, the user may purchase it. The item will display "sold out" the next time (until a manager restocks it) 
- if the quantity is greater than stock quantity, the user will be prompted to select less

The user will be prompted to purchase more and recursively run the app again, or to exit.

## bamazonManager
![gif of manager terminal](https://github.com/tomkim825/BAMazon/blob/master/manager.gif)

  * List a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

  - If a manager selects `View Products for Sale`, the app lists every available item: the item IDs, names, prices, and quantities.

  - If a manager selects `View Low Inventory`, then all items with an inventory count lower than five are listed.

  - If a manager selects `Add to Inventory`, a prompt will let the manager "add more" of any item currently in the store.

  - If a manager selects `Add New Product`, prompts will allow a completely new product to the store

## bamazonSupervisor
![gif of manager terminal](https://github.com/tomkim825/BAMazon/blob/master/supervisor.gif)

 - Running this application will list a set of menu options:

   * View Product Sales by Department
   
   * Create New Department

 - When a supervisor selects `View Product Sales by Department`, the app will display a summarized table in their terminal/bash window. 

 - The `total_profit` column will be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` is not stored in any database but uses a custom alias.


