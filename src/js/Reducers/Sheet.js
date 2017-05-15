import SheetActions from 'omrActions/Sheet';

function handleStaveClick(stave, list){
 let result = list.slice(0);
 let staveIndex = $.objectIndex(stave, list);
 if(staveIndex == -1){ result.push(stave); }
 else{ result.splice(staveIndex , 1); }
 return result;
}

function handleStaveSectionMerge(staveList, currentStaveGroup){
 let y0 = staveList[0].stave.y0;
 let y1 = staveList[1].stave.y1;
 for(var staveIndex = 0 ; staveIndex < staveList.length ; staveIndex++){
  if(y0 != staveList[staveIndex].stave.y0 || y1 != staveList[staveIndex].stave.y1){
   console.log("Cannot merge section that does not have belong in same stave row");
   return currentStaveGroup;
  }
 }

 let targetStave = currentStaveGroup.filter( (stave) => {
  return stave.y0 == y0 && stave.y1 == y1;
 })[0];

 let targetIndex = $.objectIndex(targetStave, currentStaveGroup);
 var mergers = staveList.reduce( (cur, current) => {
  return cur.concat(current.section)
 }, []).sort((a,b) => { return a- b; });

 let newSections = targetStave.sections.filter( (section) => {
  return section <= mergers[0] || mergers[mergers.length - 1] <= section
 });


 let newStave = Object.assign( {}, targetStave, { sections: newSections });
 var newStaveGroup = currentStaveGroup.slice(0);
 newStaveGroup[targetIndex] = newStave;

 return [newStaveGroup, newStave];
}

const sheetReducer = (state = { sheet: {}, current: "", uniquePath: "", clickedStaves: [], staveGroup: [] }, action) => {
 switch(action.type) {
  case SheetActions.UPLOAD_SHEET:
   return Object.assign( {}, state, { sheet: action.sheet, current:  "original.png" });
  case SheetActions.ORIGINAL_SHEET:
   return Object.assign( {}, state, { current: "original.png" });
  case SheetActions.DETECTED_SHEET:
   return Object.assign( {}, state, { current: "image_marked.png" });
  case SheetActions.GET_STAVE_GROUPS:
   return Object.assign( {}, state, { staveGroup: action.staveGroup });
  case SheetActions.STAVE_CLICKED_CONTROL:
   return Object.assign( {}, state, { clickedStaves: handleStaveClick(action.area, state.clickedStaves) });
  case SheetActions.MERGE_STAVE_SECTIONS:
   var result = handleStaveSectionMerge(state.clickedStaves, state.staveGroup);

   var data = {};
   data["data"] = JSON.stringify(result[1]);
   data["target"] = "stave.pkl";
   console.log(data);
   $.post('/update', data, (res)=>{
    console.log(res);
   });

   return Object.assign( {}, state, { staveGroup: result[0], clickedStaves: [] });;
  default:
   return state;
 }
}

export default sheetReducer;
