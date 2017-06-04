/**
* Note.js
* Author: Ha Jin Song
* Last Modified: 5-June-2017
* @description Helpers for manipulating Note objects
*/

/**
 * sortNotes - sort note in order of the value
 *
 * @param  {Array.Object} noteList list of notes
 */
function sortNotes(noteList){
 return noteList.sort( (a, b) => {
  if(a.id == b.id){ return a.x - b.x; }
  return a.id - b.id;
 })
}

/**
 * convertToNote - Convert python result to note object
 *
 * @param  {Object} pyNote python note object in JSON
 * @return {Object}        Note object used by app to generate VexFlow notes
 */
function convertToNote(pyNote, prev_prop){
 let pitches = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
 let note_types = ['q', 'q', 'h', 'w', 'q', 'q', 'h', '8', '16', '32'];
 var newNote;
 // note_type, tail_direction, tail_type
 var note_type;
 var is_bar = -1;
 var is_rest = pyNote.note_type > 4;

 // Get tail type
 if(pyNote.tail_type == 0){
  note_type = note_types[pyNote.note_type];
 }else if (pyNote.tail_type == 1){
  note_type = '8';
 }else if(pyNote.tail_type == 2){
  note_type = '16';
 }else{
  note_type = '32';
 }

 // Check if note should be part of bar group
 if(pyNote.is_bar == 1){
  if(note_type == 'q' || note_type == 'w' || note_type == 'h'){ note_type = '8'; }
  if(prev_prop.bar){ is_bar = 0; }
  else{ is_bar = 1; }
 }else if(pyNote.is_bar == 2){
  if(note_type == 'q' || note_type == 'w' || note_type == 'h'){ note_type = '8'; }
  is_bar = 2;
 }else if(prev_prop.bar){
  if(note_type == 'q' || note_type == 'w' || note_type == 'h'){ note_type = '8'; }
  is_bar = 2;
 }

 newNote = {
  'accidental': '',
  'pitch': 'c',
  'octave': '4',
  'duration': note_type,
  'bar': is_bar,
  'slur': -1,
  'x': pyNote.x,
  'articulations': [],
 };


 if(typeof prev_prop.accidental !== 'undefined'){
  newNote.accidental = prev_prop.accidental;
 }
 // If it is rest, set the type to rest
 // Otherwise, set the pitch and return the ntoe
 if(is_rest){
  newNote.type = 'r';
  return newNote;
 }else{
  return transposeNote(newNote, pyNote.pitch);
 }
}

/**
 * transposeNote - transpose a note to different pitch
 *
 * @param  {Object} note            Note object being transposed
 * @param  {Number} transpose_value transpose amount
 * @return {Object}                 New note with transposed pitch and accidental
 */
function transposeNote(note, transpose_value){
 let pitches = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
 // true if transpose direction is upward

 let direction = transpose_value > 0;

 // tranpose by half = semi tone
 let acc_value = transpose_value % 1;
 // Get new accidental
 if(acc_value != 0){
  if(note.accidental == '#' || note.accidental == 'b'){
   if(direction){
    if(note.accidental == '#'){
     note.accidental = 'b';
     transpose_value = Math.round(transpose_value);
    }else {
     note.accidental = '';
     Math.abs(transpose_value) >= 1 ? transpose_value -= 1 : transpose_value = 0;
    }
   }else{
    if(note.accidental == '#'){
     note.accidental = '';
     Math.abs(transpose_value) >= 1 ? transpose_value += 1 : transpose_value = 0;
    }else {
     note.accidental = '#';
     transpose_value = Math.round(transpose_value) - 1;
    }
   }
  }else if(note.accidental == ''){
   Math.abs(transpose_value) >= 1 ? transpose_value -= 1 : transpose_value = 0;
   direction ? note.accidental = '#' : note.accidental = 'b';
  }
 }

 // Get new pitch value
 let pitch_value = Math.floor(transpose_value / 1);
 var new_pitch = pitches.indexOf(note.pitch) + pitch_value;

 var octave_change = 0;
 // check the change in octave
 while(new_pitch < 0 || new_pitch > pitches.length - 1){
  if(direction){
   new_pitch -= pitches.length;
   octave_change += 1;
  }else{
   new_pitch += pitches.length;
   octave_change -= 1;
  }
 }
 note.pitch = pitches[new_pitch];
 note.octave = (parseInt(note.octave) + octave_change).toString();
 return note;
}


/**
 * groupNotes - Collect the beam markers in the notes
 *
 * @param  {Array.Object} notes      List of notes
 * @param  {Number}       legalIndex Last note that got written up in the vex stave
 * @param  {String} annotation annotation type being ungrouped
 * @return {Array.Number}            List of note indexs
 */
function groupNotes(notes, legal_index, annotation){
 var grouping = [];
 for(let note_index = 0 ; note_index < legal_index ; note_index++){
  var note = notes[note_index];
  if(note[annotation] > 0){
   grouping.push(note_index);
  }
 }
 return grouping;
}

/**
 * ungroupNotes - Remove beam group that a note is part of
 *
 * @param  {Array.Object} notes      List of notes
 * @param  {Object} target_note targe tnote object
 * @param  {String} annotation annotation type being ungrouped
 */
function ungroupNotes(notes, target_note, annotation){
 // find the first and last note of the beam
 var first;
 var last;
 var current = $.objectIndex(target_note, notes);
 var current_note = target_note;

 while(current_note[annotation] != 2 ){
  if(current == notes.length - 1){
   break;
  }
  current += 1;
  current_note = notes[current];
 }
 last = current;
 while(current_note[annotation] != 1 ){
  if(current == 0){
   break;
  }
  current -= 1;
  current_note = notes[current];
 }
 first = current;

 for(let note_index = first ; note_index <= last ; note_index++){
  notes[note_index][annotation] = -1;
 }
}


export {
 sortNotes,
 convertToNote,
 transposeNote,
 groupNotes,
 ungroupNotes,
};
