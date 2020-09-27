const connection = require("./db/connection");
const inquirer = require("inquirer");


connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
    startMenu();
});

//functional
function startMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "Start",
            message: "What would you like to do?\n",
            choices: [
                "Add",
                "View",
                "Update",
                "Exit",
            ]
        }
    ]).then(function (res) {
        switch (res.Start) {
            case "Add":
                addMenu();
                break;            
            case "View":
                viewMenu();
                break;            
            case "Update":
                updateMenu();
                break;            
            case "Exit":
                connection.end();
                break;
        }
    });
}
//functional
function addMenu() {
    inquirer.prompt([
        {   
            type: "list",
            name: "AddMenu",
            message: "What would you like to add?\n",
            choices: [
                "Add New Department",
                "Add New Employee",
                "Add New Role"
            ]
        }
    ]).then(function (res) {
        switch (res.AddMenu) {
            case "Add New Department":
                addDepartment();
                break;
            case "Add New Employee":
                addEmployee();
                break;
            case "Add New Role": 
                addRole();
                break;
        }
    });
}

//functional
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
            managers.push("Exit");
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
                console.log(input);
                const roleID = input.role_id;
                const managerID = input.manager_id;
                if (managerID === "Exit") {
                    connection.end();
                } else {
                    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ( ?, ?, ?, ?)",
                        [
                        input.FirstName,
                        input.LastName,
                        roleID,
                        managerID
                        ],
                        (err, res) => {
                            if (err) throw err;
                            console.log("Employee has been added!")
                            console.table(res);
                            startMenu();
                        }
                    );
                }
                
            });
        });
    });
}
//functional
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
            console.table(data);
            console.log("Success");
            startMenu();
        });
    });
}


//functional
function viewMenu() {
    inquirer.prompt([
        {   
            type: "list",
            name: "ViewMenu",
            message: "Select an option \n",
            choices: [
                "View All Employees",
                "View by Department",
                "View by Manager"
            ]
        }
    ]).then(function (res) {
        switch (res.ViewMenu) {
            case "View All Employees":
                viewAll();
                break;
            case "View by Department":
                viewDepartments();
                break;
            case "View by Manager": 
                viewManagers();
                break;
        }
    });
}
//functional
function viewAll() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    })
}
//functional
function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        console.table(data);
        startMenu();
    })
}

// TO DO:

// function addRole() {
    // connection.query("SELECT role.title FROM role", (err, res) => {
    //     if (err) throw err;
    //     const roles = res.map((data) => {
    //         return {
    //             name: data.title,
    //             value: data.role_id
    //         }
    //     });
    // })
// }


// function viewManagers() {
//     connection.query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS manager, employee.id FROM employee", function (err, res) {
//         if (err) throw err;
//         const managers = res.map((element) => {
//             return {
//                 name: element.manager,
//                 value: element.id
//             }
//         });
//         inquirer.prompt([
//             {
//                 type: "list", 
//                 name: "viewManagerMenu",
//                 message: "Select Manager to see their team\n",
//                 choices: managers
//             }
//         ]).then((answers) => {
//             if (err) throw err; 
//             connection.query();
//         });
//     });
// }

// function updateEmployees() {

// }


