const mongoose=require('mongoose')
const SchemaVariable=mongoose.Schema;

const authSchema=new SchemaVariable({
    f_name:{
        type:String,
        required:true
    },
    l_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('auth_data',authSchema)