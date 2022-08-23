import { Collection } from 'mongodb';
import { PizzaDocument, toPizzaObject } from '../../../entities/pizza';
import { Cursor, CursorInput } from './cursor.provider.types';

class CursorProvider {
  constructor(private collection: Collection<PizzaDocument>) {}

  public async getCursorIndex(input: CursorInput): Promise<number> {
    const { cursor } = input;

    if (cursor === null) {
      return 0;
    }

    const cursorIndex = await (await this.collection.find().sort({ name: 1 }).toArray())
      .map((x) => x._id.toHexString().toString())
      .findIndex((x) => x === cursor);

    if (cursorIndex === -1) {
      throw new Error('This cursor does not exist');
    }

    return cursorIndex + 1;
  }

  public async getCursorResult(input: CursorInput): Promise<Cursor> {
    let { limit } = input;

    if (limit === null) {
      limit = 0;
    }

    let hasNextPage = true;
    const index = await this.getCursorIndex(input);

    const totalCount = await (await this.collection.find().sort({ name: 1 }).toArray()).length;

    const pizzaArray = await this.collection.find().sort({ name: 1 }).skip(index).limit(limit).toArray();

    const results = pizzaArray.map(toPizzaObject);

    let newCursor = pizzaArray[pizzaArray.length - 1]._id;

    if (index + limit >= totalCount) {
      hasNextPage = false;
    }

    return {
      results: results,
      totalCount: totalCount,
      hasNextPage: hasNextPage,
      cursor: newCursor.toHexString(),
    };
  }
}

export { CursorProvider };
