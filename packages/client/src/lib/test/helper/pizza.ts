import { ObjectId } from 'bson';

import { Cursor, Pizza } from '../../../types/schema';

export const createTestPizza = (data: Partial<Pizza> = {}): Pizza & { __typename: string } => ({
  __typename: 'Pizza',
  description: 'description',
  id: new ObjectId(),
  imgSrc: 'imgSrc',
  name: 'name',
  priceCents: 500,
  toppings: [
    {
      id: new ObjectId(),
      name: 'topping name',
      priceCents: 500,
    },
  ],
  ...data,
});

export const createTestCursor = (): Cursor & { __typename: string } => ({
  __typename: 'Cursor',
  cursor: new ObjectId().toHexString().toString(),
  hasNextPage: true,
  totalCount: 15,
  results: [createTestPizza()],
});
