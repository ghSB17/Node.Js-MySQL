DROP DATABASE bamazon_DB;

CREATE DATABASE bamazon_DB;
USE bamazon_DB;

-- command line 
create user 'bamazon'@'localhost' identified by '';
GRANT ALL PRIVILEGES ON bamazon_DB.* TO 'bamazon'@'localhost';

CREATE TABLE products_TB (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price FLOAT(15,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY( item_id )
);

INSERT INTO products_TB ( product_name, department_name, price, stock_quantity) 
VALUES ( 'Cheerios' , 'Grocery', '3.64','8'),('Honey Bunches Of Oats','Grocery', '3.28', '10'), 
	('Apple IPAD 325GB Gray', 'Electronics','329.00', '4'),
    ('Lenova ThinkPad X1 Tablet', 'Electronics', '1769.43', '8'),
    ( 'Microsoft Surface Pro', 'Electronics', '1039.00', '2'),
    ( 'JavaScript and Jquery : Interactive Front-End Web Development', 'Books', '17.19','2'),
    ( 'Node.Js 8 the Right Way : Practical, Server-Side JavaScript That Scales', 'Books', '31.08','5'),
    ( 'Learning Angular : A Hands-On Guide to Angular','Books', '21.18','5'),
    ( 'Dove', 'Personal Care', '10.88', '20'),
    ( 'Jergens Moisturizer', 'Personal Care', '8.64', '18');