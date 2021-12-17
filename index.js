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

function mainMenu() {
    const mainMenu = [
        {
            type: "list",
            name: "menuOption",
            message: "What would you like to do?",
            choices: [
                {value: 0, name: "View Employees"},
                {value: 1, name: "View Departments"},
                {value: 2, name: "View Roles"},
                {value: 3, name: "Add Role"},
                {value: 4, name: "Add Department"},
                {value: 5, name: "Add Employee"},
                {value: 6, name: "Update Employee Role"},
                {value: 7, name: "Update Employee Manager"}
            ]
        }
    ]

    inquirer.prompt(mainMenu).then(res => {
        switch(res.menuOption) {
            case 0: viewEmployees(); break
            case 1: viewDepartments(); break
            case 2: viewRoles(); break
            case 3: addRole(); break
            case 4: addDepartment(); break
            case 5: addEmployee(); break
            case 6: updateEmployeeRole(); break
            case 7: updateEmployeeManager(); break;
        }
    });

}


db.connect(() => {
    mainMenu()
})
