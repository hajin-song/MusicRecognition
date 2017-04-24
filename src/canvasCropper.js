

function __findPos(obj){
 let curleft = 0, curtop = 0;
 if(obj.offsetParent){
  do {
   curleft += obj.offsetLeft;
   curtop += obj.offsetTop;
  }while(obj = obj.offsetParent);
  return { x: curleft, y: curtop }
 }
 return undefined;
};

function __getPoint(e){
 console.log(this);
 let pos = __findPos(this);
 let x = e.pageX - pos.x;
 let y = e.pageY - pos.y;
 return [x, y];
}

function initialiseCropper(imageID){
 $("#crop-note").on("click", function(e){
  let xMin = parseInt($("#crop-x").val());
  let yMin = parseInt($("#crop-y").val());
  let xMax = xMin + parseInt($("#crop-width").val());
  let yMax = yMin + parseInt($("#crop-height").val());
  $("#normalNote").val([xMin, yMin, xMax, yMax].join(','));
 });
 $("#crop-half").on("click", function(e){
  let xMin = parseInt($("#crop-x").val());
  let yMin = parseInt($("#crop-y").val());
  let xMax = xMin + parseInt($("#crop-width").val());
  let yMax = yMin + parseInt($("#crop-height").val());
  $("#halfNote").val([xMin, yMin, xMax, yMax].join(','));
 });
 $("#crop-whole").on("click", function(e){
  let xMin = parseInt($("#crop-x").val());
  let yMin = parseInt($("#crop-y").val());
  let xMax = xMin + parseInt($("#crop-width").val());
  let yMax = yMin + parseInt($("#crop-height").val());
  $("#wholteNote").val([xMin, yMin, xMax, yMax].join(','));
 });
 $("#crop-content").on("click", function(e){
  let xMin = parseInt($("#crop-x").val());
  let yMin = parseInt($("#crop-y").val());
  let xMax = xMin + parseInt($("#crop-width").val());
  let yMax = yMin + parseInt($("#crop-height").val());
  $("#musicSheetCanvas").val([xMin, yMin, xMax, yMax].join(','));
 });
 let imageDOM = $('#' + imageID);
 imageDOM.on('src-updated', function(e){
  imageDOM.cropper({
    crop: function(e) {
      // Output the result data for cropping image.
      console.log(e.x, e.y);
      console.log(e.width, e.height);
      console.log(e.scaleX, e.scaleY);
    }
  });

 });
}


export { initialiseCropper }
