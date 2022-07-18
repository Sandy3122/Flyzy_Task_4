var express =require("express");
var app = express();
var path = require("path");
app.path = require("path");
const bodyparser = require("body-parser");

// sessions
const cookieParser = require("cookie-parser");
var sessions = require('express-session');

// Paths
app.use(express.static(path.join(__dirname, 'css')))
app.use(express.static(path.join(__dirname, 'images')))
app.use(express.static(path.join(__dirname, 'js')))

//Importing Schema's

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const registrationSchema = require('./models/registrationSchema');
// const custLogInSchema = require('./models/logInSchema');

// Mongodb Database Connection
const mongoose = require("mongoose");
// const urlencoded = require("body-parser/lib/types/urlencoded");
mongoose.connect("mongodb+srv://Sandeep1999:Sandeep3122@sandeep.nlcna.mongodb.net/Flyzy_Travel_Blog?retryWrites=true&w=majority", {
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(() => {
    console.log("Successfully Connected To MongoDB Database.");
}).catch((e) => {
    console.log("Not Connected To MongoDB Database.");
})
const connection = mongoose.connection;


// Sessions
app.use(sessions({
    cookieName: "sessions",
    secret: "ramuknamhskalpeednasmarees1999",
    saveUninitialized:true,
    resave: false,
    cookie: { secure: true }
}));

var session;

// apps
app.get("/", function(req,res) {
    session=req.session;
    if(session.user){
        res.send("Welcome User,<a href='/home'>Click Here For Home Page</a>");
    }else
    res.sendFile(__dirname + "/pages/login.html");    
});



// app.get("/", function(req,res) {
//     res.sendFile(__dirname + "/pages/home.html");
// });
app.get("/home", function(req,res) {
    res.sendFile(__dirname + "/pages/home1.html");
});
app.get("/aboutUs", function(req,res) {
    res.sendFile(__dirname + "/pages/about.html");
});
app.get("/careers", function(req,res) {
    res.sendFile(__dirname + "/pages/careers.html");
});
app.get("/features", function(req,res) {
    res.sendFile(__dirname + "/pages/features.html");
});
app.get("/gallery", function(req,res) {
    res.sendFile(__dirname + "/pages/gallery.html");
});
app.get("/packages", function(req,res) {
    res.sendFile(__dirname + "/pages/packages.html");
});
app.get("/recommended", function(req,res) {
    res.sendFile(__dirname + "/pages/recommended.html");
});
app.get("/login", function(req,res) {
    session=req.session;
    if(session.user){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
    res.sendFile(__dirname + "/pages/login.html");
});

app.get("/logout", function(req,res) {
    req.session.destroy();
    res.redirect("/")
});


//sending registration data to database
app.post('/sendData', function(req,res){
    console.log(req.body);
    var obj = new registrationSchema({
        Name:req.body.Name,
        MobileNumber:req.body.MobileNumber,
        Email:req.body.Email,
        Password:req.body.Password,
    })

    registrationSchema.findOne({ $or: [{ Name:req.body.Name }, { MobileNumber:req.body.MobileNumber }, {Email: req.body.Email }, ] }, function(err,docs){
        if(err || docs==null){
            //console.log(err)
            obj.save(function(err, results) {
                if(results){
                   console.log("results"+ results);
                    res.send(results);
                }else{
                    console.log(err)
                    res.send(err);
                }
            })
        } 
        else{
            res.sendStatus(500);
        }
    })
   
});



//getting registration data
app.get('/getRegistrationSchema',(req,res)=>{
    registrationSchema.find(function(err,result){
            if(err || result==null)
            {
                
                console.log(err)
            }
            else if(result!=undefined)
            {
                
                console.log(result)
                res.send(result);
            }
        })
    });
    
    // var loginData
    //Login Data
    app.post('/loginData', function(req,res){
        //res.sendFile(__dirname + '/template/signup.html');
        // session=req.session;
        console.log(req.body);
        
        registrationSchema.findOne({Email :req.body.Email, Password:req.body.Password}, function(err,docs){
            if(err || docs==null){
                //console.log(err)
                res.sendStatus(500)
            } 
            else{
                // session=req.session;
                // session.user=docs;
                // loginData=docs;
                res.send(docs);
            }
        })
    });
    

//Getting Users Data From MongoDB
app.get('/getusers',function(req,res){
    session = req.session;
    if(session.user){
        registrationSchema.find({"_id":session.user._id},function(err,result){
            if(err){
                console.log("err");
            }
            else{
                // console.log(result);
                res.send(result)
            }
        });
    }
    else{
        console.log("err");
    }
});













// apps From Controllers
// var webpages = require('./controllers/webPagesControllers.js');
// app.use('/aboutUs', webpages)



//listening to the server
app.listen(8000, ()=> console.log("Successfully Server Started"));