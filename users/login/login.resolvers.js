import { async } from "regenerator-runtime";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import client from "../../client";

export default {
    Mutation                                    : {
        login                                   : async(_, {userName, password}) => {
            // Find user with args.userName
            const user                          = await client.user.findFirst({where : {userName}});

            if(!user){
                return {
                    ok                          : false,
                    error                       : "User not found"
                }
            };

            // Check Password
            const passwordOk                    = await bcrypt.compare(password, user.password);
            if(!passwordOk) {
                return {
                    ok                          : false,
                    error                       : "Incorrect password."
                }
            }

            const token                         = await Jwt.sign({id : user.id}, process.env.SECRET_KEY);
            return {
                ok                              : true,
                token
            }
        }
    }
}