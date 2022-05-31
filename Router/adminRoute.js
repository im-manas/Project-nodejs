const authCheck=require('../middle-ware/isAuth')
const express=require('express')
const admin_router=express.Router()
const admin_controller=require('../Controller/adminController')


admin_router.get('/addProduct',admin_controller.getAddProduct)
admin_router.post('/productData',admin_controller.postProductData)
admin_router.get('/productDetails',authCheck,admin_controller.getProductDetails)
admin_router.get('/edit/:pid',admin_controller.getEdit)
admin_router.post('/edit',admin_controller.postEditData)
//admin_router.get('/delete/:pid',admin_controller.getDeletedata)
admin_router.post('/delete',admin_controller.postDeletedata)



module.exports=admin_router