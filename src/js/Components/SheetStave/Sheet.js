import React from 'react';
import { connect } from 'react-redux';

import SheetActions from 'omrActions/Sheet';
import SessionActions from 'omrActions/Session';

import Canvas from 'omrComponents/SheetStave/Canvas';

const mapStateToProps = (state) => {
 return {
  sheet: state.session.original,
  staves: state.sheet.staveGroup,
  clickedStaves: state.sheet.clickedStaves
 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
  imageLoaded: (data) => {
   dispatch({ "type": SessionActions.ORIGINAL_SHEET, "sheet": data });
  },
  staveSelect: (area, ctrl) => {
   if(ctrl){
    dispatch({  "type": SheetActions.STAVE_CLICKED_CONTROL, "area": area });
   } else {
    dispatch({  "type": SheetActions.STAVE_CLICKED, "area": area });
    $('#stave-viewer').modal('show');
   }
  },
 });
}

const Sheet = ({ sheet, staves, clickedStaves, staveSelect, imageLoaded }) => (
 <div className='col-xs-9 content__image'>
  <Canvas sheet={sheet} staves={staves}
          clickedStaves={clickedStaves} staveSelect={staveSelect}
          imageLoaded={imageLoaded}
          canvasID="main-canvas" canvasClass="canvas--main" />
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Sheet);
