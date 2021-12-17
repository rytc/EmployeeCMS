const inquirer = require("inquirer");

function selectDepartment(departments, msg = 'Select a department: ') {
    const deptMenu = [
        {
            type: 'list',
            name: 'id',
            message: msg,
            choices: []
        }
    ]

    departments.forEach(dept => deptMenu[0].choices.push({value: dept.id, name:dept.name}));
    return inquirer.prompt(deptMenu);
}

function selectEmployee(employees, msg = 'Select an Employee') {
    let menuOptions = [
            {
                type:"list",
                name: "id",
                message: msg,
                choices: []
            }
        ];
    employees.forEach(employee => menuOptions[0].choices.push({value:employee.id, name:`${employee.getFirstName()} ${employee.getLastName()}`}))
    return inquirer.prompt(menuOptions)
}

function addRole(departments) {
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

    departments.forEach(dept => roleMenu[2].choices.push({value:dept.id, name:dept.name}))
    return inquirer.prompt(roleMenu)
}

function confirm() {
    let sure = inquirer.prompt(
        [{
            type: 'list',
            message: 'Are you sure?',
            name: 'answer',
            choices: [{value: true, name:'Yes'}, 
                        {value:false, name:'No'}]
        }])
    return sure
}



module.exports = {
    selectDepartment: selectDepartment,
    selectEmployee: selectEmployee,
    addRole: addRole,
    confirm: confirm
}