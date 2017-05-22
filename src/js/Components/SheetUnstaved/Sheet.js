import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SessionActions from 'omrActions/Session';

import Canvas from 'omrComponents/SheetUnstaved/Canvas';

const mapStateToProps = (state) => {
 return {
  sheet: state.session.unstaved,
 }
}

const mapDispatchToProps =(dispatch) => {
 return ({

 });
}

const Sheet = ({ sheet }) => (
 <div className='col-xs-9 content__image'>
  <Canvas sheet={sheet} canvasID="unstave-canvas" canvasClass="canvas--unstave" />
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Sheet);
