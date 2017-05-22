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

function initialiser(){
 return {
  clickedStaves: [],
  staveGroup: [],
  currentStave: {
   sections: [],
   stave: {
    notes: []
   }
  },
  resultSheet: {
   time: "4/4",
   keySig: []
  }
 }
}

function processNote(staveGroup){
 let pitches = ['e', 'f', 'g', 'a', 'b', 'c', 'd']
 for (var staveIndex = 0; staveIndex < staveGroup.length; staveIndex++) {
    var stave = staveGroup[staveIndex];
    for (var sectionIndex = 0 ; sectionIndex < stave.notes.length ; sectionIndex++){
     var notes = stave.notes[sectionIndex].notes;
     for(var noteIndex = 0 ; noteIndex < notes.length ; noteIndex++){
      var curPitch = notes[noteIndex].pitch;
      var curTailType = notes[noteIndex].tail_type;
      var curNoteType = notes[noteIndex].note_type;
      notes[noteIndex].pitch = pitches[curPitch % 7] + '/'+ (4 + (parseInt(curPitch/7)));
      if(curTailType == 0){
       notes[noteIndex]["duration"] = 'q';
      }else{
       notes[noteIndex]["duration"] = '8';
      }
     }
    }
   }
 return staveGroup;
}

const sheetReducer = (state = initialiser(), action) => {
 switch(action.type) {
  case SheetActions.GET_STAVE_GROUPS:
   console.log(processNote(action.staveGroup));
   return Object.assign( {}, state, { staveGroup: action.staveGroup });
  case SheetActions.STAVE_CLICKED_CONTROL:
   return Object.assign( {}, state, { clickedStaves: handleStaveClick(action.area, state.clickedStaves) });
  case SheetActions.MERGE_STAVE_SECTIONS:
   var result = handleStaveSectionMerge(state.clickedStaves, state.staveGroup);

   var data = {};
   data["data"] = JSON.stringify(result[1]);
   data["target"] = "stave.pkl";
   $.post('/update', data, (res)=>{
   });

   return Object.assign( {}, state, { staveGroup: result[0], clickedStaves: [] });;
  case SheetActions.STAVE_CLICKED:
   return Object.assign( {}, state, { currentStave: action.area });
  default:
   return state;
 }
}

export default sheetReducer;
