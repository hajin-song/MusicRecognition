import React from 'react';
import { PropTypes } from 'prop-types';


const ActionButton = ({className, text, onClick}) => (
 <div className={'btn btn-primary ' + className } onClick={onClick}>{text}</div>
)

ActionButton.propTypes = {
 text: PropTypes.string,
 onClick: PropTypes.func,
 className: PropTypes.string
};

export default ActionButton;
