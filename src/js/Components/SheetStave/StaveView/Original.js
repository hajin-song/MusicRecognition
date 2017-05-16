import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SheetActions from 'omrActions/Sheet';

import Canvas from 'omrComponents/Common/StaticCanvas';

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
 <div className='col-xs-12'>
  <Canvas stave={stave} cropper={cropper} />
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Sheet);
