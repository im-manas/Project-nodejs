

exports.getHome=(req,res)=>{
    console.log(req.cookies);
    res.render('Admin/index',{
        title:"Home",
        path:'/'
    })
}