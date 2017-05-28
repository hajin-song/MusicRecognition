/**
* Cropper.js
* Cropper Reducer
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/

import CropperActions from 'omrActions/Cropper';

/**
 * replaceCropper - replaces cropper with the cropper with new image
 * This is an impure function that violates Redux's definition of reducers.
 * However, unless cropper is destroy, new cropper cannot be initialised.
 *
 * @param  {Object} cropper Cropper Object
 * @return {Object}         new state with new cropper
 */
function replaceCropper(cropper, current_state){
 if (Object.getOwnPropertyNames(current_state.cropper).length > 0){
  current_state.cropper.destroy();
 }
 return { cropper: cropper };
}


const initial_state = {
 cropper: {},
};

const cropperReducer = (state = initial_state, action) => {
 switch(action.type) {
  case CropperActions.CROP_CHANGED:
   return Object.assign({}, state, replaceCropper(action.cropper, state));
  default:
   return state;
 }
}

export default cropperReducer;
