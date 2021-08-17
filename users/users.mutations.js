import { async } from "regenerator-runtime";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import client from "../client";

export default {
    Mutation                                    : {
        createAccount                           : async (_, {
            firstName,
            lastName,
            userName,
            email,
            password
        }) => {
            try {
                // Check userName or email
                const existingUser              = await client.user.findFirst({
                    where                       : {
                        OR                      : [
                            {userName},
                            {email}
                        ]
                    }
                });
                if(existingUser){
                    throw new Error("This userName/password is already taken");
                }

                // Password Hash
                const uglyPassword              = await bcrypt.hash(password, 10);

                // create
                return client.user.create({data : {
                    userName,
                    email,
                    firstName,
                    lastName,
                    password                    : uglyPassword
                }})
            } catch(e) {
                return e;
            }            
        },

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