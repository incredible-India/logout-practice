const user  = require('./../schema')
const jwt =require('jsonwebtoken')


 const auth =async (req,res,next) =>{
try{
    const token = req.cookies.jwt;
    const varify =jwt.verify(token,"helloiamhimansukuamrsharmaroomdekhoisagoodap")

   
    myuser = await user.findOne({_id: varify._id})
 
    req.myuser = myuser;
   next()
    
    
}catch(error){
    res.send(error)
}


 }

 module.exports =auth;