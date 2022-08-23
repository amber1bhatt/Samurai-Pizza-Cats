import { Topping } from '../../types';

export interface PizzaToppingProps {
  toppings?: Topping;
}

const PizzaToppings: React.FC<PizzaToppingProps> = ({ toppings }) => {
  return <p data-testid={`topping-name-${toppings?.id}`}>{toppings?.name}</p>;
};

export default PizzaToppings;
