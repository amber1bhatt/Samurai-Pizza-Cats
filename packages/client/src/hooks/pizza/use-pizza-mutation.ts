import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import { GET_PIZZAS } from '../graphql/pizza/queries/get-pizzas';
import { CREATE_PIZZA } from '../graphql/pizza/mutations/create-pizza';
import { DELETE_PIZZA } from '../graphql/pizza/mutations/delete-pizza';
import { UPDATE_PIZZA } from '../graphql/pizza/mutations/update-pizza';

interface UsePizzaMutationsOutput {
  onCreatePizza: (selectedPizza: any) => void;
  onDeletePizza: (selectedPizza: any) => Promise<void>;
  onUpdatePizza: (selectedPizza: any) => void;
}

const usePizzaMutations = (): UsePizzaMutationsOutput => {
  const [createPizza] = useMutation(CREATE_PIZZA, { refetchQueries: [GET_PIZZAS, 'Query'] });
  const [deletePizza] = useMutation(DELETE_PIZZA, { refetchQueries: [GET_PIZZAS, 'Query'] });
  const [updatePizza] = useMutation(UPDATE_PIZZA, { refetchQueries: [GET_PIZZAS, 'Query'] });

  const onCreatePizza = useCallback(
    async (selectedPizza) => {
      try {
        await createPizza({
          variables: {
            createPizzaInput: {
              name: selectedPizza.name,
              description: selectedPizza.description,
              imgSrc: selectedPizza.imgSrc,
              toppingIds: selectedPizza.toppingIds,
            },
          },
        });
      } catch (err) {
        console.log(err);
        alert('Failed to create this Pizza');
      }
    },
    [createPizza]
  );

  const onDeletePizza = useCallback(
    async (selectedPizza) => {
      try {
        await deletePizza({
          variables: {
            deletePizzaInput: selectedPizza.id,
          },
        });
      } catch (err) {
        console.log(err);
        alert('Failed to delete this Pizza');
      }
    },
    [deletePizza]
  );

  const onUpdatePizza = useCallback(
    async (selectedPizza) => {
      try {
        await updatePizza({
          variables: {
            updatePizzaInput: {
              id: selectedPizza.id,
              name: selectedPizza.name,
              description: selectedPizza.description,
              imgSrc: selectedPizza.imgSrc,
              toppingIds: selectedPizza.toppingIds,
            },
          },
        });
      } catch (err) {
        console.log(err);
        alert('Failed to update this Pizza');
      }
    },
    [updatePizza]
  );

  return { onCreatePizza, onUpdatePizza, onDeletePizza };
};

export default usePizzaMutations;
