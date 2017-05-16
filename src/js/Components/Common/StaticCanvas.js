import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

class StaticCanvas extends React.Component{
 componentDidMount(){

 }
 componentDidUpdate(prevProps, prevState){
  console.log(this.props);
  let left = this.props.stave.section[0];
  let width = this.props.stave.section[1] - left;
  let top = this.props.stave.stave.trueY0;
  let height = this.props.stave.stave.trueY1 - top;

  let canvas = document.getElementById('image');
  let context = canvas.getContext('2d');
  let data = context.getImageData(left, top, width, height);

  let current = document.getElementById('image-original-stave');
  let currentContext = current.getContext('2d');
  currentContext.canvas.height = height;
  currentContext.canvas.width = width;
  currentContext.putImageData(data, 0, 0);
 }

 render() {
  return (
   <div className="stave__canvas-container">
    <canvas id="image-original-stave"></canvas>
   </div>
  )
 }
}

StaticCanvas.contextTypes = {
 store: PropTypes.object
}


export default StaticCanvas
