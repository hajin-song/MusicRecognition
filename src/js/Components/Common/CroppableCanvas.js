import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import CropperActions from 'omrActions/Cropper';

class CroppableCanvas extends React.Component{
 componentDidMount(){
  const { store } = this.context;
  console.log(store);
  $("#image-crop").on('load', function(){
   console.log('que');
   var state = store.getState();
   if (Object.getOwnPropertyNames(state.crop.cropper).length > 0){
    state.crop.cropper.destroy();
   }
   let cropper = new Cropper(document.getElementById("image-crop"),
   {
    autoCrop: false,
    ready: function(){
     $(".cropper-crop-box, .cropper-drag-box, .cropper-wrap-box" ).on("mousemove", function(e){
      console.log(cropper.canvasData);
      let clickedX = (e.originalEvent.clientX - cropper.canvasData.left);
      let clickedY = (e.originalEvent.clientY - cropper.canvasData.top);

      var trueX = (clickedX/cropper.canvasData.width) * cropper.canvasData.naturalWidth;
      var trueY = (clickedY/cropper.canvasData.height) * cropper.canvasData.naturalHeight;
      console.log(trueX, trueY);
      //console.log(e.originalEvent);
      //console.log(cropper.canvasData);
     });
    }
   });
   store.dispatch({
    type: CropperActions.CROP_CHANGED,
    cropper: cropper,
   });
  });
 }
 componentDidUpdate(prevProps, prevState){
  console.log("whue");
  console.log(this.props.src);
 }
 render() {
  return (
   <div className='col-xs-9 sheet__canvas sheet__canvas--crop'>
    <img id="image-crop" src={this.props.src}>
    </img>
   </div>
  )
 }
}


CroppableCanvas.propTypes = {
 src: PropTypes.string,
}

CroppableCanvas.contextTypes = {
 store: PropTypes.object
}

export default CroppableCanvas;
