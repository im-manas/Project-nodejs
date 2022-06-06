
exports.getHome=(req,res)=>{
    console.log(req.cookies);
    res.render('Admin/index',{
        title:"Home",
        path:'/'
    })
}

exports.getAbout=(req,res)=>{
    console.log(req.cookies);
    res.render('Admin/about',{
        title:"about",
        path:'/about'
    })
}