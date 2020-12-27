// const express = require('express');
import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import handleRegister from './controllers/register.js';
import handleSignIn from './controllers/signin.js';

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'kiluk',
        password: 'kiluk',
        database: 'smart-brain'
    }
});

db.select('*').from('login')
    .then(data =>{ 
        console.log(data)
        db('login').count('* as loginsCount: ')
            .then(console.log)}
    )

db.select('*').from('users')
    .then(data =>{ 
        console.log(data)
        db('users').count('* as usersCount: ')
            .then(console.log)}
    )    

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    db.select('*').from('users').then(data => {res.send(data)})
});

//poniżej "dependency injection; przesyłamy do handleRegister oprócz req/res również bazę i szyfrowanie"
app.post('/signin', (req, res) => { handleSignIn(req, res, db, bcrypt) });
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        user.length ? res.json(user[0]) : res.status(400).json('no such user');
    })
    .catch(err => response.status(400).json("error getting profile"));
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id )
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('error getting entries data'))
});

app.listen(3000, () => { 
    console.log('app is running on port 3000');
});

/* 
endPoints:

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user

*/
// old db mockup!
// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'John',
//             password: 'cookies',
//             email: 'john@gmail.com',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Sally',
//             password: 'bananas',
//             email: 'sally@gmail.com',
//             entries: 0,
//             joined: new Date()
//         }
//     ],
//     login: [
//         {
//             id: '987',
//             hash: '',
//             email: 'john@gmail.com'
//         }
//     ]
// }