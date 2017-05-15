import AppActions from 'omrActions/App';

const AppReducer = (state = { uniquePath: "", staveGroup: [], control: false, clickedStaves: [] }, action) => {
 switch(action.type) {
  case AppActions.INIT_SESSION:
   return Object.assign( {}, state, { uniquePath: action.uniquePath });
  case AppActions.GET_STAVE_GROUPS:
   return Object.assign( {}, state, { staveGroup: action.staveGroup });
  case AppActions.KEY_PRESSED_CONTROL:
   if(!state.control){
    console.log("KEY PRESSED!");
    return Object.assign( {}, state, { control: true });
   }
   return state;
  case AppActions.KEY_RELEASED_CONTROL:
  if(state.control){
   console.log("KEY PRESSED!");
   return Object.assign( {}, state, { control: true });
  }
   return state;
  default:
   return state;
 }
}

export default AppReducer;
