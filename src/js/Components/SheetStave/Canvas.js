/**
* Canvas.js
* Canvas Component for Main View
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/

import React from 'react';

import { PropTypes } from 'prop-types';

import {
 getMousePos,
 drawRectangle,
 removeRectangle
} from 'omrTools/Canvas';

class Canvas extends React.Component{
 componentDidMount(){
  $('#' + this.props.canvasID + '-actions').on('click', (e) => {
   if(typeof this.area != "undefined"){
    this.props.staveSelect(this.area, e.ctrlKey);
   }
  });

  $('#' + this.props.canvasID + '-actions').on('mousemove', (e) => {
   let coord = getMousePos(this.props.canvasID, e);
   let stave = this.__getStave(coord.x, coord.y);

   let curAreaIndex = $.objectIndex(this.area, this.props.clicked_staves);

   if(typeof this.area != "undefined" &&
      curAreaIndex == -1 &&
      typeof stave === "undefined"){
    this.__removeStaveHighlight(this.area.stave, this.area.section);
   }

   if(typeof stave != "undefined"){
    var canvasAction = document.getElementById(this.props.canvasID + '-actions');
    var contextAction = canvasAction.getContext('2d');

    let section = this.__getStaveSection(stave, coord.x);
    var area = { stave: stave, section: section };
    if(typeof this.area != "undefined" &&
       curAreaIndex == -1 &&
       this.area != area){
     this.__removeStaveHighlight(this.area.stave, this.area.section);
    }
    this.__addStaveHighlight(stave, section);
    this.area = area;
    return;
   }
   this.area = undefined;
  });
 }

 componentDidUpdate(prevProps, prevState){
  this.props.clicked_staves.map((stave) => {
   this.__addStaveHighlight(stave.stave, stave.section);
  });
  var canvas = document.getElementById(this.props.canvasID);
  var canvasAction = document.getElementById(this.props.canvasID + '-actions');
  var context = canvas.getContext('2d');
  var contextAction = canvasAction.getContext('2d');
  var img = new Image();
  img.onload = () => {
   context.canvas.height = img.naturalHeight;
   context.canvas.width = img.naturalWidth;
   contextAction.canvas.height = img.naturalHeight;
   contextAction.canvas.width = img.naturalWidth;
   context.drawImage(img, 0, 0);
  }
  img.src = this.props.sheet;
 }

 __getStave(x, y){
  var stave = this.props.staves.filter( (stave) => {
   return stave.y0 <= y && y <= stave.y1 &&
          stave.sections[0] <= x &&
          x <= stave.sections[stave.sections.length - 1];
  });
  return stave[0];
 }

 __getStaveSection(stave, x){
  var sectionsMin = stave.sections.filter ( (section) => {
   return x >= section;
  });
  var sectionsMax = stave.sections.filter ( (section) => {
   return x <= section;
  });
  sectionsMin.reverse();
  return [sectionsMin[0], sectionsMax[0]];
 }

 __addStaveHighlight(stave, section){
  drawRectangle(this.props.canvasID + '-actions',
                section[0], stave.y0,
                section[1] - section[0], stave.y1 - stave.y0,
               '#FF0000');
 }

 __removeStaveHighlight(stave, section){
  removeRectangle(this.props.canvasID + '-actions',
                section[0], stave.y0,
                section[1] - section[0], stave.y1 - stave.y0);
 }

 render() {
  return (
   <div className="image__container image__container--action">
    <canvas id={this.props.canvasID}></canvas>
    <canvas id={this.props.canvasID + '-actions'}></canvas>
   </div>
  )
 }
}

Canvas.propTypes = {
 src: PropTypes.string,
 staves: PropTypes.arrayOf(PropTypes.object),
 staveSelect: PropTypes.func,
 imageLoaded: PropTypes.func,
 canvasID: PropTypes.string,
}

export default Canvas;
