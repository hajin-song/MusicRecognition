/**
 * VexFlowCanvas
 * @author - Ha Jin Song
 * Last Modified - 5-June-2017
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
 * @deprecated
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
 * @return {Array}       [Last Legal Note Index, Remaining Ticks, List of Vex Flow notes]
 */
function generateNotes(notes){
 var vexNotes = [];
 var noteIndex = 0;
 for(noteIndex ; noteIndex < notes.length ; noteIndex++){
  let curNote = notes[noteIndex];
  let noteDuration =  getNoteDuration(curNote);

  if(curNote.type === 'r'){
   // Generate rest object
   vexNotes.push(new VF.StaveNote({
    keys:['b/4'],
    duration: curNote.duration + 'r'
   }));
  }else{
   /// Generate basic note object
   var note = new VF.StaveNote({
    keys:[curNote.pitch + "/" + curNote.octave],
    duration: curNote.duration,
    auto_stem: true
   });
   if(curNote.accidental != ''){
    note.addAccidental(0, new VF.Accidental(curNote.accidental));
   }
   // Add articulations
   curNote.articulations.map( (articulation, index) => {
    note = note.addArticulation(0,
     new VF.Articulation(articulation).setPosition(3));
   });
   vexNotes.push(note);
  }

 }
 return [noteIndex, vexNotes];
}


/**
 * drawStaves - description
 *
 * @param  {Object} context         Canvas Context
 * @param  {Number} x               Top left corner of the bar (X)
 * @param  {Number} y               Top left corner of the bar (Y)
 * @param  {Number} width           Width of the bar
 * @param  {Object} bar_annotations Annotation on the bar
 * @return {Object}                 Generated Stave Bar
 */
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

export {
 getNoteDuration,
 fillRest,
 generateNotes,
 drawStaves,
};
