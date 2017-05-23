import CropperActions from 'omrActions/Cropper';


const cropperReducer = (state = { cropper: {} }, action) => {
 switch(action.type) {
  case CropperActions.CROP_CHANGED:
   if (Object.getOwnPropertyNames(state.cropper).length > 0){
    state.cropper.destroy();
   }
   return Object.assign({}, state, { cropper: action.cropper });
  default:
   return state;
 }
}

export default cropperReducer;
