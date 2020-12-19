const express = require('express')
const app = express();
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const users = require('./schema')
var jwt = require('jsonwebtoken');
const SendOtp = require('sendotp');
const cookieParser =require('cookie-parser')
const auth = require('./functions/auth')

// connecting to the database 



mongoose.connect('mongodb://localhost:27017/mahdata', {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true

}, (error, database) => {

    if (error) {
        console.log("error to connect to the database");
    } else {
        console.log("datbase is connected");
    }

})

//definig the schem


/////////////////////////////////
app.set('view engine', 'pug')
app.set('views', './views')
app.use(cookieParser())
app.use(express.static('./'))
app.use(express.urlencoded({ extended: true }))


const port = 80;

app.get('/', (req, res) => {
    res.render('index', { title: "Registration form", value: true })
  
})

app.get('/login', (req, res) => {
    res.render('index', { title: "Log in", value: false })
})


app.get('/sec', auth ,async (req,res,next)=>{
    console.log(req.num);
    res.send(req.myuser)
next()                               
})

app.get('/logout' ,auth ,(req,res)=>{

   //for logging out from all devices 
//    req.myuser.token =[];

//    for loging out from single or current devices 

    req.myuser.token =req.myuser.token.filter((element)=>{
        return req.cookies.jwt !== element.tokens
    })


    res.clearCookie('jwt');
    console.log("logout Successfully");
    req.myuser.save()
    res.render('index', { title: "Log in", value: false })
    
})

app.post('/register', async (req, res) => {

    const k = new users({
        name: req.body.name,
        password: req.body.password,
        about: req.body.about
    })

    //for jwt authenticate

    const token = await k.gen();
    ////////////////////////////////////////////////////////////////
    console.log('cookie is ', token)
    // now saving in cookie 
    res.cookie('jwt',token)
    //////////////////////////////////////////////////


    k.save((err, data) => {

        if (err) {
            res.send(err)
        } else {
            res.redirect('/login')
        }
    })
    
})

app.post('/showdata', async (req, res) => {

    const userdata = await users.findOne({ name: req.body.name })

    if (userdata == null) {
        res.send("name does not match")

    } else {
        ///////////////////////////////////////////////////
        const token = await userdata.gen();
   


        /////////////////////////////////////
        // for log we are adding this adding tockens 
        ///////////////////////////////////////////////////////

        if (bcryptjs.compareSync(req.body.password, userdata.password))
        // if(req.body.password === userdata.password)
        {
            res.cookie('jwt',token)

            res.json(userdata)
        } else {
            res.send("password does not match")
        }
    }
})

app.listen(port, () => {
    console.log("server is runnig at the  localhost");
})

