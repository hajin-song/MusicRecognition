import React from 'react';
import { connect } from 'react-redux';

import CropperActions from 'omrActions/Cropper';

import CroppableCanvas from 'omrComponents/SheetCrop/CroppableCanvas';

const mapStateToProps = (state) => {
 return {
  sheet: state.session.original,
  cropper: state.crop.cropper
 }
}

const mapDispatchToProps = (dispatch) => {
 return {
  reloadCropper: () => {
   var cropper = new Cropper(document.getElementById("image-crop"),
   {
    ready: function(){
     dispatch({type: CropperActions.CROP_CHANGED, cropper: cropper});
     $(".cropper-crop-box, .cropper-drag-box, .cropper-wrap-box" ).on("mousemove", function(e){
      let clickedX = (e.originalEvent.clientX - cropper.canvasData.left);
      let clickedY = (e.originalEvent.clientY - cropper.canvasData.top);

      var trueX = (clickedX/cropper.canvasData.width) * cropper.canvasData.naturalWidth;
      var trueY = (clickedY/cropper.canvasData.height) * cropper.canvasData.naturalHeight;
      //console.log(e.originalEvent);
      //console.log(cropper.canvasData);
     });
    }
   });

  },
 };
}

const Sheet = ({sheet, reloadCropper, cropper }) => (
 <CroppableCanvas sheet={sheet} reloadCropper={reloadCropper} />
);

export default connect(mapStateToProps, mapDispatchToProps)(Sheet);
