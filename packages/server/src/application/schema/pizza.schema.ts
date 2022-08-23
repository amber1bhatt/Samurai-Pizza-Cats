import { gql } from 'apollo-server';

const typeDefs = gql`
  type Pizza {
    toppings: [Topping!]!
    name: String!
    id: ObjectID!
    description: String!
    imgSrc: String!
    priceCents: Int!
  }

  type Cursor {
    results: [Pizza!]!
    totalCount: Int
    hasNextPage: Boolean
    cursor: String
  }

  type Query {
    pizzas(input: CursorInput!): Cursor
  }

  input CursorInput {
    cursor: String
    limit: Int
  }

  type Mutation {
    createPizza(input: CreatePizzaInput!): Pizza!
    updatePizza(input: UpdatePizzaInput!): Pizza!
    deletePizza(input: String!): ObjectID!
  }

  input CreatePizzaInput {
    name: String!
    description: String!
    imgSrc: String!
    toppingIds: [ObjectID!]
  }

  input UpdatePizzaInput {
    id: ObjectID!
    name: String
    description: String
    imgSrc: String
    toppingIds: [ObjectID]
  }
`;

export { typeDefs };
