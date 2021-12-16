
class Employee {
    constructor(firstName, lastName, roleId, managerId, id = null) {
        this.firstName = firstName
        this.lastName = lastName
        this.roleId = roleId
        this.managerId = managerId
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
                roles.push(new Role(employee.first_name, employee.last_name, employee.role_id, employee.manager_id, employee.id))
            })
            successCallback(roles)
        }
    })
}

function fetchAllWithRDM(db, successCallback) {
    db.query("SELECT * FROM employee LEFT JOIN role(employee.role_id) LEFT JOIN department(role.department_id) LEFT JOIN manager(employee.manager_id)", (err, result) => {
        if(err) {
            console.log(err)
            return []
        } else {
            let employees = []
            result.forEach((employee, i) => {
                roles.push(new Role(employee.first_name, employee.last_name, employee.role_id, employee.manager_id, employee.id))
            })
            successCallback(roles)
        }
    })
}

function create(firstName, lastName, roleId, managerId) {
    let employeeData = {first_name: firstName, last_name: lastName, role_id: roleId, manager_id: managerId};
    db.query("INSERT INTO role SET ?", employeeData, (err, data) =>{
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