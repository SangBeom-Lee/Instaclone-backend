require("dotenv").config();

import {ApolloServer} from "apollo-server";
import {typeDefs, resolvers} from "./schema";
import { getUser, protectResolver } from "./users/users.utils";
import { async } from "regenerator-runtime";

const PORT                                          = process.env.PORT;
const server                                        = new ApolloServer({
    resolvers,
    typeDefs,
    context                                         : async ({req}) => {
        return {
            loginUser                               : await getUser(req.headers.token),
            protectResolver,
        }
    }
});

server.listen(PORT).then(() => console.log(`Server is running on http://localhost:${PORT}/`));