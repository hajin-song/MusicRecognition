import React from 'react';
import { render } from 'react-dom';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import App from './app.js';

import sheet from 'omrReducers/Sheet';
import symbols from 'omrReducers/Symbols';
import crop from 'omrReducers/Cropper';

$(document).ready(()=>{
 /*
 initialiseCanvasPreview("musicSheet", "image");
 initialiseCropper("image");


 $("#form-stave").on("submit", function(e){
  e.preventDefault();
  $(this).ajaxSubmit({
   success:function(res){
    loadImageFromServer("sheet_without_staves.png");
   },
   error: function(err){ console.log(err); }
  });
  console.log(":D");
 });

 $("#form-detect").on("submit", function(e){
  e.preventDefault();
  $(this).ajaxSubmit({
   success:function(res){
    console.log(res);
    //loadImageFromServer();
   },
   error: function(err){ console.log(err); }
  });
  console.log(":D");
 });
 */
 const Reducer = combineReducers({
  sheet,
  symbols,
  crop
 });
 const store = createStore(Reducer, {});



 render(
  <Provider store={store}>
   <App />
  </Provider>,
  document.getElementById('app')
 );
});
