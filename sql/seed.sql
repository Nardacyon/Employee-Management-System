INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("The 25th", "Baam", 6, NULL), ("Aguero Agnes", "Khun", 8, 1), ("Rak", "Wraithraiser", 7, 1), ("Endorsi", "Jahad", 6, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Senior Engineer", 150000, 1), ("Accountant", 70000, 2), ("Software Engineer", 110000, 1), ("HR Representative", 50000, 3), ("Salesperson", 50000, 4), ("Fisherman", 150000, 5), ("Spear-Bearer", 130000, 5), ("Lighthouse", 130000, 5);

INSERT INTO department (name) 
VALUES ("R&D"), ("Finance"), ("HR"), ("Marketing"), ("TOG");