import { Collection, ObjectId } from 'mongodb';

import { reveal, stub } from 'jest-auto-stub';
import { PizzaProvider } from '../../src/application/providers/pizzas/pizzas.provider';
import { mockSortToArray } from '../helpers/mongo.helper';
import { createMockCursor, createMockPizzaDocument } from '../helpers/pizza.helper';
import { PizzaDocument, toPizzaObject } from '../../src/entities/pizza';
import { ToppingProvider } from '../../src/application/providers/toppings/topping.provider';
import { CursorProvider } from '../../src/application/providers/cursor/cursor.provider';

const stubToppingProvider = stub<ToppingProvider>();
const stubPizzaCollection = stub<Collection<PizzaDocument>>();
const stubCursorProvider = stub<CursorProvider>();

const pizzaProvider = new PizzaProvider(stubPizzaCollection, stubToppingProvider, stubCursorProvider);

beforeEach(jest.clearAllMocks);

describe('pizzaProvider', (): void => {
  describe('pizzaProvider', (): void => {
    const mockPizzaDocument = createMockPizzaDocument();
    const mockPizza = toPizzaObject(mockPizzaDocument);
    const mockCursor = createMockCursor();

    describe('getPizzas', (): void => {
      beforeEach(() => {
        reveal(stubPizzaCollection).find.mockImplementation(mockSortToArray([mockPizzaDocument]));
        reveal(stubCursorProvider).getCursorResult.mockImplementation(async () => mockCursor);
      });

      test('should call find once', async () => {
        await pizzaProvider.getPizzas({ cursor: '624e63d7a4182684ab6b6778', limit: 6 });

        expect(stubCursorProvider.getCursorResult).toBeCalledTimes(1);
      });

      test('should get all pizzas and cursor, totalCount, hasNextPage', async () => {
        const result = await pizzaProvider.getPizzas({ cursor: '624e63d7a4182684ab6b6778', limit: 6 });

        expect(result).toEqual(mockCursor);
      });
    });

    describe('createPizza', (): void => {
      const validPizza = createMockPizzaDocument({
        description: 'create pizza test',
        imgSrc: 'create_pizza_test.png',
        name: 'Create Pizza Test',
        toppingIds: [new ObjectId(), new ObjectId()],
      });

      beforeEach(() => {
        reveal(stubPizzaCollection).findOneAndUpdate.mockImplementation(() => ({ value: validPizza }));
      });

      test('should call findOneAndUpdate once', async () => {
        await pizzaProvider.createPizza({
          description: validPizza.description,
          imgSrc: validPizza.imgSrc,
          name: validPizza.name,
          toppingIds: validPizza.toppingIds,
        });

        expect(stubPizzaCollection.findOneAndUpdate).toHaveBeenCalledTimes(1);
      });

      test('should throw an error if findOneAndUpdate returns null for value', async () => {
        reveal(stubPizzaCollection).findOneAndUpdate.mockImplementation(() => ({ value: null }));

        await expect(pizzaProvider.createPizza(mockPizza)).rejects.toThrow(
          new Error(`Could not create the ${mockPizza.name} Pizza`)
        );
      });

      test('should return a pizza when passed valid input', async () => {
        const result = await pizzaProvider.createPizza({
          description: validPizza.description,
          imgSrc: validPizza.imgSrc,
          name: validPizza.name,
          toppingIds: validPizza.toppingIds,
        });

        expect(result).toEqual(toPizzaObject(validPizza));
      });
    });

    describe('deletePizza', (): void => {
      beforeEach(() => {
        reveal(stubPizzaCollection).findOneAndDelete.mockImplementation(() => ({ value: mockPizzaDocument }));
      });
      test('should call findOneAndDelete once', async () => {
        await pizzaProvider.deletePizza(mockPizza.id);

        expect(stubPizzaCollection.findOneAndDelete).toHaveBeenCalledTimes(1);
      });

      test('should throw an error if findOneAndDelete returns null for value', async () => {
        reveal(stubPizzaCollection).findOneAndDelete.mockImplementation(() => ({ value: null }));

        await expect(pizzaProvider.deletePizza(mockPizza.id)).rejects.toThrow(
          new Error(`Something went wrong when deleting ${mockPizza.id} Pizza`)
        );
      });

      test('should return an id', async () => {
        const result = await pizzaProvider.deletePizza(mockPizza.id);

        expect(result).toEqual(mockPizza.id);
      });
    });

    describe('updatePizza', (): void => {
      const validPizza = createMockPizzaDocument({
        description: 'update pizza test',
        imgSrc: 'create_update_test.png',
        name: 'Create Update Test',
        toppingIds: [new ObjectId(), new ObjectId()],
      });

      beforeEach(() => {
        reveal(stubPizzaCollection).findOneAndUpdate.mockImplementation(() => ({ value: validPizza }));
      });

      test('should call findOneAndUpdate once', async () => {
        await pizzaProvider.updatePizza({
          id: validPizza.id,
          name: validPizza.name,
          description: validPizza.description,
          imgSrc: validPizza.imgSrc,
          toppingIds: validPizza.toppingIds,
        });

        expect(stubPizzaCollection.findOneAndUpdate).toHaveBeenCalledTimes(1);
      });

      test('should throw an error if findOneAndUpdate returns null for value', async () => {
        reveal(stubPizzaCollection).findOneAndUpdate.mockImplementation(() => ({ value: null }));

        await expect(pizzaProvider.updatePizza(mockPizza)).rejects.toThrow(
          new Error(`Could not update the ${mockPizza.name} Pizza`)
        );
      });

      test('should return a pizza', async () => {
        const result = await pizzaProvider.updatePizza({
          id: validPizza.id,
          name: validPizza.name,
          description: validPizza.description,
          imgSrc: validPizza.imgSrc,
          toppingIds: validPizza.toppingIds,
        });

        expect(result).toEqual(toPizzaObject(validPizza));
      });
    });
  });
});
