import {
  CardActionArea,
  CardContent,
  CardMedia,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import toDollars from '../../lib/format-dollars';

import { Pizza } from '../../types/pizza';
import CardItem from '../common/CardItem';

import defaultPizza from '../../assets/img/make-pizza.jpeg';

const useStyles = makeStyles(({ typography }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  root: {
    width: typography.pxToRem(350),
    height: typography.pxToRem(500),
  },
  imgSizing: {
    width: typography.pxToRem(350),
    height: typography.pxToRem(350),
  },
  name: {
    minWidth: typography.pxToRem(500),
  },
  media: {
    height: 140,
  },
}));

export interface PizzaItemProps {
  pizza?: Pizza;
  handleOpen: (pizza?: Pizza) => void;
}

const PizzaItem: React.FC<PizzaItemProps> = ({ pizza, handleOpen, ...props }) => {
  const classes = useStyles();

  return (
    <CardItem
      {...props}
      onClick={(): void => {
        handleOpen(pizza);
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          data-testid={`pizza-img-${pizza?.id}`}
          image={pizza?.imgSrc ?? defaultPizza}
          className={classes.imgSizing}
        />
        <CardContent>
          <Typography variant="h5" noWrap={true} data-testid={`pizza-name-${pizza?.id}`} align="center">
            {pizza?.name}
          </Typography>
          <Typography variant="body1" noWrap={true} data-testid={`pizza-description-${pizza?.id}`} align="center">
            {pizza?.description}
          </Typography>
          <Typography variant="body1" noWrap={true} data-testid={`pizza-price-${pizza?.id}`} align="center">
            {pizza?.priceCents ? toDollars(pizza.priceCents) : ''}
          </Typography>
        </CardContent>
      </CardActionArea>
    </CardItem>
  );
};

export default PizzaItem;
