import { ApolloServer } from "@apollo/server";
import { User } from "./User";

async function createApolloServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
      ${User.typeDefs}
      type Query { 
        ${User.queries}
        }
      type Mutation { ${User.mutations} }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });

  // Start the GraphQL server
  await gqlServer.start();
  return gqlServer;
}

export default createApolloServer;
