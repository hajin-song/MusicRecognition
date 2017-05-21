import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import ImageActions from 'omrActions/Image';

import Canvas from 'omrComponents/SheetUnstaved/Canvas';

const mapStateToProps = (state) => {
 return {
  original: state.app.uniquePath + "/" + "sheet_without_staves.png",
  sheet: state.image.unstaved,
  current: state.sheet.current,
 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
  imageLoaded: (data) => {
   dispatch({ "type": ImageActions.UNSTAVED_SHEET, "sheet": data });
  },

 });
}

const Sheet = ({ original, sheet, imageLoaded }) => (
 <div className='col-xs-9 content__image'>
  <Canvas original={original} sheet={sheet} imageLoaded={imageLoaded}
          canvasID="unstave-canvas" canvasClass="canvas--unstave" />
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Sheet);
