import client from "../../client";
import bcrypt from "bcrypt";
import { async } from "regenerator-runtime";
import Jwt from "jsonwebtoken";
import { protectResolver } from "../users.utils";
import { GraphQLUpload } from "graphql-upload";

const resolverFn                                    = async (_, {
    firstName,
    lastName,
    userName,
    email,
    password                                        : newPassword,
    bio,
    avatar
},
{loginUser}) => {
    console.log(avatar);

    let uglyPassword                                = null;
    if(newPassword){
        uglyPassword                                = await bcrypt.hash(newPassword, 10);
    }

    const updateUser                                = await client.user.update({where:{
        id                                          : loginUser.id
    }, data:{
        firstName, 
        lastName, 
        userName, 
        email, 
        ...(uglyPassword && {password : uglyPassword})
    }});

    if(updateUser.id){
        return {
            ok                                      : true
        }
    } else {
        return {
            ok                                      : false,
            error                                   : "Could not update profile." 
        }
    }
};

export default {
    Upload                                          : GraphQLUpload,

    Mutation                                        : {
        editProfile                                 : protectResolver(resolverFn)
    }
};