const ProductModel=require('../Model/product')
const cartModel=require('../Model/cart')



exports.getProductDetails=(req,res)=>{
    ProductModel.find().then(Product=>{
        res.render('User/products',{
                title:"Details",
                path:'/userproduct',
                data:Product
            })
    }).catch(err=>{
        console.log("data not found..",err);
    })
}

exports.getuserDetails=(req,res)=>{
    let product_id=req.params.pid;
    console.log("product id:",product_id);
    ProductModel.findById(product_id)
    .then(Product=>{
        res.render('User/productdetails',{
            title:"userDetails",
            path:'/userproduct',
            data:Product
        })
    }).catch(err=>{
        console.log("Product not found...",err);
    })
}

exports.postSearchDetails=(req,res)=>{
    console.log("Search Value : ",req.body);
    let search=req.body.search;
    ProductModel.find({title:search}).then(result=>{
        console.log("after searching:",result);
        res.render('User/products',{
            title:"details",
            path:'/userproduct',
            data:result
        })
    }).catch(err=>{
        console.log("err",err);
    })
}

exports.postAddToCart=(req,res)=>{
    const pId=req.body.productId
    const quantity=req.body.quantity
    const userId=req.user._id
    const cartValue=[]
    console.log("after add to cart: pid: ",pId,"Q :",quantity,"Id",userId);
    cartModel.find({userId:userId, productId:pId})
    .then(cartData=>{
        if(cartData=='')
        {
        ProductModel.findById(pId)
        .then(productForCart=>{
        cartValue.push(productForCart)
        const cartProduct= new cartModel({productId:pId, quantity:quantity, userId:userId, cart:cartValue})
        cartProduct.save()
        .then(result=>{
            console.log("product add to cart successfully");
            res.redirect('/cart')
        }).catch(err=>{
            console.log(err);
        })
    }).catch(err=>{
       console.log(err);
    })
 }
        else
        {
        ProductModel.findById(pId)
        .then(productForCart=>{
        cartValue.push(productForCart)
        const cartProduct= new cartModel({productId:pId, quantity:quantity, userId:userId, cart:cartValue})
        cartProduct.save()
        .then(result=>{
            console.log("product add successfully");
            res.redirect('/cart')
        }).catch(err=>{
            console.log(err);
        })
     }).catch(err=>{
        console.log(err);
    })
    }
    })
}


exports.getCartPage=(req,res)=>{
    const user_id = req.session.user._id
    cartModel.find({userId:user_id}).then(viewProductCart=>{
        res.render('User/cart',{
            title:"cart",
            path:'/cart',
            data:viewProductCart
        })
    }).catch(err=>{
        console.log(err);
    })
}

exports.getDeletecart=(req,res)=>{
    const cart_id=req.params.pid;
    console.log("cart id:",cart_id);
    cartModel.deleteOne({_id:cart_id}).then(cart_result=>{
        console.log("result",cart_result);
    }).catch(err=>{
        console.log("err",err);
    })
    res.redirect('/cart')
}