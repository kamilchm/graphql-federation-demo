const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Query {
    products: [Product!]!
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String!
    price: Int
  }
`;

const products = [{ upc: "1", name: "TV", price: 2999 }];

const resolvers = {
  Query: {
    products: () => products,
  },
  Product: {
    __resolveReference: ({upc}) => products.find(p => p.upc === upc),
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
