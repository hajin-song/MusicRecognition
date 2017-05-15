import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

class Canvas extends React.Component{
 componentDidMount(){
  this.clickedStaves = [];
  var self = this;
  $("#image-actions").on('click', function(e){
   if(e.ctrlKey){
    if(self.__containsObject(self.area, self.clickedStaves)){
     self.clickedStaves.push(self.area);
     console.log(self.clickedStaves);
    }
    return;
   }else{
    return;
   }
  });
  $("#image-actions").on('mousemove', function(e){
   let coord = self.__getMousePos(e);
   let stave = self.__getStave(coord.x, coord.y);

   if(typeof self.area != "undefined" && !self.__containsObject(self.area, self.clickedStaves) && typeof stave === "undefined"){
    self.__removeStaveHighlight(self.area.stave, self.area.section);
    self.area = undefined;
   }
   if(typeof stave != "undefined"){
    var canvasAction = document.getElementById('image-actions');
    var contextAction = canvasAction.getContext('2d');

    let section = self.__getStaveSection(stave, coord.x);
    var area = { stave: stave, section: section };
    if(typeof self.area != "undefined" && !self.__containsObject(self.area, self.clickedStaves) && self.area != area){
     self.__removeStaveHighlight(self.area.stave, self.area.section);
    }

    self.__addStaveHighlight(stave, section);
    self.area = area;
   }
  });
 }
 componentDidUpdate(prevProps, prevState){
  const { store } = this.context;
  console.log(store.getState());

  console.log("mounted...");
  console.log(this.props.src);

  var canvas = document.getElementById('image');
  var canvasAction = document.getElementById('image-actions');
  var context = canvas.getContext('2d');
  var contextAction = canvasAction.getContext('2d');
  var img = new Image();
  img.onload = () => {
   context.canvas.height = img.naturalHeight;
   context.canvas.width = img.naturalWidth;
   contextAction.canvas.height = img.naturalHeight;
   contextAction.canvas.width = img.naturalWidth;
   context.drawImage(img, 0, 0);

  }
  img.src = "/" + this.props.src;
 }
 __getMousePos(evt) {
    var rect = document.getElementById('image').getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
 }

 __getStave(x, y){
  var stave = this.props.staves.filter( (stave) => {
   return stave.y0 <= y && y <= stave.y1 &&
          stave.sections[0] <= x && x <= stave.sections[stave.sections.length - 1];
  });
  return stave[0];
 }

 __getStaveSection(stave, x){
  var sectionsMin = stave.sections.filter ( (section) => {
   return x >= section
  });
  var sectionsMax = stave.sections.filter ( (section) => {
   return x <= section
  });
  sectionsMin.reverse();
  return [sectionsMin[0], sectionsMax[0]]
 }

 __addStaveHighlight(stave, section){
  var canvasAction = document.getElementById('image-actions');
  var contextAction = canvasAction.getContext('2d');
  contextAction.fillStyle="#FF0000";
  contextAction.fillRect(
   section[0],
   stave.y0,
   section[1] - section[0],
   stave.y1 - stave.y0
  );
  $('#image-actions').css('cursor', 'pointer');
 }

 __removeStaveHighlight(stave, section){
  var canvasAction = document.getElementById('image-actions');
  var contextAction = canvasAction.getContext('2d');
  contextAction.clearRect(
   section[0],
   stave.y0,
   section[1] - section[0],
   stave.y1 - stave.y0
  );
  $('#image-actions').css('cursor', '');
 }
 __containsObject(obj, list) {
  let contains = list.filter((area) => {
   return area.stave.y0 == obj.stave.y0 && area.stave.y1 == obj.stave.y1 && area.section[0] == obj.section[0] && area.section[1] == obj.section[1]
  });
  return contains.length != 0;
 }
 render() {
  return (
   <div className="sheet__canvas">
    <canvas id="image"></canvas>
    <canvas id="image-actions"></canvas>
   </div>
  )
 }
}


Canvas.propTypes = {
 src: PropTypes.string,
 staves: PropTypes.arrayOf(PropTypes.object)
}

Canvas.contextTypes = {
 store: PropTypes.object
}


export default Canvas
