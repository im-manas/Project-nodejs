const express=require('express')

const authRoute=express.Router()
const auth_controller=require('../Controller/authController')
const authCheck=require('../middle-ware/isAuth')



function isLoggedIn(req,res,next){
    if(req.session.isLoggedIn) return res.redirect('/')
    next()
}



authRoute.get('/signup',[isLoggedIn],auth_controller.getReg)
authRoute.get('/login',[isLoggedIn],auth_controller.getLogin)
authRoute.post('/reg',auth_controller.postregDetails)
authRoute.post('/login',auth_controller.postLogin)
authRoute.get('/logout',auth_controller.getLogout)

module.exports=authRoute;