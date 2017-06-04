import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import {
 getMousePos,
 drawRectangle,
} from 'omrTools/Canvas';

class Canvas extends React.Component{
 componentDidMount(){
  $('#' + this.props.canvasID).on('mousemove', (e) => {
   if(e.ctrlKey){
    let coord = getMousePos(this.props.canvasID, e);
    drawRectangle(this.props.canvasID, coord.x, coord.y , 10, 10);
   }
  });
 }

 componentDidUpdate(prevProps, prevState){
  var canvas = document.getElementById(this.props.canvasID);
  var context = canvas.getContext('2d');
  var img = new Image();
  img.onload = () => {
   context.canvas.height = img.naturalHeight;
   context.canvas.width = img.naturalWidth;
   context.drawImage(img, 0, 0);
  }
  img.src = this.props.sheet
 }

 render() {
  return (
   <div className="image__container">
    <canvas id={this.props.canvasID}></canvas>
   </div>
  )
 }
}

Canvas.propTypes = {
 sheet: PropTypes.string,
}

export default Canvas;
