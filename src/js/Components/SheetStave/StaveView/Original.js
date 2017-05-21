import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SheetActions from 'omrActions/Sheet';

import Canvas from 'omrComponents/SheetStave/StaveView/StaticCanvas';

const mapStateToProps = (state) => {
 return {
  stave: state.sheet.currentStave,
  cropper: state.crop.cropper
 }
}

const mapDispatchToProps =(dispatch) => {
 return ({

 });
}

const Sheet = ({ stave, cropper }) => (
 <div id="original" className='col-xs-12'>
  <Canvas stave={stave} cropper={cropper} canvasID="selected-canvas" />
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Sheet);
