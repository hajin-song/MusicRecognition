import React from 'react';
import { PropTypes } from 'prop-types';

import Sheet from 'omrComponents/SheetCrop/Sheet';
import SheetLoader from 'omrComponents/SheetStave/Loader';
import Symbols from 'omrComponents/Common/Symbols';
import CropperActions from 'omrActions/Cropper';

class SheetContainer extends React.Component{
 componentDidMount(){
  const { store } = this.context;
  console.log(store);
  $("#image").on('load', function(){
   var state = store.getState();
   if (Object.getOwnPropertyNames(state.crop.cropper).length > 0){
    state.crop.cropper.destroy();
   }
   let cropper = new Cropper(document.getElementById("image"),
   {
    autoCrop: false,
    ready: function(){
     $(".cropper-crop-box, .cropper-drag-box, .cropper-wrap-box" ).on("mousemove", function(e){
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
 render(){
  return (
   <div id='image-preview' className="row">
    <Symbols />
    <Sheet />
    <SheetLoader />
   </div>
  );
 }
}

SheetContainer.contextTypes = {
 store: PropTypes.object
}

export default SheetContainer;
