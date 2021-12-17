
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
    return new Promise((resolve, reject) => {
        let query = "SELECT role.*, department.name AS departmentName FROM role INNER JOIN department ON role.department_id = department.id"
        db.query(query, (err, result) => {
            if(err) {
                reject(err)
            } else {
                let roles = []
                result.forEach((role, i) => {
                    let newRole = new Role(role.title, role.salary, role.department_id, role.id)
                    newRole.departmentName = role.departmentName;
                    roles.push(newRole)
                })
                resolve(roles)
            }
        })
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
        RIGHT JOIN employee ON employee.role_id=role.id
        WHERE department_id = ? 
    
    `
    return new Promise((resolve, reject) => {
        db.query(query, department, (err, result) => {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
    
}

function fetchBudgets(db) {
    let query = `
        SELECT 
            SUM(role.salary) AS budget,
            department.name AS department
        FROM role
        LEFT JOIN department ON department.id = role.department_id
        GROUP BY role.department_id
    `
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
    
}

function fetchRolesByDepartment(db, deptId) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM role WHERE department_id=?", deptId, (err, result) => {
            if(err) {
                reject(err)
            } else {
                let roles = []
                result.forEach((role, i) => {
                    roles.push(new Role(role.title, role.salary, role.department_id, role.id))
                })
                resolve(roles)
            }
        })
    })
}

function deleteRole(db, roleId) {
    db.query("DELETE FROM role WHERE id=?", roleId);
}

function deleteRoleByDepartment(db, deptId) {
    db.query("DELETE FROM role WHERE department_id=?", deptId);
}

module.exports = {
    fetchAll: fetchAll,
    fetchBudgetByDepartment: fetchBudgetByDepartment,
    fetchRolesByDepartment: fetchRolesByDepartment,
    fetchBudgets: fetchBudgets,
    deleteRole: deleteRole,
    deleteRoleByDepartment: deleteRoleByDepartment,
    create: create
}