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
authRoute.get('/forgetPass',auth_controller.getForgetPassword)
authRoute.post('/forgetPassword',auth_controller.postForget)
authRoute.get('/SetNewPassword/:id',auth_controller.getSetNewPassword)
authRoute.post('/newPassword',auth_controller.SetNewPassword)

module.exports=authRoute;