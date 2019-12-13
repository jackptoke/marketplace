const express = require('express');
// let jwt = require('jsonwebtoken');
// let config = require('./config');
let middleware = require('./token_middleware');
const {login, createUser} = require('./user_controller');

let app = express();
app.use(express.json());
const port = 7777;

function index(req, res){
    res.json({
        success: true,
        message: 'Index page'
    });
}

app.post('/login', login);
app.post('/create_user', createUser);
app.get('/', middleware.checkToken, index);
app.listen(port, ()=>console.log(`Server is listening on port: ${port}`));