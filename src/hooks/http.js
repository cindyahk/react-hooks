import React, { useState, useCallback, useReducer } from 'react';

const initialState = {
    isLoading: false,
    error: null,
    data: null,
    uiAction: {
        type: '',
        payload: {},
    },
};

const httpReducer = (curHttpState, action) => {
    console.log(action);
    switch (action.type) {
        case 'START':
            return { isLoading: true, error: null, uiAction: action.uiAction };
        case 'SUCCESS':
            return {
                ...curHttpState,
                isLoading: false,
                error: null,
                data: action.data,
                uiAction: action.uiAction,
            };
        case 'ERROR':
            return {
                isLoading: false,
                error: action.error.message,
                uiAction: action.uiAction,
            };
        case 'CLEAR':
            return initialState;
        default:
            throw new Error('Such action type is not defined');
    }
};

export const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpReducer, initialState);

    const clearRequest = useCallback(() => httpDispatch({ type: 'CLEAR' }), []);

    const sendRequest = useCallback((options) => {
        httpDispatch({ type: 'START', uiAction: options.uiAction });

        fetch(options.url, {
            method: options.method,
            body: options.body,
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                httpDispatch({
                    type: 'SUCCESS',
                    data: responseData,
                    uiAction: options.uiAction,
                });
            })
            .catch((err) => {
                httpDispatch({
                    type: 'ERROR',
                    error: err,
                    uiAction: options.uiAction,
                });
            });
    }, []);

    return {
        isLoading: httpState.isLoading,
        error: httpState.error,
        data: httpState.data,
        uiAction: httpState.uiAction,
        sendRequest,
        clearRequest,
    };
};
