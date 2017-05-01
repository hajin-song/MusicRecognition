import React from 'react';
import { render } from 'react-dom';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import App from './app.js';

import sheet from 'omrReducers/Sheet';
import symbols from 'omrReducers/Symbols';
import crop from 'omrReducers/Cropper';
import session from 'omrReducers/Session';

import SessionAction from 'omrActions/Session';

$(document).ready(()=>{
 $.get("/session", (data) => {
  const Reducer = combineReducers({
   sheet,
   symbols,
   crop,
   session
  });

  const store = createStore(Reducer, {});

  store.dispatch({
   type: SessionAction.INIT_SESSION,
   uniquePath: data.uniqueString
  })

  render(
   <Provider store={store}>
    <App />
   </Provider>,
   document.getElementById('app')
  );
 });
});
