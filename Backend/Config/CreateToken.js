import jwt from 'jsonwebtoken'

export const createToken = (user)=>{
try{
    const token = jwt.sign({id:user._id,email:user.email,role:user.role,name:user.name},process.env.SECRET_KEY,{expiresIn:'7d'});
    return token
}    
catch(error){
    console.error("Error in createToken:", error);
    return null;
}
}