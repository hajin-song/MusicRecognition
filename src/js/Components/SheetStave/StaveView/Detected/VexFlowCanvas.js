/**
 * VexFlowCanvasTool
 * @author - Ha Jin Song
 * Last Modified - 25-May-2017
 * @description - Canvas Component containing Vex Flow entities
 */


import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import {
 getNoteDuration,
 fillRest,
 generateNotes,
 markRemainders,
 groupBeams,
 groupSlurs
} from 'omrTools/VexFlowCanvasTool';

import Vex from 'vexflow';
const VF = Vex.Flow

class VexFlowCanvas extends React.Component{
 componentDidUpdate(prevProps, prevState){
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
  var stave = new VF.Stave(0, 0, width * 2 - 5);
  stave.addTimeSignature("4/4");
  stave.setContext(context).draw();

  var remainingTicks = 4;

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
  var beams = groupBeams(notes, noteIndex);
  var vexBeams = [];
  while(beams.length >= 2){
   var start = beams[0];
   var end = beams[1];
   beams.splice(0,2);
   vexBeams.push(new VF.Beam(vexNotes.slice(start, end+1)));
  }

  var slurs = groupSlurs(notes, noteIndex);
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

  markRemainders(notes, noteIndex);

  // Fill up rests;
  var rests = fillRest(remainingTicks);
  rests = rests.map( (rest) => {
   return new VF.StaveNote({keys: ["b/4"], duration: rest });
  })

  // Combine notes with fill up rests
  vexNotes = vexNotes.concat(rests);

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
