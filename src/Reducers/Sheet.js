import SheetActions from 'omrActions/MusicSheet';

const sheetReducer = (state = { sheet: {}, current: "" }, action) => {
 switch(action.type) {
  case SheetActions.UPLOAD_SHEET:
   console.log("UPLOADING SHEET");
   console.log(action.sheet);
   return Object.assign( {}, state, { sheet: action.sheet, current: action.sheet });
  case SheetActions.ORIGINAL_SHEET:
   console.log("TO ORIGINAL");
   return Object.assign( {}, state, { current: action.sheet });
  case SheetActions.UNSTAVED_SHEET:
   console.log("TO UNSTAVED_SHEET");
   return Object.assign( {}, state, { current: "sheet_without_staves.png" });
  case SheetActions.DETECTED_SHEET:
   console.log("TO DETECTED_SHEET");
   return Object.assign( {}, state, { current: "image_marked.png" });
  default:
   return state;
 }
}

export default sheetReducer;
