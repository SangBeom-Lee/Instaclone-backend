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