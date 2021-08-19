import { async } from "regenerator-runtime";
import bcrypt from "bcrypt";
import client from "../../client";

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
        }
    }
}