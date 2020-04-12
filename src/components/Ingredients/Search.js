/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo((props) => {
    const [enteredFilter, setEnteredFilter] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            const query =
                enteredFilter.length === 0
                    ? ''
                    : `?orderBy="title"&equalTo="${enteredFilter}"`;

            fetch(
                'https://react-hools.firebaseio.com/ingredients.json' + query,
                {
                    method: 'GET',
                    headers: { 'Content-type': 'application/json' },
                },
            )
                .then((responseData) => responseData.json())
                .then((response) => {
                    const filteredIngredients =
                        (response &&
                            Object.keys(response).map((itemID) => ({
                                id: itemID,
                                title: response[itemID].title,
                                amount: response[itemID].amount,
                            }))) ||
                        [];
                    props.onSearchIngredients(filteredIngredients);
                });
        }, 500);
        return () => clearTimeout(timer);
    }, [enteredFilter, props]);
    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input
                        type="text"
                        value={enteredFilter}
                        onChange={(event) =>
                            setEnteredFilter(event.target.value)
                        }
                    />
                </div>
            </Card>
        </section>
    );
});

export default Search;
