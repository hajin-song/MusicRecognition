/**
* Symbols.js
* Symbols Reducer
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/

import SymbolActions from 'omrActions/Symbols';

// Coordinates are in x0,y0,x1,y1
// Set to -1 if not set
const initialState = {
 normal: { coordinates: [-1,-1,-1,-1], image: "" },
 half: { coordinates: [-1,-1,-1,-1], image: "" },
 whole: {coordinates: [-1,-1,-1,-1], image: "" },
 sharp: { coordinates: [-1,-1,-1,-1], image: "" },
 flat: { coordinates: [-1,-1,-1,-1], image: "" }
};


/**
 * getCoordinate - Convert box information into x0,y0,x1,y1
 *
 * @param  {Object} box Box information, start x and y, and width and height.
 * @return {Number[]}     description
 */
function getCoordinate(box){
 let x = parseInt(box.x);
 let y = parseInt(box.y);
 let width = parseInt(box.width);
 let height = parseInt(box.height);
 return [x, y, x+width, y+height];
}


/**
 * generateSymbol - Create new symbol object with cropped pane and image URI
 *
 * @param  {Object} crop_pane   bounding box for the cropped image
 * @param  {string} crop_image  data URI
 * @return {Object}             new symbol object
 */
function generateSymbol(crop_pane, crop_image){
 return {
  coordinates: getCoordinate(crop_pane),
  image: crop_image,
 };
}


const symbolReducer = (state = initialState, action) => {
 switch(action.type) {
  case SymbolActions.CROP_NORMAL_NOTE:
   return Object.assign(
    {},
    state,
    { normal: generateSymbol(action.crop_pane, action.crop_image) }
   );
  case SymbolActions.CROP_HALF_NOTE:
   return Object.assign(
    {},
    state,
    { half: generateSymbol(action.crop_pane, action.crop_image) }
   );
  case SymbolActions.CROP_WHOLE_NOTE:
   return Object.assign(
    {},
    state,
    { whole: generateSymbol(action.crop_pane, action.crop_image) }
   );
  case SymbolActions.CROP_FLAT:
   return Object.assign(
    {},
    state,
    { flat: generateSymbol(action.crop_pane, action.crop_image) }
   );
  case SymbolActions.CROP_SHARP:
   return Object.assign(
    {},
    state,
    { sharp: generateSymbol(action.crop_pane, action.crop_image) }
   );
  default:
   return state;
 }
}

export default symbolReducer;
