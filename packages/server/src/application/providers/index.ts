import { setupDb } from '../database';

import { ToppingProvider } from './toppings/topping.provider';
import { PizzaProvider } from './pizzas/pizzas.provider';
import { CursorProvider } from './cursor/cursor.provider';

const db = setupDb();

const toppingProvider = new ToppingProvider(db.collection('toppings'));
const cursorProvider = new CursorProvider(db.collection('pizzas'));
const pizzaProvider = new PizzaProvider(db.collection('pizzas'), toppingProvider, cursorProvider);

export { toppingProvider, pizzaProvider };
