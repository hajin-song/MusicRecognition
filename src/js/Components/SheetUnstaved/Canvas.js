import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

class Canvas extends React.Component{
 componentDidMount(){
  $('#' + this.props.canvasID).on('mousemove', (e) => {
   if(e.ctrlKey){
    var canvas = document.getElementById(this.props.canvasID);
    var context = canvas.getContext('2d');
    let coord = this.__getMousePos(e);
    context.fillStyle = "#fff";
    context.fillRect(coord.x,coord.y,5,5);
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

   let data = context.getImageData(0, 0, canvas.width, canvas.height);
   this.props.imageLoaded(canvas.toDataURL('image/png', 1.0));
  }

  if(this.props.sheet == ""){
   img.src = "/" + this.props.original;
  }else{
   //context.canvas.height = height;
   //context.canvas.width = width;
   img.src = this.props.sheet;
  }
 }

 __getMousePos(evt) {
    var rect = document.getElementById(this.props.canvasID).getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
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
 original: PropTypes.string,
 imageLoaded: PropTypes.func,
 sheet: PropTypes.object,
}

export default Canvas;
