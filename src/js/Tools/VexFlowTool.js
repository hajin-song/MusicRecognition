/**
 * VexFlowCanvas
 * @author - Ha Jin Song
 * Last Modified - 25-May-2017
 * @description - Helper functions for manipulating Vex Flow objects
 */

import Vex from 'vexflow';
const VF = Vex.Flow;

function sortNotes(noteList){
 return noteList.sort( (a, b) => {
  if(a.id == b.id){ return a.x - b.x; }
  return a.id - b.id;
 })
}

/**
 * getNoteDuration - Get note's duration in numeric value
 *
 * @param  {Object} note note Object
 * @return {Number}      Duration in numeric
 */
function getNoteDuration(note){
 switch(note.duration){
  case 'w': return 4;
  case 'h': return 2;
  case 'q': return 1;
  case '8': return 1/2;
  case '16': return 1/4;
  case '32': return 1/8;
 }
}

/**
 * fillRest - Fill remaining tick counts with appropriate rest
 *
 * @param  {Number} remainingTicks Number of ticks remaining
 * @return {Array.String}              List of rests to draw in
 */
function fillRest(remainingTicks){
 var rests = [];
 var t = remainingTicks;

 // Largest denomination first
 let oneCount = Math.floor(remainingTicks / 1);
 remainingTicks = remainingTicks % 1

 let halfCount = Math.floor(remainingTicks / 0.5);
 remainingTicks = remainingTicks % 0.5;

 let quarterCount = Math.floor(remainingTicks / 0.25);
 remainingTicks = remainingTicks % 0.25;

 let eighthCount = Math.floor(remainingTicks / 0.125);
 remainingTicks = remainingTicks % 0.125;

 // But draw the smallest one first
 for(var i = 0 ; i < eighthCount ; i++){ rests.push('32r'); }
 for(var i = 0 ; i < quarterCount ; i++){ rests.push('16r'); }
 for(var i = 0 ; i < halfCount ; i++){ rests.push('8r'); }
 for(var i = 0 ; i < oneCount ; i++){ rests.push('qr'); }

 return rests;
}


/**
 * generateNotes - Generate Vex Flow notes to draw in - only up to tick counts
 *
 * @param  {Array.Object} notes Notes to put in
 * @param  {Number} ticks Ticks available
 * @return {Array}       [Last Legal Note Index, Remaining Ticks, List of Vex Flow notes]
 */
function generateNotes(notes, ticks){
 var vexNotes = [];
 var noteIndex = 0;
 for(noteIndex ; noteIndex < notes.length ; noteIndex++){
  let curNote = notes[noteIndex];
  let noteDuration =  getNoteDuration(curNote);
  if (ticks - noteDuration >= 0){
   __markAsLegal(noteIndex);
   if(curNote.type === 'r'){
    vexNotes.push(new VF.StaveNote({
     keys:['b/4'],
     duration: curNote.duration + 'r'
    }));
   }else{
    var note = new VF.StaveNote({
     keys:[curNote.pitch + "/" + curNote.octave],
     duration: curNote.duration,
     auto_stem: true
    });
    if(curNote.accidental != ''){
     note.addAccidental(0, new VF.Accidental(curNote.accidental));
    }
    curNote.articulations.map( (articulation, index) => {
     note = note.addArticulation(0,
      new VF.Articulation(articulation).setPosition(3));
    });
    vexNotes.push(note);
   }
   ticks -= noteDuration;
  }else{
   break;
  }
 }
 return [noteIndex, ticks, vexNotes];
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
/**
 * groupBeams - Collect the beam markers in the notes
 *
 * @param  {Array.Object} notes      List of notes
 * @param  {Number}       legalIndex Last note that got written up in the vex stave
 * @return {Array.Number}            List of note indexs
 */
function groupBeams(notes, legalIndex){
 var beamGroups = [];
 var noteIndex = 0;
 for(noteIndex ; noteIndex < legalIndex ; noteIndex++){
  var note = notes[noteIndex];
  if(note.bar > 0){
   beamGroups.push(noteIndex);
  }
 }
 return beamGroups;
}

/**
 * groupSlurss - Collect the slur markers in the notes
 *
 * @param  {Array.Object} notes      List of notes
 * @param  {Number}       legalIndex Last note that got written up in the vex stave
 * @return {Array.Number}            List of note indexs
 */
function groupSlurs(notes, legalIndex){
 var slurGroups = [];
 var noteIndex = 0;
 for(noteIndex ; noteIndex < legalIndex ; noteIndex++){
  var note = notes[noteIndex];
  if(note.slur > 0){
   slurGroups.push(noteIndex);
  }
 }
 return slurGroups;
}

function drawStaves(context, x, y, width, bar_annotations){
 var stave = new VF.Stave(x, y, width);
 //stave.addTimeSignature("4/4");
 if(bar_annotations.repeatStart){
  stave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
 }
 if(bar_annotations.repeatEnd){
  stave.setEndBarType(VF.Barline.type.REPEAT_END);
 }
 stave.setContext(context).draw();
 return stave;
}

/**
 * markRemainders - Mark notes outside of ticks as illegal note
 *
 * @param  {Array.Object} notes      List of notes
 * @param  {Number}       legalIndex Last note that got written up in the vex stave
 */
function markRemainders(notes, legalIndex){

 for(legalIndex ; legalIndex < notes.length ; legalIndex++){
  __markAsIllegal(notes[0].id + legalIndex);
 }
}


function __markAsLegal(noteIndex){
 $('#note-'+noteIndex).removeClass('note--illegal');
}

function __markAsIllegal(noteIndex){
 $('#note-'+noteIndex).addClass('note--illegal');
}




export {
 getNoteDuration,
 fillRest,
 generateNotes,
 markRemainders,
 groupBeams,
 groupSlurs,
 sortNotes,
 transposeNote,
 drawStaves,
};
