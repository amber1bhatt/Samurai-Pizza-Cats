import React from 'react';
import { useQuery } from '@apollo/client';
import {
  Backdrop,
  createStyles,
  Fade,
  FormControl,
  makeStyles,
  Modal,
  Paper,
  TextField,
  Theme,
  MenuItem,
  InputLabel,
  Select,
  CardMedia,
  Button,
  FormGroup,
} from '@material-ui/core';
import CardItem from '../common/CardItem';

import usePizzaMutations from '../../hooks/pizza/use-pizza-mutation';
import { useFormik } from 'formik';
import { Topping } from '../../types/topping';
import { GET_TOPPINGS } from '../../hooks/graphql/topping/queries/get-toppings';

import defaultPizza from '../../assets/img/default-pizza.jpeg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    cardItem: {
      width: theme.typography.pxToRem(400),
      height: theme.typography.pxToRem(450),
    },
    formSizing: {
      width: theme.typography.pxToRem(400),
      height: theme.typography.pxToRem(200),
    },
    alignText: {
      textAlign: 'center',
    },
    imgSizing: {
      width: theme.typography.pxToRem(400),
      height: theme.typography.pxToRem(350),
    },
    selectNoWrap: {
      maxWidth: theme.typography.pxToRem(400),
    },
  })
);

interface PizzaModalProps {
  selectedPizza?: any;
  setSelectedPizza: React.Dispatch<React.SetStateAction<any>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpen: any;
}

const PizzaModal = ({ selectedPizza, setSelectedPizza, open, setOpen, handleOpen }: PizzaModalProps): JSX.Element => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_TOPPINGS);
  const { onCreatePizza, onUpdatePizza, onDeletePizza } = usePizzaMutations();

  const [selectedToppingIds, setSelectedToppingIds] = React.useState<Array<string>>();

  React.useEffect(() => {
    setSelectedToppingIds(selectedPizza?.toppings.map((topping: Topping) => topping.id));
  }, [selectedPizza?.id]);

  const handleToppingsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedToppingIds(Array.isArray(event.target.value) ? event.target.value : []);
  };

  const formik = useFormik({
    initialValues: {
      name: selectedPizza?.name,
      description: selectedPizza?.description,
      imgSrc: selectedPizza?.imgSrc,
      toppingIds: selectedPizza ? selectedPizza?.toppings.map((topping: Topping) => topping.id) : [],
    },
    onSubmit: (values) => {
      values.toppingIds = selectedToppingIds ? selectedToppingIds : [];
      selectedPizza
        ? onUpdatePizza({
          id: selectedPizza.id,
          ...values,
        })
        : onCreatePizza(values);
      handleOpen(null);
      setSelectedToppingIds([]);
      formik.resetForm();
      setOpen(false);
    },
  });

  return (
    <CardItem rootClassName={classes.cardItem}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={(): void => {
          formik.resetForm();
          setSelectedToppingIds([]);
          handleOpen(undefined);
          setOpen(false);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper className={classes.paper}>
            <h2 className={classes.alignText}>{selectedPizza ? selectedPizza.name : ''}</h2>
            <CardMedia component="img" image={selectedPizza?.imgSrc ?? defaultPizza} className={classes.imgSizing} />
            <form className={classes.formSizing} noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
              <FormGroup row={false}>
                <TextField
                  id="name"
                  label="Pizza Name"
                  defaultValue={selectedPizza?.name}
                  onChange={formik.handleChange}
                />
                <TextField
                  id="description"
                  label="Pizza Description"
                  defaultValue={selectedPizza?.description}
                  onChange={formik.handleChange}
                />
                <TextField
                  id="imgSrc"
                  label="Pizza Image"
                  defaultValue={selectedPizza?.imgSrc}
                  onChange={formik.handleChange}
                />
                <FormControl>
                  <InputLabel id="toppingIds-label">Toppings</InputLabel>
                  <Select
                    labelId="toppingIds-label"
                    id="toppingIds"
                    name="toppingIds"
                    multiple
                    defaultValue={selectedPizza ? selectedPizza?.toppings.map((topping: Topping) => topping.id) : []}
                    onChange={handleToppingsChange}
                    className={classes.selectNoWrap}
                  >
                    {data?.toppings.map((toppings: Topping) => (
                      <MenuItem key={toppings.id} value={toppings.id}>
                        {toppings.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormGroup row={true}>
                  <Button aria-label="update" type="submit">
                    Submit
                  </Button>
                  <Button
                    disabled={!selectedPizza?.id}
                    aria-label="delete"
                    type="button"
                    onClick={(): void => {
                      onDeletePizza(selectedPizza);
                      setOpen(false);
                    }}
                  >
                    Delete
                  </Button>
                </FormGroup>
              </FormGroup>
            </form>
          </Paper>
        </Fade>
      </Modal>
    </CardItem>
  );
};

export default PizzaModal;
