import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import Canvas from 'omrComponents/Common/Canvas';

const mapStateToProps = (state) => {
 return {
  sheet: state.app.uniquePath + "/" + state.sheet.current,
  staves: state.app.staveGroup
 }
}

const Sheet = ({ sheet, staves }) => (
 <Canvas className="sheet__image" src={sheet} staves={staves} />
);

export default connect(mapStateToProps)(Sheet);
