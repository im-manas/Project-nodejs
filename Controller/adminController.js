const ProductModel=require('../Model/product')  //this one is file name

exports.getAddProduct=(req,res)=>{
    res.render('Admin/addproduct',{
        title:"Products",
        path:'/addProduct'
    })
}

exports.postProductData=(req,res)=>{
    console.log("data:",req.body);
    let title=req.body.title;
    let price=req.body.price;
    let description=req.body.description;
    let p_image=req.file
    let p_imageUrl=p_image.path
    const formData=new ProductModel({title:title, price:price, description:description, p_image:p_imageUrl})
    formData.save()
    .then(results=>{
        console.log("Product is saved",results);
    })
    .catch(err=>{
        console.log("err to save",err);
    })
    res.redirect('/productDetails')
}

exports.getProductDetails=(req,res)=>{
    ProductModel.find().then(Product=>{
        res.render('Admin/view-product',{
                title:"Details",
                path:'/productDetails',
                data:Product
            })
    }).catch(err=>{
        console.log("data not found..",err);
    })
}

exports.postEditData=(req,res)=>{
    console.log("Edited data:",req.body);
    let title=req.body.title;
    let price=req.body.price;
    let description=req.body.description;
    //let p_image=req.file
    //let p_imageUrl=p_image.path
    let id=req.body.id;

    ProductModel.findById(id).then(updatedData=>{
        updatedData.title=title
        updatedData.price=price
        updatedData.description=description
        // updatedData.p_image=p_imageUrl
        return updatedData.save()
        .then(results=>{
            console.log("Product is saved");
            res.redirect('/productDetails')
        })
        .catch(err=>{
            console.log("err to save",err);
        })
    }).catch(err=>{
        console.log("error",err);
    })
}

exports.getEdit=(req,res)=>{
    let product_id=req.params.pid;
    console.log("product id:",product_id);
    ProductModel.findById(product_id)
    .then(Product=>{
        res.render('Admin/edit',{
            title:"Edit Page",
            path:'/edit/:pid',
            data:Product
        })
    }).catch(err=>{
        console.log("Product not found",err);
    })
}

// exports.getDeletedata=(req,res)=>{
//     let product_id=req.params.pid;   //use in get method
//     console.log("product id:",product_id);
//     ProductModel.deleteData(product_id)
//     .then(result=>{
//         console.log(result);
//         res.redirect('/productDetails')
//     }).catch(err=>{
//         console.log("error",err);
//     })
// }

exports.postDeletedata=(req,res)=>{
    let product_id=req.body.product_id  //use in post method
    console.log("product id:",product_id);
    ProductModel.deleteOne({_id:product_id})
    .then(result =>{
        console.log(result);
        res.redirect('/productDetails')
    }).catch(err =>{
        console.log("error",err);
    })
}