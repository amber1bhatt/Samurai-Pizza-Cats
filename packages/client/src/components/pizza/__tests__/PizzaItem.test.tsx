import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../../lib/test/renderWithProviders';
import { createTestPizza } from '../../../lib/test/helper/pizza';
import PizzaItem, { PizzaItemProps } from '../PizzaItem';
import toDollars from '../../../lib/format-dollars';

describe('PizzaItem', () => {
  const renderPizzaList = (props: PizzaItemProps) => {
    const view = renderWithProviders(<PizzaItem {...props} />);

    return {
      ...view,
      $getImg: () => screen.getByTestId(/^pizza-img/),
      $getName: () => screen.getByTestId(/^pizza-name/),
      $getDescription: () => screen.getByTestId(/^pizza-description/),
      $getPrice: () => screen.getByTestId(/^pizza-price/),
      $getOnClick: () => screen.getByRole('button'),
    };
  };

  const props = {
    handleOpen: jest.fn(),
    pizza: createTestPizza(),
  };

  test('should display all components of the pizza item', async () => {
    const { $getImg, $getName, $getDescription, $getPrice, $getOnClick } = renderPizzaList(props);

    expect($getImg()).toBeVisible();

    expect($getName()).toBeVisible();
    expect($getName().innerHTML).toContain(props.pizza.name);

    expect($getDescription()).toBeVisible();
    expect($getDescription().innerHTML).toContain(props.pizza.description);

    expect($getPrice()).toBeVisible();
    expect($getPrice().innerHTML).toContain(toDollars(props.pizza.priceCents));

    expect($getOnClick()).toBeVisible();
  });

  test('should call handleOpen when the pizza item is clicked', async () => {
    const { $getOnClick } = renderPizzaList(props);

    userEvent.click($getOnClick());

    expect(props.handleOpen).toHaveBeenCalledTimes(1);
  });
});
