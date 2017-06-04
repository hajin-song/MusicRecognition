/**
* Canvas.js
* Author: Ha Jin Song
* Last Modified: 5-June-2017
* @description Helpers for canvas interaction
*/

/**
 * getMousePos - Retrieve clicked coordinate o nthe canvas
 *
 * @param  {String} canvasID Dom ID for the canvas element
 * @param  {Object} evt      Event object
 * @return {Object}          x,y coordinate
 */
function getMousePos(canvasID, evt) {
 var rect = document.getElementById(canvasID).getBoundingClientRect();
 return {
  x: evt.clientX - rect.left,
  y: evt.clientY - rect.top
 };
}

/**
 * drawRectangle - Draw a rectangle shape on the canvas
 *
 * @param  {String} canvasID       Dom ID for the canvas element
 * @param  {Number} start          Top left corner of the drawing region (X)
 * @param  {Number} end            Top left corner of the drawing region (Y)
 * @param  {Number} width          Width of the drawing region
 * @param  {Number} height         Height of the drawing region
 * @param  {String} style = '#fff' Colour of the rectenagle being drawn
 */
function drawRectangle(canvasID, start, end, width, height, style = '#fff'){
 var canvas = document.getElementById(canvasID);
 var context = canvas.getContext('2d');
 context.fillStyle = style;
 context.fillRect(start, end, width, height);
}


/**
 * removeRectangle - Remove a rectangular region of the canvas
 *
 * @param  {String} canvasID       Dom ID for the canvas element
 * @param  {Number} start          Top left corner of the drawing region (X)
 * @param  {Number} end            Top left corner of the drawing region (Y)
 * @param  {Number} width          Width of the drawing region
 * @param  {Number} height         Height of the drawing region
 */
function removeRectangle(canvasID, start, end, width, height){
 var canvas = document.getElementById(canvasID);
 var context = canvas.getContext('2d');
 context.clearRect(start, end, width, height);
}


/**
 * drawText - Draw text on the canvas
 *
 * @param  {String} canvasID       dom ID for the canvas element
 * @param  {String} text     Text being drawn
 * @param  {String} size     Size of the text
 * @param  {String} style    Front of the text
 * @param  {Number} x        Top left corner of the drawing region (X)
 * @param  {Number} y        Top left corner of the drawing region (Y)
 */
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
