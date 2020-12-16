// const express = require('express');
import express from 'express';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        // result == true
    });

    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json('success');
    } else {
        res.status(404).json('error logging in')
    }
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        console.log(hash);
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(element => {
        if(element.id === id) {
            found = true;
            return res.json(element);
        } 
    })
    if(!found) { 
        return res.status(404).json("no such user");
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(element => {
        if(element.id === id) {
            found = true;
            element.entries++;
            return res.json(element.entries);
        } 
    })
    if(!found) { 
        return res.status(404).json("not found");
    } 
})

app.listen(3000, () => { 
    console.log('app is running on port 3000');
})

/* 

endPoints:

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user

*/