import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const connectToDB=async ()=>{
   await  mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));
}

export default connectToDB;