import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SessionActions from 'omrActions/Session';

import Canvas from 'omrComponents/SheetExport/Canvas';

const mapStateToProps = (state) => {
 return {
  staves: state.sheet.stave_group
 }
}

const mapDispatchToProps =(dispatch) => {
 return ({

 });
}

const Sheet = ({ staves }) => (
 <div className='col-xs-9 content__image'>
  <Canvas staves={staves} canvasID="export-canvas" canvasClass="canvas--export" />
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Sheet);
