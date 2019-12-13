// const express = require('express');
let jwt = require('jsonwebtoken');
let config = require('./config');
const crypto = require('crypto');
// let middleware = require('./token_middleware');
const mongoose = require('mongoose');
const Users = require('./models/users' );
// const mongoURI = 'mongodb://127.0.0.1/marketplacedb';

mongoose.connect(config.mongodb_uri, {useNewUrlParser: true}, (err)=>{
    if(err){
        return console.log(`Error from Marketplace MongoDB: ${err}`);
    }
    console.log("Connected to Marketplace DB");
});

function login(req, res){
    let { username, password } = req.body;
    
    // For the given username fetch user from DB
    Users.findOne({username: username})
    .then((user)=>{ 
      if( username && password )
      {
        //Hash the password before comparison
        //The password is stored as hashed string
        password = crypto.createHmac('SHA256', config.salt_key).update(password).digest('base64');

        if( username === user.username && password === user.password )
        {
          let token = jwt.sign( {username: username},
                      config.secret,
                      { expiresIn: '24h' } );

          // Return the JWT token for the future API calls
          res.json(
          {
            success: true,
            message: 'Authentication successful!',
            token: token
          } );
        }
        else
        {
          res.sendStatus(403).json(
          {
            success: false,
            message: 'Incorrect username or password'
          } );
        }
      }
      else
      {
        res.sendStatus(400).json(
        {
          success: false,
          message: 'Authentication failed! Please check the request'
        } );
      }
    });
    
}

function createUser(req, res){
  let { username, password, first_name, last_name, email_address, avatar } = req.body;
  password = crypto.createHmac('SHA256', config.salt_key).update(password).digest('base64');
  //Create a user for the given information
  Users.create(
    {username, password, first_name, last_name, email_address, avatar})
    .then((newUser) => {
      res.send(`${username} has been successfully created.`)
    })
    .catch((err) => res.json(err));
}

function deleteUser(req, res){
  let { username, password } = req.body;
  //Encrypt the password that is received
  password = crypto.createHmac('SHA256', config.salt_key).update(password).digest('base64');
  
  //Check if the user exist and if the password match
  /* To be complete */
}

function getUserDetail(req, res){


}

//Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];

  if(typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const token = bearer[1];
      req.token = token;
      next();
  } else {
      //If header is undefined return Forbidden (403)
      res.sendStatus(403)
  }
}

module.exports = { login, createUser, getUserDetail, checkToken }
