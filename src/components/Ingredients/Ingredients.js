import React, { useEffect, useCallback, useReducer, useMemo } from 'react';
import { useHttp } from '../../hooks/http';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientsReducer = (curIngredientsState, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...curIngredientsState, action.ingredient];
        case 'DELETE':
            return curIngredientsState.filter(
                (ing) => ing.id !== action.ingredientID,
            );
        default:
            throw new Error('Such action type is not defined');
    }
};

function Ingredients() {
    const [userIngredients, ingDispatch] = useReducer(ingredientsReducer, []);
    const {
        isLoading,
        error,
        sendRequest,
        clearRequest,
        data,
        uiAction,
    } = useHttp();

    // Equivalent to componentDidMount
    // it has no dependencies
    useEffect(() => {
        sendRequest({
            url: 'https://react-hools.firebaseio.com/ingredients.json',
            method: 'GET',
            uiAction: { type: 'fetch_ingredients' },
        });
    }, []);

    // Equivalent to componentDidUpdate
    // Dependency on userIngredients state
    useEffect(() => {
        console.log('INGREDIENTS HAVE CHANGED');
    }, [userIngredients]);

    const addIngredientHandler = useCallback((ingredient) => {
        sendRequest({
            url: 'https://react-hools.firebaseio.com/ingredients.json',
            method: 'POST',
            body: JSON.stringify(ingredient),
            uiAction: { type: 'add_ingredient', payload: ingredient },
        });
    }, []);

    const removeIngredientHandler = useCallback((ingredientID) => {
        sendRequest({
            url: `https://react-hools.firebaseio.com/ingredients/${ingredientID}.son`,
            method: 'DELETE',
            uiAction: { type: 'remove_ingredient', payload: ingredientID },
        });
    }, []);

    const loadIngredientsHandler = useCallback((ingredients) => {
        ingDispatch({ type: 'SET', ingredients });
    }, []);

    useEffect(() => {
        if (!isLoading && !error && uiAction) {
            switch (uiAction.type) {
                case 'fetch_ingredients':
                    ingDispatch({
                        type: 'SET',
                        ingredients:
                            (data &&
                                Object.keys(data).map((itemID) => ({
                                    id: itemID,
                                    title: data[itemID].title,
                                    amount: data[itemID].amount,
                                }))) ||
                            [],
                    });
                    break;
                case 'remove_ingredient':
                    ingDispatch({
                        type: 'DELETE',
                        ingredientID: uiAction.payload,
                    });
                    break;
                case 'add_ingredient':
                    ingDispatch({
                        type: 'ADD',
                        ingredient: uiAction.payload,
                    });
                    break;
            }
        }
    }, [data, uiAction, isLoading]);

    const cachedIngForm = useMemo(() => {
        return (
            <IngredientForm
                onAddIngredient={addIngredientHandler}
                isLoading={isLoading}
            />
        );
    }, [isLoading]);

    const cachedIngList = useMemo(
        () => (
            <IngredientList
                ingredients={userIngredients}
                onRemoveItem={removeIngredientHandler}
            />
        ),
        [userIngredients, removeIngredientHandler],
    );

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearRequest}>{error}</ErrorModal>}
            {cachedIngForm}

            <section>
                <Search onSearchIngredients={loadIngredientsHandler} />
                {/* Need to add list here! */}
                {cachedIngList}
            </section>
        </div>
    );
}

export default Ingredients;
