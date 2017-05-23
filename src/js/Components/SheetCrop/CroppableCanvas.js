import React from 'react';

import { PropTypes } from 'prop-types';

const CroppableCanvas = ({sheet, reloadCropper}) => {
 console.log("RENDERING CROP CANVAS");
 return (
  <div className='col-xs-9 content__image'>
   <img id="image-crop" src={sheet} onLoad={ () => { reloadCropper(); } }>
   </img>
  </div>
 );
}

CroppableCanvas.propTypes = {
 sheet: PropTypes.string,
 reloadCropper: PropTypes.func,
}

export default CroppableCanvas;
