import ModeAction from 'omrActions/Mode';

const modeReducer = (state = { mode: ModeAction.LOAD_IMAGE }, action) => {
 switch(action.type) {
  case ModeAction.LOAD_IMAGE:
   return Object.assign({}, state, { mode: ModeAction.LOAD_IMAGE });
  case ModeAction.DETECT_IMAGE:
   return Object.assign({}, state, { mode: ModeAction.DETECT_IMAGE });
  case ModeAction.EDIT_IMAGE:
   return Object.assign({}, state, { mode: ModeAction.EDIT_IMAGE });
  default:
   return state;
 }
}

export default modeReducer;
