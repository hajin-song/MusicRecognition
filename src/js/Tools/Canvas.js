function getMousePos(canvasID, evt) {
 var rect = document.getElementById(canvasID).getBoundingClientRect();
 return {
  x: evt.clientX - rect.left,
  y: evt.clientY - rect.top
 };
}

function drawRectangle(canvasID, start, end, width, height){
 var canvas = document.getElementById(canvasID);
 var context = canvas.getContext('2d');
 context.fillStyle = "#fff";
 context.fillRect(start, end, width, height);
}

function drawText(canvasID, text, size, style, x, y){
 var canvas = document.getElementById(canvasID);
 var context = canvas.getContext('2d');
 context.font = size + "px" + " " + style;
 context.fillText(text, x, y);
}

export {
 getMousePos,
 drawRectangle,
 drawText,
};
