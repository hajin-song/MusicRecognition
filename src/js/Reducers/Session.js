import SessionActions from 'omrActions/Session';

const initialState = {
 original: "",
 unstaved: "",
 uniquePath: "",
}

const AppReducer = (state = initialState, action) => {
 switch(action.type) {
  case SessionActions.INIT_SESSION:
   return Object.assign( {}, state, { uniquePath: action.uniquePath });
  case SessionActions.ORIGINAL_SHEET:
   return Object.assign( {}, state, { original: action.data});
  case SessionActions.UNSTAVED_SHEET:
   return Object.assign( {}, state, { unstaved: action.data});
  default:
   return state;
 }
}

export default AppReducer;
