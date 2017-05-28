import React from 'react';
import { render } from 'react-dom';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import App from './app.js';

import sheet from 'omrReducers/Sheet';
import symbols from 'omrReducers/Symbols';
import crop from 'omrReducers/Cropper';
import session from 'omrReducers/Session';

import SessionActions from 'omrActions/Session';

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

 (function($) {
  $.objectCopy = function(object){
   return JSON.parse(JSON.stringify(object));
  }
 }(jQuery));

 (function($) {
  $.arrayCopy = function(array){
   return $.extend(true, [],  array);
  }
 }(jQuery));

 $.get("/session", (data) => {
  const Reducer = combineReducers({
   sheet,
   symbols,
   crop,
   session,
  });

  const store = createStore(Reducer, {});
  console.log(data);
  store.dispatch({
   type: SessionActions.INIT_SESSION,
   unique_path: data.unique_path
  });

  console.log(store.getState().sheet);

  render(
   <Provider store={store}>
    <App />
   </Provider>,
   document.getElementById('app')
  );
 });
});
