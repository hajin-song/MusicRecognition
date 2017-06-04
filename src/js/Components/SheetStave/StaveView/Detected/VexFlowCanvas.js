/**
* VexFlowCanvas.js
* Canvas Component for Stave View - Detected Image view
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/


import React from 'react';

import { PropTypes } from 'prop-types';

import {
 groupNotes,
} from 'omrTools/Note';

import {
 getNoteDuration,
 fillRest,
 generateNotes,
 drawStaves
} from 'omrTools/VexFlowTool';

import Vex from 'vexflow';
const VF = Vex.Flow

class VexFlowCanvas extends React.Component{
 componentDidUpdate(prevProps, prevState){
  console.log("updating stave view");
  // Set up canvas
  let left = this.props.stave.section[0];
  let width = (this.props.stave.section[1] - left) * 2;
  let top = this.props.stave.stave.trueY0;
  let height = (this.props.stave.stave.trueY1 - top) * 2;

  let current = document.getElementById(this.props.canvasID);
  let currentContext = current.getContext('2d');
  currentContext.canvas.height = height;
  currentContext.canvas.width = width;

  // Draw Vex Flow Stave
  this.__drawNotes(current, height, width);
 }

 __drawNotes(current, height, width){
  var renderer = new VF.Renderer(current, VF.Renderer.Backends.CANVAS);
  renderer.resize(width * 2, height);
  var context = renderer.getContext();
  context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
  var stave = drawStaves(context, 0, 0, width * 2 - 5, this.props.stave.stave.barAnnotation[this.props.stave.section[0]]);

  console.log(this.props.stave);

  var remainingTicks = 8;

  // Order notes so processing is left to right
  let notes = this.props.stave.stave.notes.filter( (section) => {
   let currentSection = this.props.stave.section;
   return currentSection[0] < section.x && section.x <= currentSection[1];
  });

  // Vex Flow notes generated up to tickable count
  var result = generateNotes(notes, remainingTicks);
  var vexNotes = result[2];
  var noteIndex = result[0];
  remainingTicks = result[1];

  // Beams
  var beams = groupNotes(notes, noteIndex, 'bar');
  var vexBeams = [];
  while(beams.length >= 2){
   var start = beams[0];
   var end = beams[1];
   beams.splice(0,2);
   vexBeams.push(new VF.Beam(vexNotes.slice(start, end+1)));
  }

  var slurs = groupNotes(notes, noteIndex, 'slur');
  var vexSlurs = [];
  while(slurs.length >= 2){
   var start = slurs[0];
   var end = slurs[1];
   slurs.splice(0,2);
   vexSlurs.push(new VF.Curve(
    vexNotes[start],
    vexNotes[end]
   ));
  }

  // Fill up rests;
  var rests = fillRest(remainingTicks);
  rests = rests.map( (rest) => {
   return new VF.StaveNote({keys: ["b/4"], duration: rest });
  })

  // Draww
  Vex.Flow.Formatter.FormatAndDraw(context, stave, vexNotes);
  vexBeams.map( (vexBeam) => { vexBeam.setContext(context).draw(); });
  vexSlurs.map( (slur) => { slur.setContext(context).draw(); });
 }

 render() {
  return (
   <div className="stave__container stave__container--action">
    <canvas id={this.props.canvasID}></canvas>
   </div>
  )
 }
}

VexFlowCanvas.propTypes = {
 canvasID: PropTypes.string,
}

export default VexFlowCanvas;
