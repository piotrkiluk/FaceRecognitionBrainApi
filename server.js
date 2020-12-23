// const express = require('express');
import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'kiluk',
        password: 'kiluk',
        database: 'smart-brain'
    }
})

db.select('*').from('users').then(data => console.log(data))
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    db.select('*').from('users').then(data => {
        res.send(data);
    })
})

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    //const salt = bcrypt.genSaltSync(10);
    //const hash = bcrypt.hashSync(password, salt);

    db.select('email','hash').from('login').where({ email })
    .then((data) => {
       const isValid = bcrypt.compareSync(password, data[0].hash);
       if(isValid) {
           return db.select('*').from('users').where('email', '=', email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
       } else {
           res.status(400).json('wrong credentials')
       }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({ 
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        user.length ? res.json(user[0]) : res.status(400).json('no such user');
    })
    .catch(err => response.status(400).json("error getting profile"));
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id )
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('error getting entries data'))
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

// db mockup!
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