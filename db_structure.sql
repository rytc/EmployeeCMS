CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE role (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY(role_id) REFERENCES role(id),
    FOREIGN KEY(manager_id) REFERENCES employee(id)
);


USE employee_db;
SELECT 
   employee.id, 
   employee.first_name, 
   employee.last_Name, 
   role.title as title, 
   dept.name AS department,
   role.salary AS salary,
   CONCAT(mgr.first_name, ' ', mgr.last_name) as manager
FROM employee 
   LEFT JOIN role ON employee.role_id = role.id 
   LEFT JOIN department dept ON role.department_id = dept.id 
   LEFT JOIN employee mgr ON employee.manager_id = mgr.id;

use employee_db;
SELECT DISTINCT employee.id, employee.first_name, employee.last_name
FROM employee
	INNER JOIN employee sub ON sub.manager_id = employee.id;
    
use employee_db;
SELECT SUM(role.salary),
department.name AS department
FROM role
LEFT JOIN department ON department.id = role.department_id
WHERE role.department_id = 3
    
    
    
    
    
    
    
    
    
    
    