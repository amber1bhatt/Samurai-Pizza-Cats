import { gql } from '@apollo/client';

export const DELETE_PIZZA = gql`
  mutation ($deletePizzaInput: String!) {
    deletePizza(input: $deletePizzaInput)
  }
`;
