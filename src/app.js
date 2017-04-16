$(document).ready(()=>{
 $("#musicSheet").on("change", function(e){
  var reader = new FileReader();
  reader.onload = function(e) {
   let img = new Image();
   img.src = e.target.result;
   img.onload = function(){
    let width = img.naturalWidth;
    let height = img.naturalHeight;
    let imageDOM = $("#image")[0];
    imageDOM.width = width;
    imageDOM.height = height;
    imageDOM.getContext('2d').drawImage(img, 0, 0, width, height);
   }
  }
  reader.readAsDataURL(this.files[0]);
 });

 $("#image").on("click", function(e){
  let pos = findPos(this);
  let x = e.pageX - pos.x;
  let y = e.pageY - pos.y;
  $("#musicSheetRow").val($("#musicSheetRow").val() + "," + y);
  console.log(x, y);
 });

 $("#form").on("submit", function(e){
  e.preventDefault();
  $(this).ajaxSubmit({
   success:function(res){ console.log(res); },
   error: function(err){ console.log(err); }
  });
  console.log(":D");
 });

 var findPos = (obj) => {
  let curleft = 0, curtop = 0;
  if(obj.offsetParent){
   do {
    curleft += obj.offsetLeft;
    curtop += obj.offsetTop;
   }while(obj = obj.offsetParent);
   return { x: curleft, y: curtop }
  }
  return undefined;
 }
});
