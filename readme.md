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
 