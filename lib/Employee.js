
class Employee {
    constructor(firstName, lastName, roleId, managerId, id = null) {
        this.firstName = firstName
        this.lastName = lastName
        this.roleId = roleId
        this.managerId = managerId
        this.id = id
    }

    getFirstName() {
        return this.firstName
    }

    getLastName() {
        return this.lastName
    }
}

function fetchAll(db, successCallback) {
    db.query("SELECT * FROM employee", (err, result) => {
        if(err) {
            console.log(err)
            return []
        } else {
            let employees = []
            result.forEach((employee, i) => {
                employees.push(new Employee(employee.first_name, employee.last_name, employee.role_id, employee.manager_id, employee.id))
            })
            successCallback(employees)
        }
    })
}

function fetchAllWithRDM(db, successCallback) {
    let query = `
    SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title AS role, 
        dept.name AS department,
        role.salary AS salary,
        CONCAT(mgr.first_name, ' ', mgr.last_name) as manager
    FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department dept ON role.department_id = dept.id 
        LEFT JOIN employee mgr ON employee.manager_id = mgr.id; 
    `
    db.query(query, (err, result) => {
        if(err) {
            console.log(err)
            return []
        } else {
            let employees = []
            result.forEach((employee, i) => {
                let newEmployee = new Employee(employee.first_name, employee.last_name, employee.role_id, employee.manager_id, employee.id)
                delete newEmployee.roleId
                delete newEmployee.roleId
                newEmployee.department = employee.department
                newEmployee.role = employee.role
                newEmployee.salary = employee.salary
                newEmployee.manager = employee.manager
                employees.push(newEmployee)
            })
            successCallback(employees)
        }
    })
}

function create(db, firstName, lastName, roleId, managerId) {
    let employeeData = {first_name: firstName, last_name: lastName, role_id: roleId, manager_id: managerId};
    db.query("INSERT INTO employee SET ?", employeeData, (err, data) =>{
        if(err) {
            console.log(err)
        }
    })
}

module.exports = {
    fetchAll: fetchAll,
    fetchAllWithRDM: fetchAllWithRDM,
    create: create,
}