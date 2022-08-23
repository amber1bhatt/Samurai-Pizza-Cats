import React from 'react';
import { Container, createStyles, Grid, Theme, Box, Button } from '@material-ui/core';
import PageHeader from '../common/PageHeader';
import { makeStyles } from '@material-ui/styles';
import PizzaList from './PizzaList';
import { Pizza } from '../../types/pizza';
import PizzaItem from './PizzaItem';
import PizzaModal from './PizzaModal';
import { useQuery } from '@apollo/client';
import { GET_PIZZAS } from '../../hooks/graphql/pizza/queries/get-pizzas';
import CardItemSkeleton from '../common/CardItemSkeleton';

const useStyles = makeStyles(({ typography }: Theme) =>
  createStyles({
    container: {
      width: '100%',
      alignItems: 'center',
      justify: 'center',
    },
    root: {
      flexGrow: 1,
    },
    pizzaGridPadding: {
      paddingLeft: typography.pxToRem(50),
    },
    imgSizing: {
      width: typography.pxToRem(350),
      height: typography.pxToRem(350),
    },
    buttonStyles: {
      margin: typography.pxToRem(40),
      color: 'black',
    },
  })
);

const Pizzas: React.FC = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [selectedPizza, setSelectedPizza] = React.useState<Partial<Pizza>>();

  const { loading, error, data, fetchMore } = useQuery(GET_PIZZAS, {
    variables: {
      input: {
        cursor: null,
        limit: 6,
      },
    },
  });

  if (loading) {
    return <CardItemSkeleton data-testid={`pizza-list-loading`}>Loading . . . Please Wait</CardItemSkeleton>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const handleOpen = (pizza?: Pizza): void => {
    setSelectedPizza(pizza);
    setOpen(true);
  };

  return (
    <Container>
      <PageHeader pageHeader={'Pizzas'} />
      <Grid container spacing={3}>
        <Grid container item spacing={3}>
          <Grid item xs={12} sm={4}>
            <PizzaItem key="add-pizza-item" handleOpen={handleOpen} />
          </Grid>
          <PizzaList key="add-pizza-list" handleOpen={handleOpen} cursorData={data} />
        </Grid>
      </Grid>
      <Box component="span" sx={{ display: 'none' }}>
        <PizzaModal
          selectedPizza={selectedPizza}
          setSelectedPizza={setSelectedPizza}
          open={open}
          setOpen={setOpen}
          handleOpen={handleOpen}
        />
      </Box>
      <Box textAlign="center">
        {data?.pizzas.hasNextPage ? (
          <Button
            variant="outlined"
            className={classes.buttonStyles}
            onClick={(): void => {
              fetchMore({
                variables: {
                  input: {
                    cursor: data?.pizzas.cursor,
                    limit: 6,
                  },
                },
              });
            }}
          >
            Show More
          </Button>
        ) : (
          <Button variant="outlined" className={classes.buttonStyles} disabled={true}>
            No More Pizzas
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Pizzas;
