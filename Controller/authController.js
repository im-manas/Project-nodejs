const authModel=require('../Model/auth')
const bcrypt=require('bcryptjs')
const bodyParser=require('body-parser')
const { check, validationResult } = require('express-validator')
const urlencodedParser = bodyParser.urlencoded({extended: false})

exports.getReg=(req,res)=>{
    let messege=req.flash('error')
    console.log(messege);
    if(messege.length>0)
    {
        messege=messege[0]
    }
    else
    {
        messege=null
    }
    res.render('Auth/registration',{
        title:"Signup-page",
        path:'/signup',
        errorMsg:messege
    })
}

exports.postregDetails=(req,res)=>{
    console.log("data:",req.body)
    let f_name=req.body.f_name
    let l_name=req.body.l_name
    let email=req.body.email
    let password=req.body.password

    authModel.findOne({email:email})
    .then(userValue=>{
        if(userValue)
        {
        console.log("email already exixts");
        req.flash('error','Email already exist')
        return res.redirect('/signup')
        }
        return bcrypt.hash(password,12)
        .then(hashPassword=>{
            const userData=new authModel({f_name:f_name, l_name:l_name, email:email, password:hashPassword})
            return userData.save()
        }).then(result=>{
            console.log("reg done");
            return res.redirect('/login')
        }).catch(err=>{
            console.log("err to reg",err);
        })
    }).catch(err=>{
        console.log("err",err);
    })
}

exports.getLogin=(req,res)=>{

    

    let messege=req.flash('error')
    console.log(messege);
    if(messege.length>0)
    {
        messege=messege[0]
    }
    else
    {
        messege=null
    }
    res.render('Auth/login',{
        title:"Login-page",
        path:'/login',
        errorMsg:messege,
        cookie_data:req.cookies
    })
}

exports.postLogin=(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const checked=req.body.checked;
    console.log("collected:",email,password);
    authModel.findOne({email:email})
    .then(userValue=>{
        if(!userValue)
        {
            console.log("invalid email");
            req.flash('error','error :: Invalid email')
            return res.redirect('/login')
        }
        bcrypt.compare(password,userValue.password)
        .then(result=>{
            
            if(!result)
            {
                console.log("invalid password")
                req.flash('error','error :: invalid password')
                return res.redirect('/login')
            }
            else
            {
                console.log("loged in: ",result);
                req.session.isLoggedIn = true;
                req.session.user=userValue;
                return req.session.save(err=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else if(checked){
                        const cookieData={email:userValue.email, password:password}
                        res.cookie('cookiedata',cookieData,{
                            expires:new Date(Date.now()+3600000),
                            httpOnly:true
                        })
                    }
                    console.log("logged in");
                    return res.redirect('/userproduct')
                })
            }
            
        }).catch(err =>{
            console.log(err);
            res.redirect('/login')
        })
    }).catch(err=>{
        console.log("err to find email",err);
    })
}

exports.getLogout=(req,res)=>{
  req.session.destroy()
  console.log("successfully logout",req.session);
  res.redirect('/login');
}