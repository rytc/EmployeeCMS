
class Role {
    constructor(title, salary, departmentId, id = null) {
        this.title = title
        this.salary = salary
        this.departmentId = departmentId
        this.id = id
    }

    getTitle() {
        return this.title
    }
}

function fetchAll(db, successCallback) {
    db.query("SELECT * FROM role", (err, result) => {
        if(err) {
            console.log(err)
            return []
        } else {
            let roles = []
            result.forEach((role, i) => {
                roles.push(new Role(role.title, role.salary, role.department_id, role.id))
            })
            successCallback(roles)
        }
    })
}

function create(db, title, salary, departmentId) {
    let roleData = {title:title, salary:salary, department_id: departmentId}
    db.query("INSERT INTO role SET ?", roleData, (err, data) =>{
        if(err) {
            console.log(err)
        }
    })
}

function fetchBudgetByDepartment(db, department, successCallback) {
    let query = `
        SELECT 
            SUM(role.salary) AS budget,
            department.name AS department
        FROM role
        LEFT JOIN department ON department.id = role.department_id
        WHERE department_id = ? 
    `
    db.query(query, department, (err, result) => {
        if(err) {
            console.log(err)
            return []
        } else {
            successCallback(roles)
        }
    })
}

function deleteRole(db, roleId) {
    db.query("DELETE FROM role WHERE id=?", roleId);
}

module.exports = {
    fetchAll: fetchAll,
    fetchBudgetByDepartment: fetchBudgetByDepartment,
    deleteRole: deleteRole,
    create: create
}