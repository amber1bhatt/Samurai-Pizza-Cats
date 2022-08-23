import { Collection, ObjectId } from 'mongodb';
import { PizzaDocument, toPizzaObject } from '../../../entities/pizza';
import validateStringInputs from '../../../lib/string-validator';
import { ToppingProvider } from '../toppings/topping.provider';
import { CreatePizzaInput, Pizza, UpdatePizzaInput } from './pizzas.provider.types';
import { CursorProvider } from '../cursor/cursor.provider';
import { Cursor, CursorInput } from '../cursor/cursor.provider.types';

class PizzaProvider {
  constructor(
    private collection: Collection<PizzaDocument>,
    private provider: ToppingProvider,
    private cursorProvider: CursorProvider
  ) {}

  public async getPizzas(input: CursorInput): Promise<Cursor> {
    const returnValues = await this.cursorProvider.getCursorResult(input);
    return returnValues;
  }

  public async createPizza(input: CreatePizzaInput): Promise<Pizza> {
    const { name, description, imgSrc, toppingIds } = input;
    validateStringInputs([name, description, imgSrc]);
    if (toppingIds) await this.provider.validateToppings(toppingIds);

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId() },
      {
        $set: {
          ...(name && { name: name }),
          ...(description && { description: description }),
          ...(imgSrc && { imgSrc: imgSrc }),
          ...(toppingIds && { toppingIds: toppingIds.map((id) => new ObjectId(id)) }),
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not create the ${input.name} Pizza`);
    }

    return toPizzaObject(data.value);
  }

  public async updatePizza(input: UpdatePizzaInput): Promise<Pizza> {
    const { id, name, description, imgSrc, toppingIds } = input;

    if (name) await validateStringInputs(name);
    if (description) await validateStringInputs(description);
    if (imgSrc) await validateStringInputs(imgSrc);
    if (toppingIds) await this.provider.validateToppings(toppingIds);

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(name && { name: name }),
          ...(description && { description: description }),
          ...(imgSrc && { imgSrc: imgSrc }),
          ...(toppingIds && { toppingIds: toppingIds.map((id) => new ObjectId(id)) }),
        },
      },
      { returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not update the ${input.name} Pizza`);
    }

    return toPizzaObject(data.value);
  }

  public async deletePizza(input: string): Promise<string> {
    const data = await this.collection.findOneAndDelete({ _id: new ObjectId(input) });

    if (!data.value) {
      throw new Error(`Something went wrong when deleting ${input} Pizza`);
    }

    return input;
  }
}

export { PizzaProvider };
