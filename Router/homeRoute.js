const express=require('express')
const homeRoute=express.Router()
const home_controller=require('../Controller/homeController')

function sessionChecker(req,res,next){
    if(req.session.auth_data && req.cookies.user){
        return res.redirect('/login')
    }
    else{
        next()
    }
}

homeRoute.get('/',home_controller.getHome)



module.exports=homeRoute;