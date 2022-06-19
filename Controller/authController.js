const authModel=require('../Model/auth')
const bcrypt=require('bcryptjs')
const bodyParser=require('body-parser')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host:'smtp',
    port:1200,
    secure:false,
    requireTLS: true,
    service: 'gmail',
    auth: {
      user: 'immanasp@gmail.com',
      pass: 'yulcftaunryyuxro'
    }
  });

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

            var mailOptions = {
                from: 'immanasp@gmail.com',
                to: email,
                subject: 'Sending Email using Node.js to confirm registration',
                text: 'You have succefully registered.'
              };
              transporter.sendMail(mailOptions, function(error, info)
                     {
                        if (error) 
                        {
                          console.log("Error to send mail:", error);
                        }
                         else 
                         {
                          console.log('Email sent: ' , info.response);
                        }
                    });

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

exports.getForgetPassword=(req,res)=>{
    res.render('Auth/forget',{
        title:"forget Password",
        path:'/forgetPass'
    })
}

exports.postForget=(req,res)=>{
    const email = req.body.u_email;
    authModel.findOne({email:email}).then((userValue)=>{
        if(!userValue)
        {
            console.log("invalid email");
            return res.redirect('/forgetPass')
        }else{
            const user_id = userValue._id;
            const url = "http://localhost:3008/setNewPassword/"+user_id;
            console.log(url);
            const textForget = "click here->";

            var mailOptions={
                from : 'immanasp@gmail.com',
                to: email,
                subject:"Forget Password",
                text:'Set new password',
                html: textForget.concat(url)
            };
            transporter.sendMail(mailOptions, function(err,info){
                if(err){
                    console.log("error to send mail",err);
                }else{
                    console.log('mail sent' +info.responce);
                }
            });
            
        }
    }).catch((err)=>
    {
        console.log(err);
    })
    res.end();
}

exports.getSetNewPassword=(req,res)=>{
    const user_id=req.params.id;
    console.log(user_id);
    res.render('Auth/setpass',{
        title:"Set new password",
        user_id:user_id,
        path:'/SetNewPassword'
    })
}

exports.SetNewPassword=(req,res)=>{
    const user_id = req.body.user_id;
    const password = req.body.n_password;
    console.log("collected: ",user_id, password);
    authModel.findById(user_id).then(user=>{
        let new_email = user.email;
        let new_fname = user.f_name;
        let new_lname = user.l_name
        console.log("collected: ",user_id, password, new_email, new_fname, new_lname);
        return bcrypt.hash(password,12).then((hashPassword)=>{
            user.password=hashPassword;
            user.email = new_email;
            user.f_name = new_fname;
            user.l_name = new_lname;
            return user.save().then((result)=>{
                console.log("password changed");
            return res.redirect('/login')
            }).catch(err=>{
                console.log(err);
            })
        }).catch(err=>{
            console.log(err);
        })
    })
}