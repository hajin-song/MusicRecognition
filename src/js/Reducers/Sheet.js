/**
* Sheet.js
* Sheet Reducer
* Author: Ha Jin Song
* Last Modified: 22-May-2017
*/
import SheetActions from 'omrActions/Sheet';

/**
* Handles Note Click on the Stave view
* @param {Number} noteID - ID of the note being clicked
* @param {Array.<Number>} list - List of note IDs previously selected
* @description Adds the note ID to the list if it does not exists already
*/
function handleNoteClick(noteID, list){
 let result = $.arrayCopy(list);
 let noteIndex = list.indexOf(noteID);
 if(noteIndex == -1 ) { result.push(noteID); }
 else { result.splice(noteIndex, 1); }
 return result;
}

/**
* Handles Stave Click on the main sheet view
* @param {Object} stave - The stave being clicked
* @param {Array.<Object>} list - List of the Stave Groups previously selected
* @description Adds the stave to the list if it does not exists already
*/
function handleStaveClick(stave, list){
 let result = list.slice(0);
 let staveIndex = $.objectIndex(stave, list);
 if(staveIndex == -1){ result.push(stave); }
 else{ result.splice(staveIndex , 1); }
 return result;
}

/**
* Handle section merging
* @param {Array.<Object>} staveList - Selected Stave Sections
* @param {Array.<Object>} currentStaveGroup - Currently set Stave Groups
*/
function handleStaveSectionMerge(staveList, currentStaveGroup){
 let y0 = staveList[0].stave.y0;
 let y1 = staveList[1].stave.y1;
 for(var staveIndex = 0 ; staveIndex < staveList.length ; staveIndex++){
  if(y0 != staveList[staveIndex].stave.y0 || y1 != staveList[staveIndex].stave.y1){
   console.log('Cannot merge section that does not have belong in same stave row');
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

function createNote(pitchID, octaveID, durationID, note){
 let pitch = $('#' + pitchID).val();
 let octave = $('#' + octaveID).val();
 let duration = $('#' + durationID).val();

 var newNote;

 if(pitch === 'r'){
  if(duration === 'w'){ duration = 1; }
  else if(duration === 'h'){ duration = 2; }
  else if(duration === 'q'){ duration = 4; }
  newNote = { 'pitch': 'b', 'octave': '4', 'duration': duration + 'r' };
 }else{
  newNote = {'pitch': pitch, 'octave': octave, 'duration': duration };
 }

 return Object.assign( {}, note, newNote);
}

/**
* Adds a new note to the section
* @param {Object} currentStave - Current Stave Section
* @param {Array.<Object>} staveGroup - Currently set Stave Groups
* @return {Object} new stave group and current stave Object state
*/
function addNoteToSection(currentStave, staveGroup){
 let pitch = $('#note-pitch').val();
 let octave = $('#note-octave').val();
 let duration = $('#note-duration').val();

 // Make Deep copy of objects and arrays - Redux reducers need to be Pure
 let staveIndex = $.objectIndex(currentStave.stave, staveGroup);
 var newStaveGroup = $.arrayCopy(staveGroup);

 var notes = $.arrayCopy(currentStave.stave.notes);
 var newNote = createNote('note-pitch', 'note-octave', 'note-duration',
 { 'x': currentStave.section[1], 'id': notes.length, 'articulations': []});
 notes.push(newNote);


 var newStave = $.objectCopy(currentStave);
 newStave.stave.notes = notes;
 newStaveGroup[staveIndex] = newStave.stave;

 return { staveGroup: newStaveGroup, currentStave: newStave };
}

/**
* Remove a note from section
* @param {Object} note - new note object
* @param {Object} currentStave - Current Stave selected
* @param {Array.<Object>} staveGroup - Currently set Stave Groups
* @return {Object} new stave group and current stave Object state
*/
function editNoteFromSection(noteID, currentStave, staveGroup){
 let staveIndex = $.objectIndex(currentStave.stave, staveGroup);
 var newStaveGroup = $.arrayCopy(staveGroup);

 var newStave = $.objectCopy(currentStave);
 var newNote = createNote('note-pitch-' + noteID, 'note-octave-' + noteID, 'note-duration-'+noteID, newStave.stave.notes[noteID]);
 newStave.stave.notes[noteID] = newNote;
 newStaveGroup[staveIndex] = newStave.stave;
 return { staveGroup: newStaveGroup, currentStave: newStave };
}

/**
* Remove a note from section
* @param {Number} noteID - ID of the note being removed
* @param {Object} currentStave - Current Stave selected
* @param {Array.<Object>} staveGroup - Currently set Stave Groups
* @return {Object} new stave group and current stave Object state
*/
function removeNoteFromSection(noteID, currentStave, staveGroup){
 let staveIndex = $.objectIndex(currentStave.stave, staveGroup);
 var newStaveGroup = $.arrayCopy(staveGroup);

 var newStave = $.objectCopy(currentStave);
 newStave.stave.notes.splice(noteID, 1);
 newStaveGroup[staveIndex] = newStave.stave;
 return { staveGroup: newStaveGroup, currentStave: newStave };
}

function addArticulation(symbol, clickedNotes, currentStave, staveGroup){
 let staveIndex = $.objectIndex(currentStave.stave, staveGroup);
 var newStaveGroup = $.arrayCopy(staveGroup);

 var newStave = $.objectCopy(currentStave);
 clickedNotes.map( (note) => {
  let symbolIndex = newStave.stave.notes[note].articulations.indexOf(symbol);
  if(symbolIndex == -1){
   newStave.stave.notes[note].articulations.push(symbol);
  }else{
   newStave.stave.notes[note].articulations.splice(symbolIndex, 1);
  }
 });
 return { staveGroup: newStaveGroup, currentStave: newStave };
}


/**
*/
function markAsBarNote(clickedNotes, currentStave, staveGroup){
 let first = clickedNotes[0];
 let last = clickedNotes[clickedNotes.length - 1];

 let staveIndex = $.objectIndex(currentStave.stave, staveGroup);
 var newStaveGroup = $.arrayCopy(staveGroup);

 var newStave = $.objectCopy(currentStave);
 for(var i = first ; i <= last ; i++){
  if(newStave.stave.notes[i]['duration'] != 'w' && newStave.stave.notes[i]['duration'] != 'h' && newStave.stave.notes[i]['duration'] != 'q'){
   newStave.stave.notes[i]["bar"] = true;
  }
  else{
   alert("bad!");
    newStave = $.objectCopy(currentStave);
    break;
  }
 }
 newStaveGroup[staveIndex] = newStave.stave;

 return { staveGroup: newStaveGroup, currentStave: newStave };
}


function processNote(staveGroup){
 let pitches = ['e', 'f', 'g', 'a', 'b', 'c', 'd']
 for (var staveIndex = 0; staveIndex < staveGroup.length; staveIndex++) {
  var stave = staveGroup[staveIndex];
  for (var noteIndex = 0 ; noteIndex < stave.notes.length ; noteIndex++){
   var note = stave.notes[noteIndex];
   var curPitch = note.pitch;
   var curTailType = note.tail_type;
   var curNoteType = note.note_type;
   note.pitch = pitches[curPitch % 7];
   note['octave'] = 4 + (parseInt(curPitch/7));
   if(curTailType == 0){
    note['duration'] = 'q';
   }else{
    note['duration'] = '8';
   }
   note['id'] = noteIndex;
  }
 }
 return staveGroup;
}

const initialState = {
 clickedStaves: [],
 clickedNotes: [],
 staveGroup: [],
 currentStave: { sections: [], stave: { notes: [] } },
};

const sheetReducer = (state = initialState, action) => {
 switch(action.type) {
  case SheetActions.GET_STAVE_GROUPS:
   return Object.assign( {}, state, { staveGroup: processNote(action.staveGroup) });
  case SheetActions.STAVE_CLICKED_CONTROL:
   return Object.assign( {}, state, { clickedStaves: handleStaveClick(action.area, state.clickedStaves) });
  case SheetActions.MERGE_STAVE_SECTIONS:
   var result = handleStaveSectionMerge(state.clickedStaves, state.staveGroup);
   let data = { 'data': JSON.stringify(result[1]), 'target': 'stave.pkl' };
   $.post('/update', data, (res)=>{ });
   return Object.assign( {}, state, { staveGroup: result[0], clickedStaves: [] });;
  case SheetActions.STAVE_CLICKED:
   return Object.assign( {}, state, { currentStave: action.area });
  case SheetActions.ADD_NOTE:
   return Object.assign( {}, state, addNoteToSection(state.currentStave, state.staveGroup));
  case SheetActions.REMOVE_NOTE:
   return Object.assign( {}, state, removeNoteFromSection(action.noteID, state.currentStave, state.staveGroup));
  case SheetActions.EDIT_NOTE:
   return Object.assign( {}, state, editNoteFromSection(action.note, state.currentStave, state.staveGroup));
  case SheetActions.NOTE_CLICKED_CONTROL:
   return Object.assign( {}, state, { clickedNotes: handleNoteClick(action.noteID, state.clickedNotes )});
  case SheetActions.GROUP_AS_BAR:
  console.log("BAR");
   return Object.assign( {}, state, markAsBarNote(state.clickedNotes, state.currentStave, state.staveGroup));
  case SheetActions.ADD_ARTICULATION:
   return Object.assign( {}, state, addArticulation(action.symbol, state.clickedNotes, state.currentStave, state.staveGroup));
  default:
   return state;
 }
}

export default sheetReducer;
