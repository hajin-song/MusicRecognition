function getMousePos(canvasID, evt) {
 var rect = document.getElementById(canvasID).getBoundingClientRect();
 return {
  x: evt.clientX - rect.left,
  y: evt.clientY - rect.top
 };
}

function drawRectangle(canvasID, start, end, width, height, style = '#fff'){
 var canvas = document.getElementById(canvasID);
 var context = canvas.getContext('2d');
 context.fillStyle = style;
 context.fillRect(start, end, width, height);
}

function removeRectangle(canvasID, start, end, width, height, style = '#fff'){
 var canvas = document.getElementById(canvasID);
 var context = canvas.getContext('2d');
 context.fillStyle = style;
 context.clearRect(start, end, width, height);
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
 removeRectangle,
 drawText,
};
