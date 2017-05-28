/**
* StaticCanvas.js
* Canvas Component for Stave View - Original Image view
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/

import React from 'react';

import { PropTypes } from 'prop-types';

class Canvas extends React.Component{
 componentDidUpdate(prevProps, prevState){
  let left = this.props.stave.section[0];
  let width = this.props.stave.section[1] - left;
  let top = this.props.stave.stave.trueY0;
  let height = this.props.stave.stave.trueY1 - top;

  let canvas = document.getElementById('main-canvas');
  let context = canvas.getContext('2d');
  let data = context.getImageData(left, top, width, height);

  let current = document.getElementById(this.props.canvasID);
  let currentContext = current.getContext('2d');
  currentContext.canvas.height = height;
  currentContext.canvas.width = width;
  currentContext.putImageData(data, 0, 0);
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
 canvasID: PropTypes.string,
}


Canvas.contextTypes = {
 store: PropTypes.object,
}

export default Canvas;
