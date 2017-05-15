import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import Canvas from 'omrComponents/Common/Canvas';

const mapStateToProps = (state) => {
 return {
  sheet: state.app.uniquePath + "/" + state.sheet.current,
  staves: state.sheet.staveGroup,
  clickedStaves: state.sheet.clickedStaves
 }
}

const Sheet = ({ sheet, staves, clickedStaves }) => (
 <div className='col-xs-9'>
  <Canvas className="sheet__image" src={sheet} staves={staves} clickedStaves={clickedStaves} />
 </div>
);

export default connect(mapStateToProps)(Sheet);
