import SheetActions from 'omrActions/MusicSheet';

const sheetReducer = (state = { sheet: {}, current: "" }, action) => {
 switch(action.type) {
  case SheetActions.UPLOAD_SHEET:
   return Object.assign( {}, state, { sheet: action.sheet, current: action.sheet });
  case SheetActions.ORIGINAL_SHEET:
   return Object.assign( {}, state, { current: action.sheet });
  case SheetActions.UNSTAVED_SHEET:
   return Object.assign( {}, state, { current: "sheet_without_staves.png" });
  case SheetActions.DETECTED_SHEET:
   return Object.assign( {}, state, { current: "image_marked.png" });
  default:
   return state;
 }
}

export default sheetReducer;
