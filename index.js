const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const encrypt=require('mongoose-encryption');
// const md5=require('md5');
const bcrypt = require('bcrypt');
const saltRound = 10;

const port = process.env.PORT || 7000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
})
);

mongoose.connect('mongodb://0.0.0.0:27017/userDatabase', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    name: {
        required:true,
        type: String,
    },
    phone: {
        required:true,
        type: Number,
        length: {
            max: 10,
        },
    },
    email: {
        type: String,
        required:true,
    },
    password: {
        required:true,
        type: String,
        length: {
            min: 8,
            max: 20
        }
    }

});

// const secret='thisisasecret.';
// userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});


const userModel = new mongoose.model("User", userSchema);

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/register', (req, res) => {

    bcrypt.hash(req.body.userpassword, saltRound, (err, hash) => {
        const newUser = new userModel({
            name: req.body.username,
            phone: req.body.userphone,
            email: req.body.useremail,
            password: hash
        })
        newUser.save((err) => {
            if (err) {
                console.log(err)
            }
            else {
                res.render('login')
            }
        });
    });

});

app.post('/login', (req, res) => {

    const useremail = req.body.useremail;
    const password = req.body.userpassword;

    userModel.findOne({ email: useremail }, (err, foundUser) => {
        if (err) {
            res.write('<h1>Error! wrong Id</h1>');
            res.end();
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, (err, result) => {
                    if (result === true) {
                        res.render('home');
                    }
                    else {
                        res.write('<h1>Error! wrong Id</h1>');
                        res.end();
                    }
                })

            }
        }
    });
});

app.listen(port, (req, res) => {
    console.log(`connect with port no ${port}`)
})
