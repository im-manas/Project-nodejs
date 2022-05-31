const mongoose=require('mongoose')
const SchemaVariable=mongoose.Schema;

const cartSchema=new SchemaVariable({
    productId:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    cart:[{
        type:Object,
        required:true
    }]
})



module.exports=mongoose.model('CartItem',cartSchema)