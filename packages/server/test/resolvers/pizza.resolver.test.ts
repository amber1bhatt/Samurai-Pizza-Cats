import { gql } from 'apollo-server-core';

import { pizzaProvider, toppingProvider } from '../../src/application/providers';
import { resolvers } from '../../src/application/resolvers/index';
import { typeDefs } from '../../src/application/schema/index';
import {
  MutationCreatePizzaArgs,
  MutationDeletePizzaArgs,
  MutationUpdatePizzaArgs,
  QueryPizzasArgs,
} from '../../src/application/schema/types/schema';

import {
  createMockCursor,
  createMockProviderPizza,
  createMockSchemaPizza,
  createMockTopping,
} from '../helpers/pizza.helper';
import { TestClient } from '../helpers/client.helper';

let client: TestClient;

jest.mock('../../src/application/database', () => ({
  setupDb: (): any => ({ collection: (): any => jest.fn() }),
}));

const mockPizza = createMockSchemaPizza();
const mockTopping = createMockTopping();
const mockCursor = createMockCursor();

beforeAll(async (): Promise<void> => {
  client = new TestClient(typeDefs, resolvers);
});

beforeEach(async (): Promise<void> => {
  jest.restoreAllMocks();
});

describe('pizzaResolver', (): void => {
  describe('Query', () => {
    describe('pizzas', () => {
      const query = gql`
        query Pizzas($input: CursorInput!) {
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
      test('should get all pizzas', async () => {
        jest.spyOn(pizzaProvider, 'getPizzas').mockResolvedValue(mockCursor);
        jest.spyOn(toppingProvider, 'getToppingsByIds').mockResolvedValue([mockTopping]);
        jest.spyOn(toppingProvider, 'getPriceCents').mockResolvedValue(250);

        const variables: QueryPizzasArgs = {
          input: {
            cursor: '624e63d7a4182684ab6b6778',
            limit: 6,
          },
        };

        const result = await client.query({ query, variables });

        expect(result.data).toEqual({
          pizzas: {
            __typename: 'Cursor',
            cursor: mockCursor.cursor,
            hasNextPage: mockCursor.hasNextPage,
            results: mockCursor.results,
            totalCount: mockCursor.totalCount,
          },
        });

        expect(pizzaProvider.getPizzas).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Mutation', () => {
    describe('createPizza', () => {
      const mutation = gql`
        mutation CreatePizza($input: CreatePizzaInput!) {
          createPizza(input: $input) {
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

      const validProviderPizza = createMockProviderPizza({
        name: 'Name',
        description: 'Description',
        imgSrc: 'imgSrc',
        toppingIds: ['564f0184537878b57efcb703', 'a10d50e732a0b1d4f2c5e506'],
      });

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'createPizza').mockResolvedValue(validProviderPizza);
        jest.spyOn(toppingProvider, 'getToppingsByIds').mockResolvedValue([mockTopping]);
        jest.spyOn(toppingProvider, 'getPriceCents').mockResolvedValue(250);
      });

      test('should call create pizza when passed a valid input', async () => {
        const variables: MutationCreatePizzaArgs = {
          input: {
            name: validProviderPizza.name,
            description: validProviderPizza.description,
            imgSrc: validProviderPizza.imgSrc,
            toppingIds: validProviderPizza.toppingIds,
          },
        };

        await client.mutate({ mutation, variables });

        expect(pizzaProvider.createPizza).toHaveBeenCalledWith(variables.input);
      });

      test('should return created pizza when passed a valid input', async () => {
        const variables: MutationCreatePizzaArgs = {
          input: {
            description: validProviderPizza.description,
            imgSrc: validProviderPizza.imgSrc,
            name: validProviderPizza.name,
            toppingIds: validProviderPizza.toppingIds,
          },
        };

        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          createPizza: {
            __typename: 'Pizza',
            id: validProviderPizza.id,
            description: validProviderPizza.description,
            imgSrc: validProviderPizza.imgSrc,
            name: validProviderPizza.name,
            priceCents: mockPizza.priceCents,
            toppings: mockPizza.toppings,
          },
        });
      });
    });

    describe('deletePizza', () => {
      const mutation = gql`
        mutation ($input: String!) {
          deletePizza(input: $input)
        }
      `;

      const variables: MutationDeletePizzaArgs = {
        input: mockPizza.id,
      };

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'deletePizza').mockResolvedValue(mockPizza.id);
      });

      test('should call deletePizza with id', async () => {
        await client.mutate({ mutation, variables });

        expect(pizzaProvider.deletePizza).toHaveBeenCalledWith(variables.input);
      });

      test('should return deleted pizza id', async () => {
        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          deletePizza: mockPizza.id,
        });
      });
    });

    describe('updatePizza', () => {
      const mutation = gql`
        mutation ($input: UpdatePizzaInput!) {
          updatePizza(input: $input) {
            id
            name
            description
            imgSrc
            toppingIds
          }
        }
      `;

      const updatedPizza = createMockProviderPizza({
        description: 'Name',
        imgSrc: 'Description',
        name: 'imgSrc',
        toppingIds: ['564f0184537878b57efcb703', 'a10d50e732a0b1d4f2c5e506'],
      });

      const variables: MutationUpdatePizzaArgs = {
        input: {
          id: mockPizza.id,
          description: updatedPizza.description,
          imgSrc: updatedPizza.imgSrc,
          name: updatedPizza.name,
          toppingIds: updatedPizza.toppingIds,
        },
      };

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'updatePizza').mockResolvedValue(updatedPizza);
        jest.spyOn(toppingProvider, 'getToppingsByIds').mockResolvedValue([mockTopping]);
        jest.spyOn(toppingProvider, 'getPriceCents').mockResolvedValue(250);
      });

      test('should call updatePizza with input', async () => {
        await client.mutate({ mutation, variables });

        expect(pizzaProvider.updatePizza).toHaveBeenCalledWith(variables.input);
      });

      test('should return updated Pizza', async () => {
        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          updatePizza: {
            __typename: 'Pizza',
            id: mockPizza.id,
            description: updatedPizza.description,
            imgSrc: updatedPizza.imgSrc,
            name: updatedPizza.name,
          },
        });
      });
    });
  });
});
