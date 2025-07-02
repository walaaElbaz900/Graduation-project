import mongoose, { Schema , model } from "mongoose";


const userSchema = new Schema({

    firstname : {
        type : String,
        required : true,
        minlength: 2,
        maxlength : 25,
        trim : true
    },
    lastname : {
        type : String,
        required : true,
        minlength: 2,
        maxlength : 25,
        trim : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    DOB:Date,
    phone : String ,
    image : String,
    userType: {
    type: String,
    enum: ["patient", "doctor"],
    required: true
  }


} , { timestamps:true})

const userModel = mongoose.model.User || model("User" , userSchema)


export default userModel