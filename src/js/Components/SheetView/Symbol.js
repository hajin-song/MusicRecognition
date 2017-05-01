import React from 'react';
import { PropTypes } from 'prop-types';

const Symbol = ({name, image}) => (
 <div className='symbol'>
  <div className='symbol__image'>
   <img src={image}></img>
  </div>
  <div className='symbol__name'>
   {name}
  </div>
 </div>
)

Symbol.propTypes = {
 name: PropTypes.string,
 image: PropTypes.string
}

export default Symbol;
