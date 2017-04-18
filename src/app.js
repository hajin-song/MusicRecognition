import { initialiseCanvasPreview, loadImageFromServer } from './preview';
import { initialiseCropper } from './canvasCropper';

$(document).ready(()=>{
 initialiseCanvasPreview("musicSheet", "image");
 initialiseCropper("image");


 $("#form").on("submit", function(e){
  e.preventDefault();
  $(this).ajaxSubmit({
   success:function(res){
    console.log("?!?!?!");
    console.log(res);
    loadImageFromServer();
   },
   error: function(err){ console.log(err); }
  });
  console.log(":D");
 });
});
