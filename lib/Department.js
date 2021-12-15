
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

function _fetchAll(db, successCallback) {
    db.query("SELECT * FROM department", (err, result) => {
        if(err) {
            console.log(err)
            return []
        } else {
            let depts = []
            result.forEach((dept, i) => {
                depts.push(new Department(dept.name, dept.id))
            })
            successCallback(depts)
        }
    })
}

function _create(db, name) {
    db.query("INSERT INTO department SET ?", {name: name}, (err, data) => {
        if(err) {
            console.log(err)
        }
    });
}

module.exports = {
    fetchAll: _fetchAll,
    create: _create
} 