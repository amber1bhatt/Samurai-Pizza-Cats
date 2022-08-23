import { gql } from '@apollo/client';

export const GET_PIZZAS = gql`
  query Query($input: CursorInput!) {
    pizzas(input: $input) {
      results {
        id
        name
        description
        imgSrc
        priceCents
        toppings {
          id
          name
          priceCents
        }
      }
      totalCount
      hasNextPage
      cursor
    }
  }
`;
