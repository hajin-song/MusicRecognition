/**
* Session.js
* Session Reducer
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/

import SessionActions from 'omrActions/Session';

// sheets are in their Data URI format
const initial_state = {
 original: "",
 unstaved: "",
 unique_path: "",
}

const AppReducer = (state = initial_state, action) => {
 switch(action.type) {
  case SessionActions.INIT_SESSION:
   return Object.assign( {}, state, { unique_path: action.unique_path });
  case SessionActions.ORIGINAL_SHEET:
   return Object.assign( {}, state, { original: action.data});
  case SessionActions.UNSTAVED_SHEET:
   return Object.assign( {}, state, { unstaved: action.data});
  case SessionActions.EDIT_UNSTAVED_SHEET:
   $.post('/editImage',
    { img: action.data, name: 'sheet_without_staves.png'},
    (res) => { }
   );
   return state;
  default:
   return state;
 }
}

export default AppReducer;
