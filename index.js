const mysql = require('mysql2')
const inquirer = require('inquirer')
const table = require('console.table')

const Department = require('./lib/Department.js')
const Role = require('./lib/Role.js')
const Employee = require('./lib/Employee.js')

const db = mysql.createConnection('mysql://root:bobby@localhost:3306/employee_db')


function viewEmployees() {
    Employee.fetchAllWithRDM(db, employees => {
        console.table(employees)
        mainMenu()
    })
}

function viewEmployeesByManager() {
    mainMenu()
}

function viewDepartments() {
    Department.fetchAll(db, (departments) => {
        console.table(departments)
        mainMenu()
    })
}

function viewRoles() {
    Role.fetchAll(db, roles => {
        console.table(roles)
        mainMenu()
    })
}

function addRole() {
    const roleMenu = [
        {
            type: 'input',
            name: 'title',
            message: "Role Name: "
        },
        {
            type: 'input',
            name: 'salary',
            message: "Role Salary"
        },
        {
            type: 'list',
            name: 'department',
            message: "Department",
            choices: []
        }
    ]

    Department.fetchAll(db, depts => {
        depts.forEach(dept => {
            roleMenu[2].choices.push(dept.name)
        });

        inquirer.prompt(roleMenu).then(req => {
            let deptId = null
            depts.forEach(dept => {
                if(dept.name === req.department) {
                    deptId = dept.id
                    return
                }
            })

            //console.log(`Creating Role ${req.title} with a salary of $${req.salary} in ${req.department} (id:${deptId})`);
            Role.create(db, req.title, req.salary, deptId)
            mainMenu()
        })
    })
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

    Role.fetchAll(db, roles => {
        roles.forEach(role => {
            employeeMenu[2].choices.push({value: role.id, name: role.getTitle()})
        })

        const concatEmployeeName = (employee) => {
            return `${employee.getFirstName()} ${employee.getLastName()}`
        }

        Employee.fetchAll(db, employees => {
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

    Employee.fetchAll(db, employees => {
        employees.forEach(employee => menuEmployee[0].choices.push({value:employee.id, name:`${employee.getFirstName()} ${employee.getLastName()}`}))
        Role.fetchAll(db, roles => {
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

    Employee.fetchAll(db, employees => {
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



function mainMenu() {

    let mainMenuOptions = [
        {
            name: "View Employees",
            run: viewEmployees
        }, 
        {
            name: "View Employees by Manager",
            run: viewEmployeesByManager
        },
        {
            name: "View Departments",
            run: viewDepartments
        }, 
        { 
            name: "View Roles",
            run: viewRoles
        },
        {
            name: "Add Role",
            run: addRole
        },
        {
            name: "Add Department", 
            run: addDepartment
        },
        {
            name: "Add Employee",
            run: addEmployee
        },
        {
            name: "Update Employee Role",
            run: updateEmployee
        },
        {
            name: "Update Employee Manager",
            run: updateEmployeeManager
        }
    ]

    const mainMenu = [
        {
            type: "list",
            name: "menuOption",
            message: "What would you like to do?",
            choices: []
        }
    ]

    mainMenuOptions.forEach((opt, index) => mainMenu.choices.push({value:index, name: opt.name}));
    inquirer.prompt(mainMenu).then(res => mainMenuOptions[res.menuOption].run());
}


db.connect(() => {
    mainMenu()
})
