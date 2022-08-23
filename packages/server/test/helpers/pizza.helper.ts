import { ObjectId } from 'bson';
import { Pizza, Topping } from '../../src/application/schema/types/schema';
import { Pizza as ProviderPizza } from '../../src/application/providers/pizzas/pizzas.provider.types';
import { PizzaDocument } from '../../src/entities/pizza';
import { Cursor } from '../../src/application/providers/cursor/cursor.provider.types';

const createMockCursor = (data?: Partial<Cursor>): Cursor => {
  return {
    results: [],
    totalCount: 25,
    hasNextPage: true,
    cursor: 'd48b39393f18c374818712c4',
    ...data,
  };
};

const createMockSchemaPizza = (data?: Partial<Pizza>): Pizza => {
  return {
    __typename: 'Pizza',
    description: 'Simple',
    id: 'd48b39393f18c374818712c4',
    imgSrc:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    name: 'Cheese',
    priceCents: 250,
    toppings: [
      {
        __typename: 'Topping',
        id: '564f0184537878b57efcb703',
        name: 'Tomato Sauce',
        priceCents: 250,
      },
    ],
    ...data,
  };
};

const createMockTopping = (data?: Partial<Topping>): Topping => {
  return {
    __typename: 'Topping',
    id: '564f0184537878b57efcb703',
    name: 'Tomato Sauce',
    priceCents: 250,
    ...data,
  };
};

const createMockProviderPizza = (data?: Partial<ProviderPizza>): ProviderPizza => {
  return {
    description: 'Simple',
    id: 'd48b39393f18c374818712c4',
    imgSrc:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    name: 'Cheese',
    toppingIds: ['564f0184537878b57efcb703'],
    ...data,
  };
};

const createMockPizzaDocument = (data?: Partial<PizzaDocument>): PizzaDocument => {
  return {
    _id: new ObjectId(),
    description: 'TEST DESCRIPTION',
    imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1DkLCG4ibgdusFWVj5TEpBvhzO-6gXViYrg&usqp=CAU',
    name: 'TEST NAME',
    toppingIds: [new ObjectId(), new ObjectId()],
    ...data,
  };
};

export { createMockSchemaPizza, createMockProviderPizza, createMockPizzaDocument, createMockTopping, createMockCursor };
