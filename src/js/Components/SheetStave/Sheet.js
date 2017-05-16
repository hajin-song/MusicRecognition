import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SheetActions from 'omrActions/Sheet';

import Canvas from 'omrComponents/Common/Canvas';

const mapStateToProps = (state) => {
 return {
  sheet: state.app.uniquePath + "/" + state.sheet.current,
  staves: state.sheet.staveGroup,
  clickedStaves: state.sheet.clickedStaves
 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
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

const Sheet = ({ sheet, staves, clickedStaves, staveSelect }) => (
 <div className='col-xs-9'>
  <Canvas className="sheet__image" src={sheet} staves={staves} clickedStaves={clickedStaves} staveSelect={staveSelect} />
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Sheet);
