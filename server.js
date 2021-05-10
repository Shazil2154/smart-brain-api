const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profileGet = require('./controllers/profileGet');
const image = require('./controllers/image')
const saltRounds = 10;

const db = knex({
  client: 'pg',
  connection: {
    host : process.env.DATABASE_URL,
    ssl: true,
    //for local host
    // user : 'shazil',
    // password : 'test',
    // database : 'smart-brain'
  }
});

const app = express();

app.use(express.json({extended:true}));
app.use(cors())


app.get('/',(req,res)=>{
    res.write('<h1>Wellcome to the backend of smart-brain by Shazil Sattar</h1>');
    res.write('<h2>SignIN</h2>');
    res.write('<p>Go to /signin to get signin info</p>');
    res.write('<h2>Register</h2>');
    res.write('<p>go to /register to get the register data</p>');
    res.write('<h1>Note:</h1>')
    res.write('<p>Just kidding you are not suposed to get these information </br> Happy Hacking</p>')
    res.send();
});


app.post('/signin',signin.handleSignin(db, bcrypt));

app.post('/register',register.handleRegister(db, bcrypt, saltRounds));

// the above and below are two ways of injecting dependendcies
// the above is higher order function and below is simple function

app.get('/profile/:id',(req, res) => {profileGet.handleProfile(req, res, db)});

app.put('/image',(req, res) => {image.handleImage(req, res, db)});
app.post('/clarifai',(req, res) => {image.handleApiCall(req, res)}); 
app.listen(process.env.PORT || 3001,()=>{
    console.log(`server is up and rung at port ${process.env.PORT}`);
});