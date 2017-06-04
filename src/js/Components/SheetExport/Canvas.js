/**
 * Canvas
 * @author - Ha Jin Song
 * Last Modified - 27-May-2017
 * @description - Canvas Component for Export phase
 */

import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import {
 groupNotes,
} from 'omrTools/Note';

import {
 getNoteDuration,
 fillRest,
 generateNotes,
 drawStaves,
} from 'omrTools/VexFlowTool';

import {
 getMousePos,
 drawRectangle
} from 'omrTools/Canvas';

import Annotator from 'omrComponents/SheetExport/Actions/AnnotatorContainer';

import Vex from 'vexflow';
const VF = Vex.Flow

class VexFlowCanvas extends React.Component{
 componentDidUpdate(prevProps, prevState){
  this.staves = [];
  this.notes = [];
  this.vexNotes = [];

  this.current = document.getElementById(this.props.canvasID);
  this.currentAction = document.getElementById(this.props.canvasID + '-action');


  var canvasWidth = $(this.current).width();
  var canvasHeight = $(this.current).height();

  this.renderer = new VF.Renderer(this.current, VF.Renderer.Backends.CANVAS);
  this.renderer.resize(canvasWidth, canvasHeight);
  this.rendererAction = new VF.Renderer(this.currentAction, VF.Renderer.Backends.CANVAS);
  this.rendererAction.resize(canvasWidth, canvasHeight);

  this.context = this.renderer.getContext();
  this.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

  let staveHeight = 100 * this.props.staves.length + 300;
  let currentContext = this.current.getContext('2d');
  let currentActionContext = this.currentAction.getContext('2d');

  currentContext.canvas.height = staveHeight + 50;
  currentActionContext.canvas.height = staveHeight + 50;

  // total section count, i in below is local count
  var allSectionCount = 0;
  this.props.staves.map( (stave, index) => {
   let sectionCount = stave.sections.length - 1;
   let sectionWidth = (canvasWidth-20) / sectionCount;
   for(var i = 0 ; i < sectionCount ; i++){
    this.notes.push([]);
    var curStave = drawStaves(currentContext, 10 + (sectionWidth * i),
                               index * 100 + 300, sectionWidth,
                               stave.barAnnotation[stave.sections[i]]);
    this.staves.push(curStave);
    for(var noteIndex = 0 ; noteIndex < stave.notes.length ; noteIndex++){
     if(stave.sections[i] < stave.notes[noteIndex].x && stave.notes[noteIndex].x <= stave.sections[i+1]){
      this.notes[i + allSectionCount].push(stave.notes[noteIndex]);
     }
    }
   }
   allSectionCount += i;
  });


  this.staves.map( (stave, index) => {

   var curNotes = this.notes[index];
   var remainingTicks = 4;

   // Vex Flow notes generated up to tickable count
   var result = generateNotes(curNotes, remainingTicks);
   this.vexNotes.push([]);
   this.vexNotes[index] = result[2];
   var noteIndex = result[0];
   remainingTicks = result[1];

   // Beams
   var beams = groupNotes(curNotes, noteIndex, 'bar');
   var vexBeams = [];
   while(beams.length >= 2){
    var start = beams[0];
    var end = beams[1];
    beams.splice(0,2);
    vexBeams.push(new VF.Beam(this.vexNotes[index].slice(start, end+1)));
   }

   var slurs = groupNotes(curNotes, noteIndex, 'slur');
   var vexSlurs = [];
   while(slurs.length >= 2){
    var start = slurs[0];
    var end = slurs[1];
    slurs.splice(0,2);
    vexSlurs.push(new VF.Curve(
     this.vexNotes[index][start],
     this.vexNotes[index][end]
    ));
   }

   // Draww
   Vex.Flow.Formatter.FormatAndDraw(this.context, stave, this.vexNotes[index]);
   vexBeams.map( (vexBeam) => { vexBeam.setContext(this.context).draw(); });
   vexSlurs.map( (slur) => { slur.setContext(this.context).draw(); });
  });;
 }


 render() {
  return (
   <div className="export__container">
    <canvas id={this.props.canvasID}></canvas>
    <canvas id={this.props.canvasID + '-action'}></canvas>
    <Annotator/>
   </div>
  )
 }
}

VexFlowCanvas.propTypes = {
 canvasID: PropTypes.string,
}

export default VexFlowCanvas;
