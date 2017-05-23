import React from 'react';
import { PropTypes } from 'prop-types';

const SymbolTes = ({name, image, onClick}) => (
 <div className='symbol' onClick={onClick}>
  {name}
  <span className='symbol__image'>
   <img src={image}></img>
  </span>
 </div>
)

SymbolTes.propTypes = {
 name: PropTypes.string,
 image: PropTypes.string,
 onClick: PropTypes.func,
}

export default SymbolTes;
