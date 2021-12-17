const mysql = require('mysql2')
const inquirer = require('inquirer')
const table = require('console.table')

const Menu = require('./lib/Menu.js')
const Department = require('./lib/Department.js')
const Role = require('./lib/Role.js')
const Employee = require('./lib/Employee.js')

const db = mysql.createConnection('mysql://root:bobby@localhost:3306/employee_db')


function viewEmployees() {
    Employee.fetchAllWithRDM(db)
        .then(employees => {
            console.table(employees)
            mainMenu()
        })
}

function viewEmployeesByManager() {
    Employee.fetchAllManagers(db)
        .then(managers => Menu.selectEmployee(managers, 'Select a manager: ')
        .then(manager => Employee.fetchAllByManager(db, manager.id))
        .then(employees => {
            console.table(employees)
            mainMenu()
        }))
}

function viewDepartments() {
    Department.fetchAll(db)
        .then((departments) => {
            console.table(departments)
            mainMenu()
        })
}

function viewRoles() {
    Role.fetchAll(db)
        .then(roles => {
            console.table(roles)
            mainMenu()
        })
}

function addRole() {
    Department.fetchAll(db)
        .then(departments => Menu.addRole(departments)
        .then(newRole => {
            Role.create(db, newRole.title, newRole.salary, newRole.department)
            mainMenu()
        }))
}

function addDepartment() {
    const deptMenu = [
        {
            type: 'input',
            name: 'name',
            message: 'Department Name: '
        }
    ]

    inquirer.prompt(deptMenu).then(res => {
        Department.create(db, res.name);
        mainMenu()
    })
}

function viewDepartmentBudget() {
    Department.fetchAll(db)
        .then(departments => Menu.selectDepartment(departments)
        .then(dept        => Role.fetchBudgetByDepartment(db, dept.id)
        .then(budgets     => { if(budgets[0].budget != null) console.table(budgets); mainMenu() })))
}

function viewAllDepartmentBudgets() {
    Role.fetchBudgets(db)
        .then(result => {
            if(result[0].budget != null) {
                console.table(result)
            }
            mainMenu()
        })
}

function addEmployee() {
    const employeeMenu = [
        {
            type: 'input',
            name: 'firstName',
            message: "First Name: "
        },
        {
            type: "input",
            name: "lastName",
            message: "Last Name: "
        },
        {
            type: "list",
            name: "role",
            choices: []
        },
        {
            type: "list",
            name: "manager",
            choices: [{value: null, name:"None"}]
        }
    ]

    Role.fetchAll(db)
        .then(roles => {
            roles.forEach(role => {
                employeeMenu[2].choices.push({value: role.id, name: role.getTitle()})
            })

            const concatEmployeeName = (employee) => {
                return `${employee.getFirstName()} ${employee.getLastName()}`
            }

            Employee.fetchAll(db)
                .then(employees => {
                    employees.forEach(employee => {
                        employeeMenu[3].choices.push({ value:employee.id, name:concatEmployeeName(employee)})
                    })

                    inquirer.prompt(employeeMenu).then(res => {
                        Employee.create(db, res.firstName, res.lastName, res.role, res.manager)
                        mainMenu()
                    })
                })

        })
}

function updateEmployeeRole() {
    const menuEmployee = [
        {
            type: 'list',
            message: "Which employee do you want to update the role for?",
            name: 'employee',
            choices: []
        }
    ]

    const menuRole = [
        {
            type: 'list',
            message: 'Which role should this employee be moved to?',
            name: 'role',
            choices: []
        }
    ]

    Employee.fetchAll(db)
        .then(employees => {
            employees.forEach(employee => menuEmployee[0].choices.push({value:employee.id, name:`${employee.getFirstName()} ${employee.getLastName()}`}))
            Role.fetchAll(db)
                .then(roles => {
                    roles.forEach(role => {
                        menuRole[0].choices.push({value: role.id, name:role.title})
                    })

                    inquirer.prompt(menuEmployee).then(empl => {
                        inquirer.prompt(menuRole).then(rl => {
                            Employee.updateRole(db, empl.employee, rl.role)
                            mainMenu()
                        })
                    })
                })
        })
}

function updateEmployeeManager() {
    const menuEmployee = [
        {
            type: 'list',
            message: "Which employee do you want to update the manager for?",
            name: 'employee',
            choices: []
        }
    ]

    const menuManager = [
        {
            type: 'list',
            message: 'Which manager should this employee have?',
            name: 'manager',
            choices: []
        }
    ]

    Employee.fetchAll(db)
        .then(employees => {
            employees.forEach(employee => menuEmployee[0].choices.push({value:employee.id, name:`${employee.getFirstName()} ${employee.getLastName()}`}))
            employees.forEach(employee => menuManager[0].choices.push({value:employee.id, name:`${employee.getFirstName()} ${employee.getLastName()}`}))

            inquirer.prompt(menuEmployee).then(empl => {
                inquirer.prompt(menuManager).then(mgr => {
                    Employee.updateManager(db, empl.employee, mgr.manager)
                    mainMenu()
                })
            })
        })
}

function deleteEmployee() {
    const menuOptions = [
        {
            type: 'list',
            message: 'Which employee do you want to delete?',
            name: 'employee',
            choices: []
        }
    ]

    Employee.fetchAll(db)
        .then(employees => {
            employees.forEach(employee => menuOptions[0].choices.push({value: employee.id, name:`${employee.getFirstName()} ${employee.getLastName()}`}))
            inquirer.prompt(menuOptions).then(res => Menu.confirm()
                .then(sure => {
                    if(sure.answer) Employee.deleteEmployee(db, res.employee);
                    mainMenu()
                }))
        })
}

function deleteRole() {
    const menuOptions = [
        {
            type: 'list',
            message: 'Which role do you want to delete? (This will also remove the role from the employees)',
            name: 'role',
            choices: []
        }
    ]

    Role.fetchAll(db)
        .then(roles => {
            roles.forEach(role => menuOptions[0].choices.push({value: role.id, name: role.title}))
            inquirer.prompt(menuOptions).then(res => {
                Menu.confirm().then(sure => {
                    if(sure.sure) {
                        Employee.removeRoleFromAll(db, res.role);
                        Role.deleteRole(db, res.role);
                    }
                    mainMenu()
                })        
            })
        })
}

function deleteDepartment() {
    Department.fetchAll(db)
        .then(departments => Menu.selectDepartment(departments, 'Select a department to delete, this will also delete the roles.')
        .then(dept => Menu.confirm()
        .then(sure => { if(sure.answer) {
            Role.fetchRolesByDepartment(db, dept.id)
            .then(roles => {
                roles.forEach(role => {
                    Employee.removeRoleFromAll(db, role.id);
                })
            });
            
            Role.deleteRoleByDepartment(db, dept.id)
            Department.deleteDepartment(db, dept.id)

            mainMenu()
        }})))
}

function mainMenu() {

    let mainMenuOptions = [
        { name: "View Employees", run: viewEmployees }, 
        { name: "View Employees by Manager", run: viewEmployeesByManager  },
        { name: "View Departments", run: viewDepartments },
        { name: "View Department Budget", run: viewDepartmentBudget },
        { name: "View All Budgets", run: viewAllDepartmentBudgets },
        { name: "View Roles", run: viewRoles },
        { name: "Add Role", run: addRole },
        { name: "Add Department", run: addDepartment },
        { name: "Add Employee", run: addEmployee },
        { name: "Update Employee Role", run: updateEmployeeRole },
        { name: "Update Employee Manager", run: updateEmployeeManager },
        { name: "Delete Employee", run: deleteEmployee },
        { name: "Delete Role", run: deleteRole },
        { name: "Delete Department", run:deleteDepartment}
    ]

    const mainMenu = [
        {
            type: "list",
            name: "menuOption",
            message: "What would you like to do?",
            choices: []
        }
    ]

    mainMenuOptions.forEach((opt, index) => mainMenu[0].choices.push({value:index, name: opt.name}));
    inquirer.prompt(mainMenu).then(res => mainMenuOptions[res.menuOption].run());
}


db.connect(() => {
    mainMenu()
})
