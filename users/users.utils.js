import Jwt from "jsonwebtoken";
import { async } from "regenerator-runtime";
import client from "../client";

export const getUser                                = async (token) => {
    try {
        if(!token) {
            return null;
        }

        const {id}                                      = await Jwt.verify(token, process.env.SECRET_KEY); 
        const user                                      = await client.user.findUnique({where : {id}});

        if(user){
            return user;
        } else {
            return null;
        }
    } catch {
        return null;
    }
};

// loginCheck
export function protectResolver(ourResolver) {
    return function(root, args, context, info) {
        if(!context.loginUser) {
            return {
                ok                                      : false,
                error                                   : "Please log in to perform this action."
            }
        }
    
        return ourResolver(root, args, context, info);
    }
}