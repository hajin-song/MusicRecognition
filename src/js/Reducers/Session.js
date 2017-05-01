import SessionActions from 'omrActions/Session';

const sessionREducer = (state = { uniquePath: "" }, action) => {
 switch(action.type) {
  case SessionActions.INIT_SESSION:
   return Object.assign( {}, state, { uniquePath: action.uniquePath });
  default:
   return state;
 }
}

export default sessionREducer;
