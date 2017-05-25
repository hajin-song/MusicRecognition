/**
 * VexFlowCanvasTool
 * @author - Ha Jin Song
 * Last Modified - 25-May-2017
 * @description - Helper functions for manipulating Vex Flow objects
 */

import Vex from 'vexflow';
const VF = Vex.Flow;

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
   console.log(curNote);
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


/**
 * markRemainders - Mark notes outside of ticks as illegal note
 *
 * @param  {Array.Object} notes      List of notes
 * @param  {Number}       legalIndex Last note that got written up in the vex stave
 */
function markRemainders(notes, legalIndex){
 for(legalIndex ; legalIndex < notes.length ; legalIndex++){
  __markAsIllegal(legalIndex);
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
};
