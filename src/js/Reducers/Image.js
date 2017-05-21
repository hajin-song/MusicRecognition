import ImageActions from 'omrActions/Image';


function initialiser(){
 return {
  original: "",
  detected: "",
  unstaved: "",
 }
}

const sheetReducer = (state = initialiser(), action) => {
 switch(action.type) {
  case ImageActions.UNSTAVED_SHEET:
   $.post("/editImage", {img:action.sheet, name:"sheet_without_staves.png"}, function(res){
    console.log(res);
   });
   return Object.assign( {}, state, { unstaved: action.sheet });
  case ImageActions.ORIGINAL_SHEET:
   return Object.assign( {}, state, { original: action.sheet });
  case ImageActions.DETECTED_SHEET:
   return Object.assign( {}, state, { detected: action.sheet });
  default:
   return state;
 }
}

export default sheetReducer;
