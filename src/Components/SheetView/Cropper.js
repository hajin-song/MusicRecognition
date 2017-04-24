import React from 'react';
import CropperActions from 'omrActions/Cropper';
import { PropTypes } from 'prop-types';

class Cropper extends React.Component{
 constructor() {
  super();
  this.__reloadCropperImage = this.__reloadCropperImage.bind(this);
 }
 __reloadCropperImage(imageSource){
  const { store } = this.context;
  let img = new Image();
  let imageDOM = $("#image");
  imageDOM.attr('src', imageSource)
  imageDOM.cropper({
   crop: function(e) {
    store.dispatch({
     type: CropperActions.CROP_PANE_CHANGED,
     x: e.x,
     y: e.y,
     width: e.width,
     height: e.height
    });
   }
  });
  $(".cropper-canvas img").attr('src', imageSource);
  $(".cropper-view-box img").attr('src', imageSource);
  var imageData = $("#image").cropper('getImageData');
  var canvasData = $("#image").cropper('getCanvasData');
 }

 componentDidMount() {
  const { store } = this.context;
  let self = this;
  let reader = new FileReader();
  reader.onload = function(e) {
   self.__reloadCropperImage(e.target.result);
  }

  self.unsubscribe = store.subscribe( () => {
   const state = store.getState();
   if( state.sheet.current instanceof Blob){
    reader.readAsDataURL(state.sheet.current);
   }else{
    self.__reloadCropperImage(state.sheet.current);
   }
  });
 }

 componentWillUnmount(){
   this.unsubscribe();
 }

 render() {
  return (
   <img id='image' style={{ "maxWidth": "100%"}}>
   </img>
  );
 }
}

Cropper.contextTypes = {
 store: PropTypes.object
}

export default Cropper;
