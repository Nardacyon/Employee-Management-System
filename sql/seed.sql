INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Jim", "Gordon", 1, NULL), ("Harvey", "Dent", 3, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Senior Engineer", 150000, 1), ("Accountant", 70000, 2), ("Software Engineer", 110000, 1), ("HR Representative", 50000, 3), ("Salesperson", 50000, 4) 

INSERT INTO department (name) 
VALUES ("R&D"), ("Finance"), ("HR"), ("Marketing");