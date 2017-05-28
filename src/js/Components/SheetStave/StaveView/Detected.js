/**
* Detected.js
* Canvas Container Component for Stave View - Detected Image view
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/

import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SheetActions from 'omrActions/Sheet';

import Canvas from 'omrComponents/SheetStave/StaveView/Detected/VexFlowCanvas';

const mapStateToProps = (state) => {
 return {
  stave: state.sheet.current_stave
 }
}

const mapDispatchToProps =(dispatch) => {
 return ({

 });
}

const Sheet = ({ stave }) => (
 <div id="detected" className='row'>
  <Canvas stave={stave} canvasID="detected-canvas"/>
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Sheet);
