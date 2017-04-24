import CropperActions from 'omrActions/MusicSheet';

const cropperReducer = (state = { x: 0, y:0, height:0, width: 0 }, action) => {
 switch(action.type) {
  case CropperActions.CROP_PANE_CHANGED:
   return Object.assign(null, {},
    {
     x: action.x,
     y: action.y,
     height: action.height,
     width: action.width
    }
   );
  default:
   return state;
 }
}

export default cropperReducer;
