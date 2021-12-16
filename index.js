const mysql = require('mysql2')
const inquirer = require('inquirer')
const table = require('console.table')

const Department = require('./lib/Department.js')
const Role = require('./lib/Role.js')
const Employee = require('./lib/Employee.js')

const db = mysql.createConnection('mysql://root:bobby@localhost:3306/employee_db')


function viewEmployees() {
    console.log("You are viewing employees!"); 
}

function viewDepartments() {
    Department.fetchAll(db, (departments) => {
        console.table(departments)

        mainMenu();
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
            choices: ["None"]
        }
    ]

    Role.fetchAll(db, roles => {
        roles.forEach(role => {
            employeeMenu[2].choices.push(role.getTitle())
        })

        const concatEmployeeName = (employee) => {
            return `${employee.getFirstName()} ${employee.getLastName()}`
        }

        Employee.fetchAll(db, employees => {
            employees.forEach(employee => {
                employeeMenu[3].choices.push(concatEmployeeName(employee))
            })

            inquirer.prompt(employeeMenu).then(res => {
                let roleId = null;
                let managerId = null;
                roles.forEach(role => {
                    if(res.role === role.title) {
                        roleId = role.id
                        return
                    }
                })

                employees.forEach(manager => {
                    if(res.manager === concatEmployeeName(manager)) {
                        managerId = manager.id
                    }
                })
                
                Employee.create(db, res.firstName, res.lastName, roleId, managerId)
                mainMenu()
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
            "View Employees",
            "View Departments",
            "View Roles",
            "Add Role",
            "Add Department",
            "Add Employee"
        ]
    }
]

    inquirer.prompt(mainMenu).then(res => {
        switch(res.menuOption) {
            case "View Employees": viewEmployees(); break
            case "View Departments": viewDepartments(); break
            case "View Roles": viewRoles(); break
            case "Add Role": addRole(); break
            case "Add Department": addDepartment(); break
            case "Add Employee": addEmployee(); break
        }
    });

}

db.connect(() => {
    mainMenu()
})
