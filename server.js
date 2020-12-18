// const express = require('express');
import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            password: 'cookies',
            email: 'john@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            password: 'bananas',
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
    // let hash = bcrypt.hash(database.users[0].password, 10, function(err, hash) {
    //     return(hash);
    // }); 
    // bcrypt.compare(req.body.password, hash, function(err, result) {
    //     // result == true
    //     res.json(database.users[0]);
    //     //if(err) {res.status(404).json('error logging in')}
    //     //if(err) {console.log(err)}
    // });
    // database.users.map((element) => {
    //     //console.log(element.email);
    //     const { email, password } = element;
    //     if(element.email === email && element.password === password)
    //         {return res.json(element)} else {
    //           return res.status(404).json('error logging in - no such user in database')  
    //         }
    // })
    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0]);
        //res.json('success');
    } else {
        //console.log('error loggin in');
        res.status(404).json('error logging in - no such user in database');
    }
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    //const saltRounds = 10;
    // hashPassword = bcrypt.hash(password, saltRounds, function(err, hash) {
    //     return(hash);
    // });
    database.users.push({
        id: '125',
        name: name,
        password: password,
        email: email,
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