
class Department {
    constructor(name, id = null) {
        this.name = name
        this.id = id
    }

    getName() {
       return this.name 
    }

    getId() {
        return this.id
    }
}

function fetchAll(db) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM department", (err, result) => {
            if(err) {
                console.log(err)
                reject(err)
            } else {
                let depts = []
                result.forEach((dept, i) => {
                    depts.push(new Department(dept.name, dept.id))
                })
                resolve(depts);
            }
        })
    })
    
}

function create(db, name) {
    db.query("INSERT INTO department SET ?", {name: name}, (err, data) => {
        if(err) {
            console.log(err)
        }
    });
}

function deleteDepartment(db, deptId) {
    db.query("DELETE FROM department WHERE id=?", deptId)
}

module.exports = {
    fetchAll: fetchAll,
    deleteDepartment: deleteDepartment,
    create: create
} 