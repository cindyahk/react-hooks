/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import LoadingIndicator from '../UI/LoadingIndicator';
import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo((props) => {
    console.log('Ingredient form rendering');
    const [inputTitle, setInputTitle] = useState('');
    const [inputAmount, setInputAmount] = useState('');

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAddIngredient({ title: inputTitle, amount: inputAmount });
    };

    return (
        <section className="ingredient-form">
            <Card>
                <form onSubmit={submitHandler}>
                    <div className="form-control">
                        <label htmlFor="title">Name</label>
                        <input
                            type="text"
                            id="title"
                            value={inputTitle}
                            onChange={(event) => {
                                setInputTitle(event.target.value);
                            }}
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={inputAmount}
                            onChange={(event) => {
                                setInputAmount(event.target.value);
                            }}
                        />
                    </div>
                    <div className="ingredient-form__actions">
                        <button type="submit">Add Ingredient</button>
                        {props.isLoading && <LoadingIndicator />}
                    </div>
                </form>
            </Card>
        </section>
    );
});

export default IngredientForm;
