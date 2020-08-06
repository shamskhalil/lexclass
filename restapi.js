require('./connection.mongo')();
const express = require('express');
const bodyParser = require('body-parser');
const server = express();

const UserModel = require('./models/user.model');


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.get('/', (req, res) => {
    res.json({ status: 'success' });
});

//Create
server.post('/user', (req, res) => {
    let newUser = new UserModel(req.body);

    newUser.save((err, savedUser) => {
        if (err) {
            return res.status(500).json({ status: 'failed', payload: null, message: err });
        }
        res.status(200).json({ status: 'success', payload: savedUser, message: 'User created successfully!' });
    });
});

//read all
server.get('/user', (req, res) => {
    UserModel.find((err, usersArray) => {
        if (err) {
            res.status(500).json({ status: 'failed', payload: null, message: err });
        }
        res.status(200).json({ status: 'success', payload: usersArray, message: 'All Users fetched successfully' });
    });
});

//read one
server.get('/user/:id', (req, res) => {
    const id = req.params.id;
    if (id) {
        UserModel.findById(id, (err, singleUser) => {
            if (err) {
                res.status(500).json({ status: 'failed', payload: null, message: err });
            }
            return res.status(200).json({ status: 'success', payload: singleUser, message: 'Single user fetched Successfully!' });
        });
    } else {
        res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to fetch' });
    }
});

//update
server.put('/user/:id', (req, res) => {
    const id = req.params.id;
    const { password, fname, lname } = req.body;
    let newUserData = req.body;
    if (id) {
        UserModel.findByIdAndUpdate(id, { $set: { password, fname, lname } }, { new: true }, (err, result) => {
            if (err) {
                res.status(500).json({ status: 'failed', payload: null, message: err });
            }
            return res.status(200).json({ status: 'success', payload: result, message: 'Single user Updated Successfully!' });
        })
    } else {
        res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to Update' });
    }
});

//delete
server.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    if (id) {
        UserModel.findOneAndDelete(id, (err, result) => {
            if (err) {
                res.status(500).json({ status: 'failed', payload: null, message: err });
            }
            res.status(200).json({ status: 'success', payload: null, message: 'User Deleted Successfully!' });
        })
    } else {
        res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to Update' });
    }
});

server.get('/killme', (req, res) => {
    res.status(200).json({ status: 'success', payload: null, message: 'Server dead' });
    process.exit(0);
});


server.listen(3000, () => {
    console.log('Server listening on port 3000')
});

module.exports.server = server;