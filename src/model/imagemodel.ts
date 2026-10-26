import mongoose from "mongoose";

export const imageSchema=new mongoose.Schema({
    path:{
        type:String,
        required:[true,"path is required"],
    },
    public_id:{
        type:String,
        required:[true,"public id is required"],
    }
},
{_id:false})