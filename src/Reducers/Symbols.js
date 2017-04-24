import SymbolActions from 'omrActions/Symbols';

const symbolReducer = (state = {normal: {}, half: {}, whole: {} }, action) => {
 switch(action) {
  case SymbolActions.CROP_NORMAL_NOTE:
   return Object.assign( {}, state, { normal: action.cropPane });
  case SymbolActions.CROP_HALF_NOTE:
   return Object.assign( {}, state, { half: action.cropPane });
  case SymbolActions.CROP_WHOLE_NOTE:
   return Object.assign( {}, state, { whole: action.cropPane });
  default:
   return state;
 }
}

export default symbolReducer;
