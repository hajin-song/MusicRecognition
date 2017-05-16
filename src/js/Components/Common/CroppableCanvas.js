import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import CropperActions from 'omrActions/Cropper';

class CroppableCanvas extends React.Component{
 componentDidMount(){
  const { store } = this.context;
  console.log(store);
  $("#image-crop").on('load', function(){
   store.dispatch({
    type: CropperActions.CROP_CHANGED
   });
  });
 }
 componentDidUpdate(prevProps, prevState){
  console.log("whue");
  console.log(this.props.src);
 }
 render() {
  return (
   <div className='col-xs-9 sheet__canvas sheet__canvas--crop'>
    <img id="image-crop" src={this.props.src}>
    </img>
   </div>
  )
 }
}


CroppableCanvas.propTypes = {
 src: PropTypes.string,
}

CroppableCanvas.contextTypes = {
 store: PropTypes.object
}

export default CroppableCanvas;
