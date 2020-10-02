const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Query {
    reviews: [Review!]!
  }

  type Review {
    product: Product!
    user: User!
    content: String!
  }

  extend type Product @key(fields: "upc") {
    upc: String! @external
    reviews: [Review!]!
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    reviews: [Review!]!
  }
`;

const reviews = [{ userId: "1", upc: "1", content: "Very good!" }];

const resolveReview = ({ userId, upc, content }) => ({
  content,
  user: { __typename: "User", id: userId },
  product: { __typename: "Product", upc },
});

const resolvers = {
  Query: {
    reviews: () =>
      reviews.map(resolveReview),
  },
  Product: {
    reviews: ({ upc }) => reviews.filter((r) => r.upc === upc).map(resolveReview),
  },
  User: {
    reviews: ({ id }) => reviews.filter((r) => r.userId === id).map(resolveReview),
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4003).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
