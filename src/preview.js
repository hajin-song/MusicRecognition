function __reloadCropperImage(imageSource, imageID){
 let img = new Image();
 let imageDOM = $("#" + imageID);
 imageDOM.attr('src', imageSource)
 imageDOM.cropper({
   crop: function(e) {
     // Output the result data for cropping image.
     console.log(e.x, e.y);
     console.log(e.width, e.height);
     console.log(e.scaleX, e.scaleY);
   }
 });
 $(".cropper-canvas img").attr('src', imageSource);
 $(".cropper-view-box img").attr('src', imageSource);
 var imageData = $("#image").cropper('getImageData');
 var canvasData = $("#image").cropper('getCanvasData');
 console.log(imageData)
 console.log(canvasData);
}

function initialiseCanvasPreview(inputID, imageID){
 $("#" + inputID).on("change", function(e){
  $("#image-preview").html("");
  $("#image-preview").append($('<img id="image" style="max-width:100%;"></img>'));
  let reader = new FileReader();
  reader.onload = function(e) {
   __reloadCropperImage(e.target.result, imageID);
  }
  reader.readAsDataURL(this.files[0]);
 });
};

function loadImageFromServer(){
 __reloadCropperImage("/sheet_without_staves.png", "image");
}

export { initialiseCanvasPreview, loadImageFromServer }
