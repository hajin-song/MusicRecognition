import React from 'react';
import PropTypes from 'prop-types';

import Cropper from 'omrComponents/SheetView/Cropper';

const MusicSheet = () => (
 <div id='image-preview' className="row" style={{height: '90vh' }}>
  <Cropper />
 </div>
)

export default MusicSheet;
