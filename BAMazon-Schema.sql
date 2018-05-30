DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL(10,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  over_head_costs DECIMAL(10,2) NOT NULL DEFAULT 500,
  PRIMARY KEY (department_id)
);

SELECT * FROM products;

SELECT * FROM departments;