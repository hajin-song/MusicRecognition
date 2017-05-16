import SymbolActions from 'omrActions/Symbols';

const initialState = {
 normal: { coordinates: [-1,-1,-1,-1], image: "" },
 half: { coordinates: [-1,-1,-1,-1], image: "" },
 whole: {coordinates: [-1,-1,-1,-1], image: "" },
 sharp: { coordinates: [-1,-1,-1,-1], image: "" },
 flat: { coordinates: [-1,-1,-1,-1], image: "" }
};

const getCoordinate = (box) => {
 let x = parseInt(box.x);
 let y = parseInt(box.y);
 let width = parseInt(box.width);
 let height = parseInt(box.height);
 return [x, y, x+width, y+height];
}

const symbolReducer = (state = initialState, action) => {
 switch(action.type) {
  case SymbolActions.CROP_NORMAL_NOTE:
   return Object.assign( {}, state, { normal: { coordinates: getCoordinate(action.cropPane), image: action.cropImage } });
  case SymbolActions.CROP_HALF_NOTE:
   return Object.assign( {}, state, { half: { coordinates: getCoordinate(action.cropPane), image: action.cropImage } });
  case SymbolActions.CROP_WHOLE_NOTE:
   return Object.assign( {}, state, { whole: { coordinates: getCoordinate(action.cropPane), image: action.cropImage } });
  case SymbolActions.CROP_FLAT:
   return Object.assign( {}, state, { flat: { coordinates: getCoordinate(action.cropPane), image: action.cropImage } });
  case SymbolActions.CROP_SHARP:
   return Object.assign( {}, state, { sharp: { coordinates: getCoordinate(action.cropPane), image: action.cropImage } });
  default:
   return state;
 }
}

export default symbolReducer;
