
class Role {
    constructor(title, salary, departmentId, id = null) {
        this.title = title
        this.salary = salary
        this.departmentId = departmentId
        this.id = id
    }
}

function fetchAll(db, succesCallback) {
    db.query("SELECT * FROM role", (err, result) => {
        if(err) {
            console.log(err)
            return []
        } else {
            let roles = []
            result.forEach((role, i) => {
                roles.push(new Role(role.title, role.salary, role.departmentId, role.id))
            })
            successCallback(roles)
        }
    })
}

function create(db, title, salary, departmentId) {
    db.query("INSERT INTO role SET ?", {title:title, salary:salary, department_id: departmentId}, (err, data) =>{
        if(err) {
            console.log(err)
        }
    })
}

module.exports = {
    fetchAll: fetchAll,
    create: create
}