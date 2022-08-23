import { Document } from 'mongodb';
import { Pizza } from '../application/providers/pizzas/pizzas.provider.types';

interface PizzaDocument extends Document, Omit<Pizza, 'id' | 'toppingIds'> {}

const toPizzaObject = (pizza: PizzaDocument): Pizza => {
  return {
    id: pizza._id.toHexString(),
    name: pizza.name,
    description: pizza.description,
    toppingIds: pizza.toppingIds,
    imgSrc: pizza.imgSrc,
  };
};

export { PizzaDocument, toPizzaObject };
