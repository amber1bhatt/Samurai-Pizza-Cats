import { screen, waitFor } from '@testing-library/react';
import { graphql } from 'msw';

import { renderWithProviders } from '../../../lib/test/renderWithProviders';
import { Pizza } from '../../../types/pizza';
import { server } from '../../../lib/test/msw-server';
import { createTestCursor, createTestPizza } from '../../../lib/test/helper/pizza';
import PizzaList, { PizzaListProps } from '../PizzaList';
import { Cursor } from '../../../types/schema';

describe('PizzaList', () => {
  const renderPizzaList = (props: PizzaListProps) => {
    const view = renderWithProviders(<PizzaList {...props} />);

    return {
      ...view,
      $findPizzaItems: () => screen.findAllByTestId(/^pizza-item-/),
      $findLoadingCard: () => screen.queryByTestId(/^pizza-list-loading/),
    };
  };

  const props = {
    cursorData: {
      pizzas: createTestCursor(),
    },
    handleOpen: jest.fn(),
  };

  const mockCursorQuery = (data: Partial<Cursor>) => {
    server.use(
      graphql.query('Query', (_request, response, context) => {
        return response(
          context.data({
            loading: false,
            pizzas: {
              cursor: data.cursor,
              hasNextPage: data.hasNextPage,
              totalCount: data.totalCount,
              results: [data.results],
            },
          })
        );
      })
    );
  };

  beforeEach(() => {
    const pizza1 = createTestPizza();
    const validCursorPizza = {
      cursor: 'cursorString',
      hasNextPage: true,
      totalCount: 15,
      results: [pizza1],
    };
    mockCursorQuery(validCursorPizza);
  });

  test('should display a list of pizzas', async () => {
    const { $findPizzaItems } = renderPizzaList(props);

    await waitFor(async () => expect(await $findPizzaItems()).toHaveLength(1));
  });
});
