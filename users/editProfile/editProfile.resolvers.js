import client from "../../client";
import bcrypt from "bcrypt";
import { async } from "regenerator-runtime";
import Jwt from "jsonwebtoken";

export default {
    Mutation                                    : {
        editProfile                             : async (_, {
            firstName,
            lastName,
            userName,
            email,
            password                            : newPassword,
            token
        }) => {
            const {id}                          = await Jwt.verify(token, process.env.SECRET_KEY);

            let uglyPassword                    = null;
            if(newPassword){
                uglyPassword                    = await bcrypt.hash(newPassword, 10);
            }

            const updateUser                    = await client.user.update({where:{
                id
            }, data:{
                firstName, 
                lastName, 
                userName, 
                email, 
                ...(uglyPassword && {password : uglyPassword})
            }});

            if(updateUser.id){
                return {
                    ok                          : true
                }
            } else {
                return {
                    ok                          : false,
                    error                       : "Could not update profile." 
                }
            }
        }
    }
};