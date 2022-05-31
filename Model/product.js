const mongoose=require('mongoose')
const SchemaVariable=mongoose.Schema;

const ProductSchema=new SchemaVariable({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    p_image:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Product_data',ProductSchema)    //model('collectionNAme, Schema name)