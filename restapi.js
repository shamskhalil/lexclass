const express = require('express');
const bodyParser = require('body-parser');
const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

var ids = 0;
var usersDb = []; // id, username, password, fname, lname


server.get('/', (req, res) => {
    res.json({ status: 'success' });
})


//Create
server.post('/user', (req, res) => {
    //let { username, password, fname, lname } = req.body;
    //let newUser = { username, password, fname, lname };
    let newUser = req.body;
    newUser.id = ++ids;
    usersDb.push(newUser);
    res.status(200).json({ status: 'success', payload: newUser, message: 'User created successfully!' });
});

//read all
server.get('/user', (req, res) => {
    res.status(200).json({ status: 'success', payload: usersDb, message: 'A list of all Users' });
});
//read one
server.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id > 0) {
        for (let i = 0; i < usersDb.length; i++) {
            let obj = usersDb[i];
            if (obj.id === id) {
                return res.status(200).json({ status: 'success', payload: obj, message: 'Single user fetched Successfully!' });
            }
        }
    } else {
        res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to fetch' });
    }
});

//update
server.put('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let newUserData = req.body;
    if (id > 0) {
        for (let i = 0; i < usersDb.length; i++) {
            let obj = usersDb[i];
            if (obj.id === id) {
                usersDb[i] = newUserData;
                return res.status(200).json({ status: 'success', payload: null, message: 'User updated Successfully!' });
            }
        }
    } else {
        res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to Update' });
    }
});

//delete
server.delete('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id > 0) {
        let userIdx = 0;
        for (let i = 0; i < usersDb.length; i++) {
            let obj = usersDb[i];
            if (obj.id === id) {
                userIdx = i;
                break;
            }
        }
        usersDb.splice(userIdx, 1);
        res.status(200).json({ status: 'success', payload: null, message: 'User Deleted Successfully!' });
    } else {
        res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to Delete' });
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