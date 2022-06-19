const express=require('express');
const port=3008;
const appServer=express();
const path=require('path')
const session=require('express-session')   //session package useto store info in memory but it has no infinite resource
const mongodb_session=require('connect-mongodb-session')(session)   //used to store data in mongodb in a session package
const csurf = require('csurf')
const bodyParser=require('body-parser')
const { check, validationResult } = require('express-validator')
const authModel=require('./Model/auth')
const homeRouting=require('./Router/homeRoute')
const adminRouting=require('./Router/adminRoute')
const userRouting=require('./Router/userRoute')
const authRouting=require('./Router/authRoute')
const cartRouting=require('./Router/cartRoute')
const multer = require('multer')
const mongoose=require('mongoose')
const dbDriver='mongodb+srv://manaspramanik:Manas_1999@cluster0.vpytl.mongodb.net/Products?retryWrites=true&w=majority'
const flash=require('connect-flash')
const cookieParser = require('cookie-parser')
const csrfProtection=csurf();


//ejs setup
appServer.set('view engine','ejs')
appServer.set('views','View')       


const urlencodedParser = bodyParser.urlencoded({extended: false})



appServer.use(cookieParser())
//express url encoded
appServer.use(express.urlencoded());

//flash setup
appServer.use(flash())
//step 2 *session setup
const storeValue=new mongodb_session({
    uri:'mongodb+srv://manaspramanik:Manas_1999@cluster0.vpytl.mongodb.net/Products',
    collection:'my-session'
})
//step 3
appServer.use(session({secret:'manas',resave:false,saveUninitialized:false,store:storeValue}))

appServer.use((req,res,next)=>{
    if(!req.session.user)
    {
        return next();
    }
    authModel.findById(req.session.user._id)
    .then(userValue=>{
        req.user = userValue;
        next();
    }).catch(err=> console.log("user not found",err))
});

appServer.use((req,res,next)=>{
    if(!req.session.user)
    {
        return next();
    }
    authModel.findById(req.session.user._id)
    .then(userValue=>{
        req.user = userValue;
        next();
    }).catch(err=>{
        console.log(err);
    })
})


//appServer.use(csrfProtection);
appServer.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    //res.locals.csrf_token=req.csrfToken();
    res.locals.user=req.session.user;
    next();
})


appServer.use(express.static(path.join(__dirname,'Public')))

appServer.use('/Uploaded_image',express.static(path.join(__dirname,'Uploaded_image')))
const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'Uploaded_image')
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname)
    }
})
const fileFilter=(req,file,callback)=>{
    if(file.mimetype.includes("png")||
    file.mimetype.includes("jpg")||
    file.mimetype.includes("jpeg"))
    {
        callback(null,true)
    }
    else
    {
        callback(null,false)
    }
}
appServer.use(multer({storage:fileStorage,
fileFilter:fileFilter, limits:{fieldSize:1024*1024*5}}).single('p_image'))

//after import router, use here
appServer.use(homeRouting)
appServer.use(adminRouting)
appServer.use(userRouting)
appServer.use(authRouting)
appServer.use(cartRouting)

//port setup(mongoose)
mongoose.connect(dbDriver,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result=>{
    console.log("Database Connected");
    appServer.listen(port,()=>{
    console.log(`Server Connected at http://127.0.0.1:${port}`);
    })
})
.catch(err =>{
    console.log("not connected",err);
})