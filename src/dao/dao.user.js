const UserModel = require('../models/user.model');

class UserDao {
    constructor() { }

    addNew(obj) {
        return new Promise((resolve, reject) => {
            let newUser = new UserModel(obj);
            newUser.save((err, savedUser) => {
                if (err) {
                    reject(err);
                }
                savedUser.password = '************';// masked password field
                resolve(savedUser);
            });
        });
    }

    getOne(id) {
        return new Promise((resolve, reject) => {
            UserModel.findById(id, { password: 0 }, (err, singleUser) => { //exclude password
                if (err) {
                    reject(err);
                }
                resolve(singleUser);
            });
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            UserModel.find({}, { password: 0 }, (err, usersArray) => { //exclude password
                if (err) {
                    reject(err);
                }
                resolve(usersArray);
            });
        });
    }

    getOneByUsername(username) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ username }, (err, singleUser) => { //password included here
                if (err) {
                    reject(err);
                }
                resolve(singleUser);
            });
        });
    }

    update(id, password, fname, lname) {
        return new Promise((resolve, reject) => {
            UserModel.findByIdAndUpdate(id, { $set: { password, fname, lname } }, { new: true }, (err, result) => {
                if (err) {
                    reject(err);
                }
                result.password = '***********'; //masked password field
                resolve(result);
            });
        });
    }

    del(id) {
        return new Promise((resolve, reject) => {
            UserModel.findOneAndDelete(id, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve('User Deleted Successfully!');
            });
        });
    }
}

module.exports = new UserDao();