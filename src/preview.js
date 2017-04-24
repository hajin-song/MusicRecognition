function __reloadCropperImage(imageSource, imageID){
 let img = new Image();
 let imageDOM = $("#" + imageID);
 imageDOM.attr('src', imageSource)
 imageDOM.cropper({
   crop: function(e) {
     // Output the result data for cropping image.
     $("#crop-x").val(e.x);
     $("#crop-y").val(e.y);
     $("#crop-width").val(e.width);
     $("#crop-height").val(e.height);
   }
 });
 $(".cropper-canvas img").attr('src', imageSource);
 $(".cropper-view-box img").attr('src', imageSource);
 var imageData = $("#image").cropper('getImageData');
 var canvasData = $("#image").cropper('getCanvasData');
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

function loadImageFromServer(img_name){
 __reloadCropperImage("/" + img_name, "image");
}

export { initialiseCanvasPreview, loadImageFromServer }
