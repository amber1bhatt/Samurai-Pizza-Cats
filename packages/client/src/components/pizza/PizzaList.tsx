import { Grid } from '@material-ui/core';
import React from 'react';
import { Pizza } from '../../types/pizza';
import PizzaItem from './PizzaItem';

export interface PizzaListProps {
  cursorData?: any;
  handleOpen: (pizza?: Pizza) => void;
}

const PizzaList: React.FC<PizzaListProps> = ({ handleOpen, ...props }) => {
  const pizzaList = props.cursorData?.pizzas.results.map((pizzas: Pizza) => (
    <Grid item xs={12} sm={4}>
      <PizzaItem data-testid={`pizza-item-${pizzas?.id}`} key={pizzas.id} handleOpen={handleOpen} pizza={pizzas} />
    </Grid>
  ));

  return pizzaList;
};

export default PizzaList;
