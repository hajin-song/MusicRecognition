/**
* Sheet.js
* Sheet Reducer
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/

import SheetActions from 'omrActions/Sheet';
import { sortNotes, transposeNote } from 'omrTools/VexFlowTool';

/**
 * createNote - Create a new object
 *
 * @param  {String} pitchID    DOM Id
 * @param  {String} octaveID   Dom Id
 * @param  {String} durationID Dom Id
 * @param  {String} accidentalID Dom Id
 * @param  {Object} note       Note object - empty if new
 * @return {Object}              New note object
 */
function createNote(pitchID, octaveID, durationID, accidentalID, note){
 let pitch = $('#' + pitchID).val();
 let octave = $('#' + octaveID).val();
 let duration = $('#' + durationID).val();
 let accidental = $('#' + accidentalID).val();

 var newNote;

 if(pitch === 'r'){
  newNote = {
   'accidental': '',
   'pitch': 'b',
   'octave': '4',
   'duration': duration,
   'type': 'r'
  };
 }else{
  newNote = {
   'accidental': accidental,
   'pitch': pitch,
   'octave': octave,
   'duration': duration,
   'type': 'n'
  };
 }

 console.log('xx', newNote);

 if(note.bar == -1){ newNote['bar'] = -1; }
 if(note.slur == -1){ newNote['slur'] = -1; }
 return Object.assign( {}, note, newNote);
}

/**
* handleNoteClick - Handles Note Click on the Stave view
* @param {Number} note_id - ID of the note being clicked
* @param {Array.<Number>} list - List of note IDs previously selected
* @return {Array.<Number>} - List of note IDs currently selected
* @description Adds the note ID to the list if it does not exists already
*/
function handleNoteClick(note_id, list){
 let result = $.arrayCopy(list);
 let noteIndex = list.indexOf(note_id);
 if(noteIndex == -1 ) { result.push(note_id); }
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
 let stave_index = $.objectIndex(stave, list);
 if(stave_index == -1){ result.push(stave); }
 else{ result.splice(stave_index , 1); }
 return result;
}

/**
* handleStaveSectionMerge - Handle section merging
* @param {Array.<Object>} stave_list - Selected Stave Sections
* @param {Array.<Object>} current_stave_group - Currently set Stave Groups
* @return {Array} - Merged Stave list and updated current_stave_group
*/
function handleStaveSectionMerge(stave_list, current_stave_group){
 let y0 = stave_list[0].stave.y0;
 let y1 = stave_list[1].stave.y1;

 // Check if it is a valid merging action
 for(var stave_index = 0 ; stave_index < stave_list.length ; stave_index++){
  if(y0 != stave_list[stave_index].stave.y0 || y1 != stave_list[stave_index].stave.y1){
   console.log('Cannot merge section that does not have belong in same stave row');
   return current_stave_group;
  }
 }

 // Get the stave containing the sections being merged
 let target_stave = current_stave_group.filter( (stave) => {
  return stave.y0 == y0 && stave.y1 == y1;
 })[0];

 // Store the index of the stave in order to update it later
 let target_index = $.objectIndex(target_stave, current_stave_group);

 // find the first and last x value of the new section
 var mergers = stave_list.reduce( (cur, current) => {
  return cur.concat(current.section);
 }, []).sort((a,b) => { return a - b; });

 // Create new section - collect all x values that lies within the new section
 let new_sections = target_stave.sections.filter( (section) => {
  return section <= mergers[0] || mergers[mergers.length - 1] <= section
 });

 // Create nwe section and assign to the stave
 let new_stave = Object.assign( {}, target_stave, { sections: new_sections });
 var new_stave_group = $.arrayCopy(current_stave_group);
 new_stave_group[target_index] = new_stave;

 return [new_stave_group, new_stave];
}

/**
* addNoteToSection = Adds a new note to the section
* @param {Object} current_stave - Current Stave Section
* @param {Array.<Object>} stave_group - Currently set Stave Groups
* @return {Object} new stave group and current stave Object state
*/
function addNoteToSection(current_stave, stave_group){
 // Make Deep copy of objects and arrays - Redux reducers need to be Pure
 let stave_index = $.objectIndex(current_stave.stave, stave_group);
 var new_stave_group = $.arrayCopy(stave_group);
 var notes = $.arrayCopy(current_stave.stave.notes);

 var newNote = createNote('note-pitch', 'note-octave',
 'note-duration', 'note-accidental',
 { 'x': current_stave.section[1], 'id': notes.length, 'articulations': []});
 notes.push(newNote);

 var new_stave = $.objectCopy(current_stave);
 new_stave.stave.notes = sortNotes(notes);
 new_stave_group[stave_index] = new_stave.stave;

 return { stave_group: new_stave_group, current_stave: new_stave };
}

/**
* Remove a note from section
* @param {Object} note - new note object
* @param {Object} current_stave - Current Stave selected
* @param {Array.<Object>} stave_group - Currently set Stave Groups
* @return {Object} new stave group and current stave Object state
*/
function editNoteFromSection(note_id, current_stave, stave_group){
 let stave_index = $.objectIndex(current_stave.stave, stave_group);
 var new_stave_group = $.arrayCopy(stave_group);
 var new_stave = $.objectCopy(current_stave);

 new_stave.stave.notes = sortNotes(new_stave.stave.notes);
 var newNote = createNote('note-pitch-' + note_id, 'note-octave-' + note_id,
 'note-duration-'+note_id,
 'note-accidental-'+note_id, new_stave.stave.notes[note_id]);

 new_stave.stave.notes[note_id] = newNote;
 new_stave_group[stave_index] = new_stave.stave;
 return { stave_group: new_stave_group, current_stave: new_stave };
}

/**
* Remove a note from section
* @param {Number} note_id - ID of the note being removed
* @param {Object} current_stave - Current Stave selected
* @param {Array.<Object>} stave_group - Currently set Stave Groups
* @return {Object} new stave group and current stave Object state
*/
function removeNoteFromSection(note_id, current_stave, stave_group){
 let stave_index = $.objectIndex(current_stave.stave, stave_group);
 var new_stave_group = $.arrayCopy(stave_group);
 var new_stave = $.objectCopy(current_stave);

 let target_note = new_stave.stave.notes[note_id];
 // deleted note was start or end of bar
 if(target_note.bar == 1)
 {
  let next_note = new_stave.stave.notes[note_id + 1];
  if (typeof next_note === "undefined" || next_note.bar == 2) { next_note.bar = -1; }
  else { next_note.bar = 1; }
 }
 // deleted note was end of bar
 else if(target_note.bar == 2)
 {
  let prev_note = new_stave.stave.notes[note_id - 1];
  if (typeof prev_note === "undefined" || prev_note.bar == 1) { prev_note.bar = -1; }
  else { prev_note.bar = 2; }
 }

 // do the same for slut
 if(target_note.slur == 1)
 {
  let next_note = new_stave.stave.notes[note_id + 1];
  if (typeof next_note === "undefined" || next_note.slur == 2) { next_note.slur = -1; }
  else { next_note.slur = 1; }
 }
 // deleted note was end of bar
 else if(target_note.bar == 2)
 {
  let prev_note = new_stave.stave.notes[note_id - 1];
  if (typeof prev_note === "undefined" || prev_note.slur == 1) { prev_note.slur = -1; }
  else { prev_note.slur = 2; }
 }

 // remove target note and set new IDs to remaining notes
 new_stave.stave.notes = sortNotes(new_stave.stave.notes);
 new_stave.stave.notes.splice(note_id, 1);
 new_stave.stave.notes.map( (note, index) => { note.id = index; });
 new_stave_group[stave_index] = new_stave.stave;
 return { stave_group: new_stave_group, current_stave: new_stave };
}

/**
 * addArticulation - add articulation symbol to note
 *
 * @param  {String}         symbol       description
 * @param  {Array.number}   clicked_notes IDs of the selected notes
 * @param  {Object}         current_stave Current Stave selected
 * @param  {Array.<Object>} stave_group   Currently set Stave Groups
 * @return {Object} new stave group and current stave Object state
 */
function addArticulation(symbol, clicked_notes, current_stave, stave_group){
 let stave_index = $.objectIndex(current_stave.stave, stave_group);
 var new_stave_group = $.arrayCopy(stave_group);

 var new_stave = $.objectCopy(current_stave);
 clicked_notes.map( (note) => {
  let symbolIndex = new_stave.stave.notes[note].articulations.indexOf(symbol);

  // if articulation is already there, remove it
  if(symbolIndex == -1){
   new_stave.stave.notes[note].articulations.push(symbol);
  }else{
   new_stave.stave.notes[note].articulations.splice(symbolIndex, 1);
  }
 });
 return { stave_group: new_stave_group, current_stave: new_stave };
}

/**
 * markAsBarNote - set currently selected notes as bar group
 *
 * @param  {Array.number} clicked_notes IDs of the selected notes
 * @param {Object} current_stave - Current Stave selected
 * @param {Array.<Object>} stave_group - Currently set Stave Groups
 * @return {Object} new stave group and current stave Object state
 */
function markAsBarNote(clicked_notes, current_stave, stave_group){
 let first = clicked_notes[0];
 let last = clicked_notes[clicked_notes.length - 1];

 let stave_index = $.objectIndex(current_stave.stave, stave_group);
 var new_stave_group = $.arrayCopy(stave_group);
 var new_stave = $.objectCopy(current_stave);

 // Check if it is valid bar grouping
 if(first != last){
  for(var i = first ; i <= last ; i++){
   let note = new_stave.stave.notes[i]
   if(note.duration == 'w' || note.duration == 'h' || note.duration == 'q'){
    alert("Cannot group non-quaver as bar note!");
    return { stave_group: stave_group, current_stave: current_stave };
   }else if(note.bar >= 0){
    alert("Cannot allocate one note to multiple bar group!!");
    return { stave_group: stave_group, current_stave: current_stave };
   }else{
    note.bar = 0;
   }
  }
 }else{
  alert("Cannot group single note at bar note!");
  return { stave_group: stave_group, current_stave: current_stave };
 }

 new_stave_group[stave_index] = new_stave.stave;
 // flag start and end
 new_stave.stave.notes[first].bar = 1;
 new_stave.stave.notes[last].bar = 2;
 return { stave_group: new_stave_group, current_stave: new_stave, clicked_notes: [] };
}

/**
 * markAsSlur - set currently selected notes as slur group
 *
 * @param  {Array.number} clicked_notes IDs of the selected notes
 * @param {Object} current_stave - Current Stave selected
 * @param {Array.<Object>} stave_group - Currently set Stave Groups
 * @return {Object} new stave group and current stave Object state
 */
function markAsSlur(clicked_notes, current_stave, stave_group){
 let first = clicked_notes[0];
 let last = clicked_notes[clicked_notes.length - 1];

 let stave_index = $.objectIndex(current_stave.stave, stave_group);
 var new_stave_group = $.arrayCopy(stave_group);
 var new_stave = $.objectCopy(current_stave);

 // Check if it is valid bar grouping
 if(first != last){
  for(var i = first ; i <= last ; i++){
   let note = new_stave.stave.notes[i]
   if(note.slur >= 0){
    alert("Cannot allocate one note to multiple slur group!!");
    return { stave_group: stave_group, current_stave: current_stave };
   }else{
    note.slur = 0;
   }
  }
 }else{
  alert("Cannot group single note as slur!");
  return { stave_group: stave_group, current_stave: current_stave };
 }

 new_stave_group[stave_index] = new_stave.stave;
 // flag start and end
 new_stave.stave.notes[first].slur = 1;
 new_stave.stave.notes[last].slur = 2;
 return { stave_group: new_stave_group, current_stave: new_stave, clicked_notes: [] };
}

function transpose(stave_group, toneValue){
 var new_stave_group = $.arrayCopy(stave_group);
 new_stave_group.map( (stave_group) => {
  stave_group.notes.map( (note, index) => {
   stave_group.notes[index] = transposeNote(note, toneValue);
  });
 });
 return new_stave_group;
}

function setBarAnnotation(current_stave, stave_group, annotation){
 let stave_index = $.objectIndex(current_stave.stave, stave_group);
 var new_stave_group = $.arrayCopy(stave_group);
 var new_stave = $.objectCopy(current_stave);

 if (typeof new_stave.stave.barAnnotation[current_stave.section[0]][annotation] === "undefined"){
  new_stave.stave.barAnnotation[current_stave.section[0]][annotation] = true;
 }else{
  delete new_stave.stave.barAnnotation[current_stave.section[0]][annotation]
 }
 new_stave_group[stave_index] = new_stave.stave;
 return { stave_group: new_stave_group, current_stave: new_stave };
}

function processNote(stave_group){
 let pitches = ['e', 'f', 'g', 'a', 'b', 'c', 'd']
 for (var stave_index = 0; stave_index < stave_group.length; stave_index++) {
  var stave = stave_group[stave_index];
  stave['barAnnotation'] = {};
  for (var section_index = 0 ; section_index < stave.sections.length - 1; section_index++){
   stave['barAnnotation'][stave.sections[section_index]] = {};
  }
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
 console.log(stave_group);
 return stave_group;
}

const initial_state = {
 clicked_staves: [],
 clicked_notes: [],
 stave_group: [],
 current_stave: { sections: [], stave: { notes: [] } },
};

const sheetReducer = (state = initial_state, action) => {
 switch(action.type) {
  case SheetActions.GET_STAVE_GROUPS:
   return Object.assign( {}, state, { stave_group: processNote(action.stave_group) });
  case SheetActions.STAVE_CLICKED_CONTROL:
   return Object.assign( {}, state, { clicked_staves: handleStaveClick(action.area, state.clicked_staves) });
  case SheetActions.MERGE_STAVE_SECTIONS:
   var result = handleStaveSectionMerge(state.clicked_staves, state.stave_group);
   let data = { 'data': JSON.stringify(result[1]), 'target': 'stave.pkl' };
   $.post('/update', data, (res)=>{ });
   return Object.assign( {}, state, { stave_group: result[0], clicked_staves: [] });
  case SheetActions.STAVE_CLICKED:
   return Object.assign( {}, state, { current_stave: action.area });
  case SheetActions.ADD_NOTE:
   return Object.assign( {}, state, addNoteToSection(state.current_stave, state.stave_group));
  case SheetActions.REMOVE_NOTE:
   return Object.assign( {}, state, removeNoteFromSection(action.note_id, state.current_stave, state.stave_group));
  case SheetActions.EDIT_NOTE:
   return Object.assign( {}, state, editNoteFromSection(action.note, state.current_stave, state.stave_group));
  case SheetActions.NOTE_CLICKED_CONTROL:
   return Object.assign( {}, state, { clicked_notes: handleNoteClick(action.note_id, state.clicked_notes )});
  case SheetActions.GROUP_AS_BAR:
   return Object.assign( {}, state, markAsBarNote(state.clicked_notes, state.current_stave, state.stave_group));
  case SheetActions.GROUP_AS_SLUR:
   return Object.assign( {}, state, markAsSlur(state.clicked_notes, state.current_stave, state.stave_group));
  case SheetActions.ADD_ARTICULATION:
   return Object.assign( {}, state, addArticulation(action.symbol, state.clicked_notes, state.current_stave, state.stave_group));
  case SheetActions.TRANSPOSE:
   return Object.assign( {}, state, { stave_group: transpose(state.stave_group, action.tone)});
  case SheetActions.SET_REPEAT_START:
   return Object.assign( {}, state, setBarAnnotation(state.current_stave, state.stave_group, 'repeatStart'));
  case SheetActions.SET_REPEAT_END:
   return Object.assign( {}, state, setBarAnnotation(state.current_stave, state.stave_group, 'repeatEnd'));
  default:
   return state;
 }
}

export default sheetReducer;
