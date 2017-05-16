import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import CroppableCanvas from 'omrComponents/Common/CroppableCanvas';

const mapStateToProps = (state) => {
 return {
  sheet: state.app.uniquePath + "/" + state.sheet.current,
  original: state.sheet.sheet
 }
}

const Sheet = ({sheet, original }) => (
 <CroppableCanvas src={sheet} name={original} />
);

export default connect(mapStateToProps)(Sheet);
