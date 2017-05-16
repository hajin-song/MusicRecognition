import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import Vex from 'vexflow';
const VF = Vex.Flow
class VexFlowCanvas extends React.Component{
 componentDidMount(){
  console.log(Vex)
 }
 componentDidUpdate(prevProps, prevState){
  let left = this.props.stave.section[0];
  let width = (this.props.stave.section[1] - left) * 2;
  let top = this.props.stave.stave.trueY0;
  let height = (this.props.stave.stave.trueY1 - top) * 2;

  let current = document.getElementById('stave__vexflow');
  let currentAction = document.getElementById('stave__vexflow-action');
  let currentContext = current.getContext('2d');
  let currentActionContext = currentAction.getContext('2d');
  currentContext.canvas.height = height;
  currentContext.canvas.width = width;

  currentActionContext.canvas.height = height;
  currentActionContext.canvas.width = width;
  var renderer = new VF.Renderer(current, VF.Renderer.Backends.CANVAS);
  renderer.resize(width, height);
  var context = renderer.getContext();
  context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
  var stave = new VF.Stave(0, 0, width);
  stave.addClef("treble")
  stave.setContext(context).draw();

  let notes = this.props.stave.stave.notes.sort( (a, b) => {
   return a.x > b.x;
  }).filter( (section) => {
   return this.props.stave.section[0] <= section.x && section.x <= this.props.stave.section[1];
  });

  let notesVex = notes.map( (section) => {
   return section.notes.map((note) => {
    return new VF.StaveNote({clef: "treble", keys: [note.pitch], duration: note.duration })
   })
  });

  console.log(notesVex);
  VF.Formatter.FormatAndDraw(context, stave,  [].concat.apply([], notesVex));
 }

 render() {
  return (
   <div className="stave__canvas-container">
    <canvas id="stave__vexflow"></canvas>
    <canvas id="stave__vexflow-action"></canvas>
   </div>
  )
 }
}

VexFlowCanvas.contextTypes = {
 store: PropTypes.object
}


export default VexFlowCanvas
