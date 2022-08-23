import { gql } from '@apollo/client';

export const CREATE_PIZZA = gql`
  mutation CreatePizza($createPizzaInput: CreatePizzaInput!) {
    createPizza(input: $createPizzaInput) {
      id
      name
      description
      toppings {
        id
        name
        priceCents
      }
      imgSrc
      priceCents
    }
  }
`;
