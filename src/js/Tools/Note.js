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
 * @return {type}        description
 */
function convertToNote(pyNote, prev_prop){
 let pitches = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
 var newNote;
 // note_type, tail_direction, tail_type
 var note_type;
 var is_bar = -1;
 if(pyNote.tail_type == 0){
  note_type = 'q';
 }else if (pyNote.tail_type == 1){
  console.log(pyNote.tail_type, "zzzz");
  note_type = '8';
 }else {
  console.log("DOCKO");
  note_type = '16';
 }

 if(pyNote.is_bar == 'True'){
  if(note_type == 'q'){
   note_type = '8';
  }
  if(prev_prop.bar){
   is_bar = 0;
  }else{
   is_bar = 1;
  }
 }else if(prev_prop.bar){
  if(note_type == 'q'){
   note_type = '8';
  }
  is_bar = 2;
 }
 console.log(pyNote);
 console.log(is_bar);
 newNote = {
  'accidental': '',
  'pitch': 'b',
  'octave': '4',
  'duration': note_type,
  'bar': is_bar,
  'slur': -1,
  'x': pyNote.x,
  'articulations': [],
 };
 return newNote;
}

/**
 * transposeNote - transpose a note to different pitch
 *
 * @param  {type} note            description
 * @param  {type} transpose_value description
 * @return {type}                 description
 */
function transposeNote(note, transpose_value){
 let pitches = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
 // true if transpose direction is upward

 let direction = transpose_value > 0;
 let acc_value = transpose_value % 1;
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

 let pitch_value = Math.floor(transpose_value / 1);
 var new_pitch = pitches.indexOf(note.pitch);
 new_pitch += pitch_value;

 var octave_change = 0;

 while(new_pitch < 0 || new_pitch > pitches.length - 1){
  if(direction){
   new_pitch -= pitches.length;
   octave_change += 1;
  }else{
   new_pitch += pitches.length;
   octave_change -= 1;
  }
 }
 console.log(new_pitch, octave_change, direction);
 note.pitch = pitches[new_pitch];
 note.octave = (parseInt(note.octave) + octave_change).toString();
 return note;
}

export {
 sortNotes,
 convertToNote,
 transposeNote,
};
