import React from 'react';
import { render } from 'react-dom';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import App from './app.js';

import sheet from 'omrReducers/Sheet';
import symbols from 'omrReducers/Symbols';
import crop from 'omrReducers/Cropper';
import app from 'omrReducers/App';
import image from 'omrReducers/Image';

import AppActions from 'omrActions/App';

$(document).ready(()=>{
 (function($) {
  $.objectIndex = function(object, list) {
   if(typeof object === "undefined"){ return -1; }

   let targetAsString = JSON.stringify(object);

   var contains = list.filter(function(obj){
    return JSON.stringify(obj) === targetAsString;
   });
   if(contains.length == 0){ return -1; }
   for(var index = 0 ; index < list.length ; index++){
    if(JSON.stringify(list[index]) === targetAsString){
     return index;
    }
   };
   return -1;
  }
 }(jQuery));

 $.get("/session", (data) => {
  const Reducer = combineReducers({
   sheet,
   symbols,
   crop,
   app,
   image,
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
