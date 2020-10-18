const connection = require("./db/connection");
const inquirer = require("inquirer");

connection.connect(function (err) {
    if(err) throw err;
    console.log(`CONNECTED`);
    startMenu();
});

function startMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "MainMenu",
            message: "What would you like to do? \n",
            choices: [
                "View All Employees",
                "View by Department",
                "View by Manager",
                "View All Roles", 
                "Add New Department",
                "Add New Employee",
                "Add New Role",
                "Update Employee Role",
                "Remove Employee",
                "Remove Role",
                "Remove Department",
                "Exit"
            ]
        }
    ]).then(function (res){
        switch (res.MainMenu) {
            case "View All Employees":
                viewAll();
                break;
            case "View by Department":
                viewDepartments();
                break;
            case "View by Manager": 
                viewByManager();
                break;
            case "View All Roles":
                viewByRoles();
                break;
            case "Add New Department":
                addDepartment();
                break;
            case "Add New Employee":
                addEmployee();
                break;
            case "Add New Role": 
                addRole();
                break;
            case "Update Employee Role": 
                updateEmployeeRole();
                break;
            case "Remove Employee":
                rmEmployee();
                break;
            case "Remove Role":
                rmRole();
                break;
            case "Remove Department":
                rmDept();
                break;
            case "Exit":
                connection.end();
                break;
        }
    });
}

function viewAll() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    });
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        console.table(data);
        startMenu();
    });
}

function viewByManager() {
    connection.query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS manager, employee.id FROM employee", (err, res) => {
        if (err) throw err; 
        const managers = res.map((element) => {
            return {
                name: element.manager,
                value: element.id
            }
        });
        inquirer.prompt([
            {
                type: "list",
                name: "SelectManager",
                message: "Which manager would you like to filter by?\n",
                choices: managers
            }
        ]).then((answers) => {
            connection.query("SELECT * FROM employee WHERE manager_id = ?", [answers.SelectManager], (err, res) => {
                if (err) throw err;
                console.table(res);
                startMenu();
            });
        });
    });
}

function viewByRoles() {
    connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err;
        console.table(data);
        startMenu();
    });
}

function addEmployee() {
    connection.query("SELECT role.role_id, role.title FROM role", (err, res) => {
        if (err) throw err;
        const roles = res.map((data) => {
            return {
                name: data.title,
                value: data.role_id
            }
        });
        connection.query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS manager, employee.id FROM employee", (err, res) => {
            if (err) throw err;
            const managers = res.map((element) => {
                return {
                    name: element.manager,
                    value: element.id
                }
            });
            managers.push("NONE");
            inquirer.prompt([
                {
                    type: "input",
                    name: "FirstName",
                    message: "What is the employee's first name? \n",
                },        
                {
                    type: "input",
                    name: "LastName",
                    message: "What is the employee's last name? \n",
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "What is the employee's role? \n",
                    choices: roles
                },
                {
                    type: "list",
                    name: "manager_id", 
                    message: "Who is their manager? \n",
                    choices: managers
                }
            ]).then(function (input) {
                if (input.manager_id === "NONE") {
                    input.manager_id = null;
                }
                connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ( ?, ?, ?, ?)",
                    [
                        input.FirstName,
                        input.LastName,
                        input.role_id,
                        input.manager_id
                    ],
                (err) => {
                    if (err) throw err;
                    console.log("Employee has been added!");
                    startMenu();
                });
            });
        });
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department", 
            message: "What is the name of the department you want to add? \n"
        }
    ]).then(function (res) {
        connection.query("INSERT INTO department (name) VALUES (?)", [res.department], function (err, data) {
            if (err) throw err;
            console.log("Success");
            startMenu();
        });
    });
}

function addRole() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        const dept = res.map((data) => {
            return {
                name: data.name,
                value: data.department_id
            }
        });

        inquirer.prompt([
                {
                    type: "input",
                    name: "roleTitle",
                    message: "What is the role that you want to add?\n"
                },
                {
                    type: "input",
                    name: "roleSalary",
                    message: "What is their rounded salary?\n"
                    //validate?
                },
                {
                    type: "list",
                    name: "selectDeptID",
                    message: "What department do they belong to? \n",
                    choices: dept
                }
        ]).then(function (res) {
            connection.query("INSERT INTO role (title, salary, department_id) VALUES ( ?, ?, ?)", 
                [
                    res.roleTitle,
                    res.roleSalary,
                    res.selectDeptID
                ], 
            function(err) {
                if (err) throw err; 
                console.log("Success");
                startMenu();
            });
        });

    });
}

function updateEmployeeRole() {
    connection.query("SELECT role.role_id, role.title FROM role", (err, res) => {
        if (err) throw err;
        const roles = res.map((row) => {
            return {
                name: row.title,
                value: row.role_id,
            };
        });
        connection.query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS currentEmployee, employee.id FROM employee",
            (err, res) => {
                if (err) throw err;

                const employees = res.map((element) => {
                    return {
                        name: element.currentEmployee,
                        value: element.id,
                    };
                });
                inquirer.prompt([
                    {
                        type: "list",
                        name: "employeeSelect",
                        message: "Select the employee you would like to update?\n",
                        choices: employees
                    },
                    {
                        type: "list",
                        name: "roleSelect",
                        message: "What will be their new role?\n",
                        choices: roles
                    }
                ]).then((answers) => {
                    console.log(answers.roleSelect);
                    console.log(answers.employeeSelect);
                    connection.query("UPDATE employee SET employee.role_id = ? WHERE employee.id = ?",
                        [
                            answers.roleSelect,
                            answers.employeeSelect,
                        ],
                        (err) => {
                            if (err) throw err;
                            console.log("UPDATED");
                            startMenu();
                        }
                    );
                });
            }
        );
    });
}

function rmEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if(err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                type: "input",
                name: "RemoveEmployee",
                message: "What is the ID of the employee you want to remove? (Reference table above)\n"
            }
        ]).then(function (answer) {
            connection.query("DELETE FROM employee WHERE id = ?", [answer.RemoveEmployee], function () {
                console.log("Employee has been removed");
                startMenu();
            });
        });
    });
}

function rmRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                type: "input",
                name: "RemoveRole",
                message: "What is the role_id of the title you want to remove?\n"
            }
        ]).then(function (answer) {
            connection.query("DELETE FROM role WHERE role_id = ?", [answer.RemoveRole], function () {
                console.log("Role has been removed");
                startMenu();
            });
        });
    });
}

function rmDept() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                type: "input",
                name: "RemoveDept",
                message: "What is the department_id of the branch you want to remove?\n"
            }
        ]).then(function (answer) {
            connection.query("DELETE FROM department WHERE department_id = ?", [answer.RemoveDept], function () {
                console.log("Department has been removed");
                startMenu();
            });
        });
    });
}