import React from 'react';

import { PropTypes } from 'prop-types';

import {
 getMousePos,
 drawText
} from 'omrTools/Canvas';

class Annotator extends React.Component{
 componentDidMount(){
  $('#export-canvas-action').on('click', (e) => {
   this.coord = getMousePos('export-canvas-action', e);
   $('#export-annotator').css('left', this.coord.x);
   $('#export-annotator').css('top', this.coord.y);
   $('#export-annotator').toggle();
   //drawRectangle(this.props.canvasID, coord.x, coord.y , 5, 5);
  });
 }

 render(){
  return (
   <div id={this.props.containerID} className='export__annotate'>
    <input id={this.props.inputID} />

    <button onClick={ () => {
     drawText('export-canvas-action',
              $('#'+this.props.inputID).val(),
              '10',
              'Arial',
              this.coord.x,
              this.coord.y);
    $('#'+this.props.containerID).toggle();
    }}>
     Annotate
    </button>
   </div>
  )
 }
}


Annotator.PropTypes = {
 annotate: PropTypes.func,
 inputID: PropTypes.string,
 containerID: PropTypes.string,
}


export default Annotator;
