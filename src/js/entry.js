import React from 'react';
import { render } from 'react-dom';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import App from './app.js';

import sheet from 'omrReducers/Sheet';
import symbols from 'omrReducers/Symbols';
import crop from 'omrReducers/Cropper';
import app from 'omrReducers/App';
import mode from 'omrReducers/Mode';

import AppActions from 'omrActions/App';

$(document).ready(()=>{
 $.get("/session", (data) => {
  const Reducer = combineReducers({
   sheet,
   symbols,
   crop,
   app,
   mode
  });

  const store = createStore(Reducer, {});

  store.dispatch({
   type: AppActions.INIT_SESSION,
   uniquePath: data.uniqueString
  })

  console.log(store.getState().sheet);

  render(
   <Provider store={store}>
    <App />
   </Provider>,
   document.getElementById('app')
  );
 });
});
