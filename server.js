import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import handleRegister from './controllers/register.js';
import handleSignIn from './controllers/signin.js';
import handleProfileGet from './controllers/profile.js';
import handleImage from './controllers/image.js';

const app = express();
app.use(express.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'kiluk',
        password: 'kiluk',
        database: 'smart-brain'
    }
});

app.get('/', (req, res) => { db.select('*').from('users').then(data => {res.send(data)}) });
app.listen(3000, () => { console.log('app is running on port 3000') });

//poniżej dependency injection; przesyłamy do handleRegister oprócz req/res również bazę i szyfrowanie"
app.post('/signin', (req, res) => { handleSignIn(req, res, db, bcrypt) });
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { handleImage(req, res, db) });

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
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

*/