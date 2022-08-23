import { screen, waitFor } from '@testing-library/react';
import { graphql } from 'msw';

import { renderWithProviders } from '../../../lib/test/renderWithProviders';
import { Pizza } from '../../../types/pizza';
import { server } from '../../../lib/test/msw-server';
import { createTestPizza } from '../../../lib/test/helper/pizza';
import PizzaList, { PizzaListProps } from '../PizzaList';
import Pizzas from '../Pizzas';
import { Cursor } from '../../../types/schema';

describe('PizzaList', () => {
  const renderPizzas = () => {
    const view = renderWithProviders(<Pizzas />);

    return {
      ...view,
      $findPizzaItems: () => screen.findAllByTestId(/^pizza-item-/),
      $findLoadingCard: () => screen.queryByTestId(/^pizza-list-loading/),
    };
  };

  const props = {
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

  test('pizza item loading card should be visible and not null', async () => {
    const { $findLoadingCard } = renderPizzas();

    await waitFor(async () => {
      expect($findLoadingCard()).toBeVisible();
      expect($findLoadingCard()).not.toBeNull();
    });
  });
});
