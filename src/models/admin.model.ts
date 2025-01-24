import mongoose from "mongoose";
import { Document } from "mongoose";
import bcrypt from 'bcrypt';
export interface AdminType  extends Document{
    _id:string;
    email:string;
    password:string;
    matchPassword:(password:string)=>boolean;
}
const adminSchema =  new mongoose.Schema<AdminType>({
    email:{
        type:String,
        required:[true,"please enter the email"]
    },
    password:{
        type:String,
        required:[true,"please enter the password"],
        select:false

    }
},{timestamps:true});


adminSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }

   this.password= await bcrypt.hash(this.password,10);
   next();
})
adminSchema.methods.matchPassword = async function(password:string){
    return await bcrypt.compare(password,this.password);
}


const adminModel = mongoose.models?.admin as mongoose.Model<AdminType> || mongoose.model<AdminType>("admin",adminSchema);
export default adminModel;