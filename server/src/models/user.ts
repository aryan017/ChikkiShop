import {Schema,model} from 'mongoose';

export interface IUser{
    _id?:String;
    username:String;
    password:String;
    availableMoney:number;
    purchasedItems:String[];  
}

const UserSchema=new Schema<IUser>({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    availableMoney:{type:Number,default:500000},
    purchasedItems:[
        {type:Schema.Types.ObjectId,ref:"product",default:[]}
    ]
})

export const UserModel=model<IUser>("user",UserSchema);  // "user" is the name of the table in the database

