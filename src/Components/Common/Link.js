import React from 'react';
import PropTypes from 'prop-types';

const Link = ({text, onClick}) => (
 <div className='btn btn-primary' onClick={onClick}>{text}</div>
)

Link.propTypes = {
 text: PropTypes.string,
 onClick: PropTypes.func,
};

export default Link;
