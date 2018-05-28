-- DROP DATABASE IF EXISTS bamazon;
-- CREATE database bamazon;

USE bamazon;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  department_id INT NULL,
  department_name VARCHAR(100) NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (id)
);

SELECT * FROM departments;
