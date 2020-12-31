// import express from 'express';
// import bcrypt from 'bcrypt';
// import cors from 'cors';
// import knex from 'knex';
// import handleRegister from './controllers/register.js';
// import handleSignIn from './controllers/signin.js';
// import handleProfileGet from './controllers/profile.js';
// import {handleImage, handleApiCall} from './controllers/image.js';

const express = require ('express');
const bcrypt = require ('bcrypt');
const cors = require ('cors');
const knex = require ('knex');
const register = require ('./controllers/register.js');
const signin = require ('./controllers/signin.js');
const profile = require ('./controllers/profile.js');
const image = require ('./controllers/image.js');

const app = express();
app.use(express.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL, //'postgresql-cubed-79502',
        ssl: true,
    }
});

app.listen(process.env.PORT || 3000, () => { console.log(`app is running on port ${process.env.PORT}`) });
app.get('/', (req, res) => { res.json(`it's working`)});
//poniżej dependency injection; przesyłamy do handleRegister oprócz req/res również bazę i szyfrowanie"
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });

// app.post('/register', (req, res) => { res.json(`it's register`)});
// app.get('/profile/:id', (req, res) => { res.json(`it's profile/:id`)});
// app.post('/imageUrl', (req, res) => { res.json(`it's imageUrl`)});
// app.put('/image', (req, res) => { res.json(`it's image`)});

/* 
endPoints:

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user

dbCkecks:

db.select('*').from('login')
    .then(data =>{ 
        console.log(data)
        db('login').count('* as loginsCount: ')
            .then(console.log)}
    );

db.select('*').from('users')
    .then(data =>{ 
        console.log(data)
        db('users').count('* as usersCount: ')
            .then(console.log)}
    ); 

old db mockup!
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
            id: '123',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

*/