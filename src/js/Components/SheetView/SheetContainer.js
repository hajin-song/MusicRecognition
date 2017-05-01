import React from 'react';
import { PropTypes } from 'prop-types';

import Sheet from 'omrComponents/SheetView/Sheet';
import Symbols from 'omrComponents/SheetView/Symbols';
import CropperActions from 'omrActions/Cropper';

class SheetContainer extends React.Component{
 componentDidMount(){
  const { store } = this.context;
  $("#image").on('load', function(){
   var state = store.getState();
   if (Object.getOwnPropertyNames(state.crop.cropper).length > 0){
    state.crop.cropper.destroy();
   }
   store.dispatch({
    type: CropperActions.CROP_CHANGED,
    cropper: new Cropper(document.getElementById("image")),
   });
  });
 }
 render(){
  return (
   <div id='image-preview' className="row">
    <Symbols />
    <Sheet />
   </div>
  );
 }
}

SheetContainer.contextTypes = {
 store: PropTypes.object
}

export default SheetContainer;
