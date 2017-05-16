import CropperActions from 'omrActions/Cropper';

function getNewCropper(){
 let cropper = new Cropper(document.getElementById("image-crop"),
 {
  ready: function(){
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
 return cropper
}

const cropperReducer = (state = { cropper: {} }, action) => {
 switch(action.type) {
  case CropperActions.CROP_CHANGED:
   console.log("UPDATING CROPPER");
   console.log(action.cropper);
   if (Object.getOwnPropertyNames(state.cropper).length > 0){
    state.cropper.destroy();
   }
   return Object.assign({}, state, { cropper: getNewCropper() });
  default:
   return state;
 }
}

export default cropperReducer;
