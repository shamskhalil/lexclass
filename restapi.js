require('./connection.mongo')();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const server = express();

const UserModel = require('./models/user.model');


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));



server.post('/user/login', (req, res) => {
    const { username, password } = req.body;
    UserModel.findOne({ username }, (err, user) => {
        if (err) {
            return res.status(500).json({ status: 'failed', payload: null, message: err });
        }
        let dbUserPass = user.password;
        let flag = bcrypt.compareSync(password, dbUserPass);
        if (flag) {
            user.password = '*******';
            let token = jsonwebtoken.sign({ userId: user._id, userType: user.userType }, "secretPassword123", { expiresIn: 5 * 60 });
            //console.log(token);
            const pl = { user: user, token: token };
            //console.log(pl);
            res.status(200).json({ status: 'success', payload: pl, message: 'User Logged In successfully!' });
        } else {
            res.status(500).json({ status: 'failed', payload: null, message: 'Invalid username or password' });
        }
    });

})

server.post('/user/register', (req, res) => {
    let newUser = new UserModel(req.body);
    newUser.save((err, savedUser) => {
        if (err) {
            return res.status(500).json({ status: 'failed', payload: null, message: err });
        }
        res.status(200).json({ status: 'success', payload: savedUser, message: 'User created successfully!' });
    });
});



server.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-token'];
    if (token) {
        try {
            const validToken = jsonwebtoken.verify(token, "secretPassword123");
            console.log(validToken);
            req.userAuth = { id: validToken.userId, userType: validToken.userType };
            next();
        } catch (err) {
            console.log(err);
            res.status(401).json({ status: 'failure', payload: null, message: 'Invalid Token provided!' });
        }
    } else {
        res.status(401).json({ status: 'failure', payload: null, message: 'Token required!, supply one please.' });
    }
});


server.get('/', (req, res) => {
    res.json({ status: 'success' });
});

//Create
server.post('/user', authorizer(['admin', 'registered']), (req, res) => {
    let newUser = new UserModel(req.body);

    newUser.save((err, savedUser) => {
        if (err) {
            return res.status(500).json({ status: 'failed', payload: null, message: err });
        }
        res.status(200).json({ status: 'success', payload: savedUser, message: 'User created successfully!' });
    });
});



//read all
server.get('/user', authorizer(['admin', 'registered']), (req, res) => {
    UserModel.find((err, usersArray) => {
        if (err) {
            res.status(500).json({ status: 'failed', payload: null, message: err });
        }
        res.status(200).json({ status: 'success', payload: usersArray, message: 'All Users fetched successfully' });
    });
});

//read one
server.get('/user/:id', authorizer(['admin', 'registered']), (req, res) => {
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
server.put('/user/:id', authorizer(['admin', 'registered']), (req, res) => {
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
server.delete('/user/:id', authorizer(['admin']), (req, res) => {
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

server.get('/killme', authorizer(['admin']), (req, res) => {
    res.status(200).json({ status: 'success', payload: null, message: 'Server dead' });
    process.exit(0);
});


server.listen(3000, () => {
    console.log('Server listening on port 3000')
});

function generateToken(obj) {
    try {
        const token = jsonwebtoken.sign(obj, "ThisIsourSuperSecret");
        console.log("TOKEN >>> ", token);
        return token;
    } catch (err) {
        console.log(err);
    }

}

function authorizer(expectedUsertypeArr) {
    return (req, res, next) => {
        if (expectedUsertypeArr.includes(req.userAuth.userType)) {
            next();
        }
        else {
            res.status(401).json({ status: 'failure', payload: null, message: 'You are not authorise to carryout this operation' });
        }

    }
}


module.exports.server = server;