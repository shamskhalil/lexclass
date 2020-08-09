const express = require('express');
const UserDao = require('../dao/dao.user');
const authorizer = require('../middlewares/middleware.authorizer').authorizer;

module.exports = () => {
    const api = express.Router();

    //Create
    api.post('/', authorizer(['admin', 'registered']), async (req, res) => {
        try {
            const savedUser = await UserDao.addNew(req.body);
            res.status(200).json({ status: 'success', payload: savedUser, message: 'User created successfully!' });
        } catch (err) {
            res.status(500).json({ status: 'failed', payload: null, message: err });
        }
    });

    //read all
    api.get('/', authorizer(['admin', 'registered']), async (req, res) => {
        try {
            const usersArray = await UserDao.getAll();
            res.status(200).json({ status: 'success', payload: usersArray, message: 'All Users fetched successfully' });
        } catch (err) {
            res.status(500).json({ status: 'failed', payload: null, message: err });
        }
    });

    //read one
    api.get('/:id', authorizer(['admin', 'registered']), async (req, res) => {
        const id = req.params.id;
        if (id) {
            try {
                const singleUser = await UserDao.getOne(id);
                res.status(200).json({ status: 'success', payload: singleUser, message: 'Single user fetched Successfully!' });
            } catch (err) {
                res.status(500).json({ status: 'failed', payload: null, message: err });
            }
        } else {
            res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to fetch' });
        }
    });

    //update
    api.put('/:id', authorizer(['admin', 'registered']), async (req, res) => {
        const id = req.params.id;
        const { password, fname, lname } = req.body;
        if (id) {
            try {
                const updatedUser = await UserDao.update(id, password, fname, lname);
                res.status(200).json({ status: 'success', payload: updatedUser, message: 'Single user Updated Successfully!' });
            } catch (err) {
                res.status(500).json({ status: 'failed', payload: null, message: err });
            }
        } else {
            res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to Update' });
        }
    });

    //delete
    api.delete('/:id', authorizer(['admin']), async (req, res) => {
        const id = req.params.id;
        if (id) {
            try {
                await UserDao.del(id);
                res.status(200).json({ status: 'success', payload: null, message: 'User Deleted Successfully!' });
            } catch (err) {
                res.status(500).json({ status: 'failed', payload: null, message: err });
            }
        } else {
            res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to Update' });
        }
    });

    return api;
}