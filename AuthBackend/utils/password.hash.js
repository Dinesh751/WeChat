import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config();

 export const hashedPassword=(password)=>{
   try{
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
   }catch(err){
        console.log("something went wrong while hashing...!")
   }
}

export const comparePassword=(password,hashedPassword)=>{
try{
   return bcrypt.compareSync(password, hashedPassword);

}catch(err){
    console.log("something went wrong while comapring password...!")
}
}

 