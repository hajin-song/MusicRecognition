import AppActions from 'omrActions/App';

const AppReducer = (state = { uniquePath: "" }, action) => {
 switch(action.type) {
  case AppActions.INIT_SESSION:
   return Object.assign( {}, state, { uniquePath: action.uniquePath });
  default:
   return state;
 }
}

export default AppReducer;
