import { Pizza } from '../schema/types/schema';
import { pizzaProvider } from '../providers';
import { CreatePizzaInput, UpdatePizzaInput } from '../providers/pizzas/pizzas.provider.types';
import { Root } from '../schema/types/types';
import { Cursor, CursorInput } from '../providers/cursor/cursor.provider.types';

type OmitPizza = Omit<Pizza, 'toppings' | 'priceCents'>;

const pizzaResolver = {
  Query: {
    pizzas: async (_: Root, args: { input: CursorInput }): Promise<Cursor> => {
      return pizzaProvider.getPizzas(args.input);
    },
  },

  Mutation: {
    createPizza: async (_: Root, args: { input: CreatePizzaInput }): Promise<OmitPizza> => {
      return pizzaProvider.createPizza(args.input);
    },
    updatePizza: async (_: Root, args: { input: UpdatePizzaInput }): Promise<OmitPizza> => {
      return pizzaProvider.updatePizza(args.input);
    },
    deletePizza: async (_: Root, args: { input: string }): Promise<string> => {
      return pizzaProvider.deletePizza(args.input);
    },
  },
};

export { pizzaResolver };
