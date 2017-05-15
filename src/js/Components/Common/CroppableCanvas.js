import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

class CroppableCanvas extends React.Component{
 render() {
  return (
   <img id="image" src={this.props.src} name={this.props.name}>
   </img>
  )
 }
}


CroppableCanvas.propTypes = {
 src: PropTypes.string,
 name: PropTypes.string
}

export default CroppableCanvas;
