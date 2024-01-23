import express from "express";
import { expressMiddleware } from "@apollo/server/express4";

import cors from "cors";
import bodyParser from "body-parser";

import createApolloServer from "./graphql";
import UserService from "./services/User";

async function startGraphQlServer() {
  const PORT = Number(process.env.PORT) || 8000;
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // create GraphQL server
  const gqlServer = await createApolloServer();

  // add GraphQL middleware to express
  app.use(
    "/graphql",
    expressMiddleware(gqlServer, {
      context: async ({ req }) => {
        const token = req.headers["token"];
        try {
          //@ts-ignore
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (e) {
          return {};
        }
      },
    })
  );
  app.get("/", (req, res) => {
    res.json({
      msg: "Use /graphql route to use graphql",
    });
  });

  app.listen(PORT, () =>
    console.log(`Server is running on port http://localhost:${PORT}/graphql`)
  );
}

startGraphQlServer();
