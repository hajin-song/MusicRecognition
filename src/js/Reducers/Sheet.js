/**
* Sheet.js
* Sheet Reducer
* Author: Ha Jin Song
* Last Modified: 25-May-2017
*/
import SheetActions from 'omrActions/Sheet';

/**
* handleNoteClick - Handles Note Click on the Stave view
* @param {Number} noteID - ID of the note being clicked
* @param {Array.<Number>} list - List of note IDs previously selected
* @return {Array.<Number>} - List of note IDs currently selected
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
 * handleStaveClick - Handles Stave Click on the main sheet view
 * @param {Object} stave - The stave being clicked
 * @param {Array.<Object>} list - List of the Stave Groups previously selected
 * @return {Array.<Object>} - List of the Stave Groups currently selected
 * @description Adds the stave to the list if it does not exists already
 */
function handleStaveClick(stave, list){
 let result = $.arrayCopy(list);
 let staveIndex = $.objectIndex(stave, list);
 if(staveIndex == -1){ result.push(stave); }
 else{ result.splice(staveIndex , 1); }
 return result;
}

/**
* handleStaveSectionMerge - Handle section merging
* @param {Array.<Object>} staveList - Selected Stave Sections
* @param {Array.<Object>} currentStaveGroup - Currently set Stave Groups
* @return {Array} - Merged Stave list and updated currentStaveGroup
*/
function handleStaveSectionMerge(staveList, currentStaveGroup){
 let y0 = staveList[0].stave.y0;
 let y1 = staveList[1].stave.y1;

 // Check if it is a valid merging action
 for(var staveIndex = 0 ; staveIndex < staveList.length ; staveIndex++){
  if(y0 != staveList[staveIndex].stave.y0 || y1 != staveList[staveIndex].stave.y1){
   console.log('Cannot merge section that does not have belong in same stave row');
   return currentStaveGroup;
  }
 }

 // Get the stave containing the sections being merged
 let targetStave = currentStaveGroup.filter( (stave) => {
  return stave.y0 == y0 && stave.y1 == y1;
 })[0];

 // Store the index of the stave in order to update it later
 let targetIndex = $.objectIndex(targetStave, currentStaveGroup);

 // find the first and last x value of the new section
 var mergers = staveList.reduce( (cur, current) => {
  return cur.concat(current.section)
 }, []).sort((a,b) => { return a - b; });

 // Create new section - collect all x values that lies within the new section
 let newSections = targetStave.sections.filter( (section) => {
  return section <= mergers[0] || mergers[mergers.length - 1] <= section
 });

 // Create nwe section and assign to the stave
 let newStave = Object.assign( {}, targetStave, { sections: newSections });
 var newStaveGroup = $.arrayCopy(currentStaveGroup);
 newStaveGroup[targetIndex] = newStave;

 return [newStaveGroup, newStave];
}

/**
 * createNote - Create a new object
 *
 * @param  {String} pitchID    DOM Id
 * @param  {String} octaveID   Dom Id
 * @param  {String} durationID Dom Id
 * @param  {Object} note       Note object - empty if new
 * @return {Object}              New note object
 */
function createNote(pitchID, octaveID, durationID, note){
 let pitch = $('#' + pitchID).val();
 let octave = $('#' + octaveID).val();
 let duration = $('#' + durationID).val();

 var newNote;

 if(pitch === 'r'){
  newNote = { 'pitch': 'b', 'octave': '4', 'duration': duration, 'type': 'r' };
 }else{
  newNote = {'pitch': pitch, 'octave': octave, 'duration': duration, 'type': 'n' };
 }

 if(note.bar == -1){ newNote['bar'] = -1; }
 if(note.slur == -1){ newNote['slur'] = -1; }
 return Object.assign( {}, note, newNote);
}

/**
* addNoteToSection = Adds a new note to the section
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

 let targetNote = newStave.stave.notes[noteID];
 // deleted note was start or end of bar
 if(targetNote.bar == 1)
 {
  let nextNote = newStave.stave.notes[noteID + 1];
  if (typeof nextNote === "undefined" || nextNote.bar == 2) { nextNote.bar = -1; }
  else { nextNote.bar = 1; }
 }
 // deleted note was end of bar
 else if(targetNote.bar == 2)
 {
  let prevNote = newStave.stave.notes[noteID - 1];
  if (typeof prevNote === "undefined" || prevNote.bar == 1) { prevNote.bar = -1; }
  else { prevNote.bar = 2; }
 }

 if(targetNote.slur == 1)
 {
  let nextNote = newStave.stave.notes[noteID + 1];
  if (typeof nextNote === "undefined" || nextNote.slur == 2) { nextNote.slur = -1; }
  else { nextNote.slur = 1; }
 }
 // deleted note was end of bar
 else if(targetNote.bar == 2)
 {
  let prevNote = newStave.stave.notes[noteID - 1];
  if (typeof prevNote === "undefined" || prevNote.slur == 1) { prevNote.slur = -1; }
  else { prevNote.slur = 2; }
 }

 // remove target note and set new IDs to remaining notes
 newStave.stave.notes.splice(noteID, 1);
 newStave.stave.notes.map( (note, index) => { note.id = index; });
 newStaveGroup[staveIndex] = newStave.stave;
 return { staveGroup: newStaveGroup, currentStave: newStave };
}


/**
 * addArticulation - add articulation symbol to note
 *
 * @param  {String}         symbol       description
 * @param  {Array.number}   clickedNotes IDs of the selected notes
 * @param  {Object}         currentStave Current Stave selected
 * @param  {Array.<Object>} staveGroup   Currently set Stave Groups
 * @return {Object} new stave group and current stave Object state
 */
function addArticulation(symbol, clickedNotes, currentStave, staveGroup){
 let staveIndex = $.objectIndex(currentStave.stave, staveGroup);
 var newStaveGroup = $.arrayCopy(staveGroup);

 var newStave = $.objectCopy(currentStave);
 clickedNotes.map( (note) => {
  let symbolIndex = newStave.stave.notes[note].articulations.indexOf(symbol);

  // if articulation is already there, remove it
  if(symbolIndex == -1){
   newStave.stave.notes[note].articulations.push(symbol);
  }else{
   newStave.stave.notes[note].articulations.splice(symbolIndex, 1);
  }
 });
 return { staveGroup: newStaveGroup, currentStave: newStave };
}

/**
 * markAsBarNote - set currently selected notes ar bar group
 *
 * @param  {Array.number} clickedNotes IDs of the selected notes
 * @param {Object} currentStave - Current Stave selected
 * @param {Array.<Object>} staveGroup - Currently set Stave Groups
 * @return {Object} new stave group and current stave Object state
 */
function markAsBarNote(clickedNotes, currentStave, staveGroup){
 let first = clickedNotes[0];
 let last = clickedNotes[clickedNotes.length - 1];

 let staveIndex = $.objectIndex(currentStave.stave, staveGroup);
 var newStaveGroup = $.arrayCopy(staveGroup);
 var newStave = $.objectCopy(currentStave);

 // Check if it is valid bar grouping
 if(first != last){
  for(var i = first ; i <= last ; i++){
   let note = newStave.stave.notes[i]
   if(note.duration == 'w' || note.duration == 'h' || note.duration == 'q'){
    alert("Cannot group non-quaver as bar note!");
    return { staveGroup: staveGroup, currentStave: currentStave };
   }else if(note.bar >= 0){
    alert("Cannot allocate one note to multiple bar group!!");
    return { staveGroup: staveGroup, currentStave: currentStave };
   }else{
    note.bar = 0;
   }
  }
 }else{
  alert("Cannot group single note at bar note!");
  return { staveGroup: staveGroup, currentStave: currentStave };
 }

 newStaveGroup[staveIndex] = newStave.stave;
 // flag start and end
 newStave.stave.notes[first].bar = 1;
 newStave.stave.notes[last].bar = 2;
 return { staveGroup: newStaveGroup, currentStave: newStave, clickedNotes: [] };
}


function markAsSlur(clickedNotes, currentStave, staveGroup){
 let first = clickedNotes[0];
 let last = clickedNotes[clickedNotes.length - 1];

 let staveIndex = $.objectIndex(currentStave.stave, staveGroup);
 var newStaveGroup = $.arrayCopy(staveGroup);
 var newStave = $.objectCopy(currentStave);

 // Check if it is valid bar grouping
 if(first != last){
  for(var i = first ; i <= last ; i++){
   let note = newStave.stave.notes[i]
   if(note.slur >= 0){
    alert("Cannot allocate one note to multiple slur group!!");
    return { staveGroup: staveGroup, currentStave: currentStave };
   }else{
    note.slur = 0;
   }
  }
 }else{
  alert("Cannot group single note as slur!");
  return { staveGroup: staveGroup, currentStave: currentStave };
 }

 newStaveGroup[staveIndex] = newStave.stave;
 // flag start and end
 newStave.stave.notes[first].slur = 1;
 newStave.stave.notes[last].slur = 2;
 return { staveGroup: newStaveGroup, currentStave: newStave, clickedNotes: [] };
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
   return Object.assign( {}, state, { staveGroup: result[0], clickedStaves: [] });
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
   return Object.assign( {}, state, markAsBarNote(state.clickedNotes, state.currentStave, state.staveGroup));
  case SheetActions.GROUP_AS_SLUR:
   return Object.assign( {}, state, markAsSlur(state.clickedNotes, state.currentStave, state.staveGroup));
  case SheetActions.ADD_ARTICULATION:
   return Object.assign( {}, state, addArticulation(action.symbol, state.clickedNotes, state.currentStave, state.staveGroup));
  default:
   return state;
 }
}

export default sheetReducer;
