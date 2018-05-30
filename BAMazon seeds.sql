USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
('Cheddar & sour cream ruffles, 12oz bag','food & beverage', 2.99, 1000),
('Diet coke, 2 liter','food & beverage', 0.79, 2000),
('14oz M&Ms, Peanut','food & beverage', 3.99, 300),
('Case Rockstar energy drink 24 pk','food & beverage', 20.99, 40),
('Flair espresso maker','kitchen tools', 129.99, 1),
('Aeropress coffee maker','kitchen tools', 19.99, 2),
('Dexter Russell 8" chef knife','kitchen tools', 18.99, 3),
('10 in Cast iron skillet','kitchen tools', 17.99, 4),
('T192 LED bulb','automotive', 4.99, 75),
('QT 10-40 MOBIL-1 synthetic oil','automotive', 5.99, 100);

INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES 
(1, 'food & beverage', 500),
(2, 'kitchen tools', 300),
(3, 'automotive', 100);

SELECT * FROM products;
SELECT * FROM departments;

