const express=require('express')
const user_router=express.Router()
const user_controller=require('../Controller/userController')
const checkAuth=require('../middle-ware/isAuth')



user_router.get('/userproduct',user_controller.getProductDetails)
user_router.get('/details/:pid',user_controller.getuserDetails)
user_router.post('/search',user_controller.postSearchDetails)
user_router.post('/add-to-cart',checkAuth,user_controller.postAddToCart)
user_router.get('/cart',checkAuth,user_controller.getCartPage)
user_router.get('/delete-cart/:pid',user_controller.getDeletecart)

module.exports=user_router