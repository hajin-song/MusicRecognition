import React from 'react';
import { PropTypes } from 'prop-types';

import Sheet from 'omrComponents/SheetCrop/Sheet';
import SheetLoader from 'omrComponents/SheetStave/Loader';
import Symbols from 'omrComponents/SheetCrop/Symbols';

class SheetContainer extends React.Component{
 componentDidMount(){
  const { store } = this.context;
  console.log(store.getState());
 }
 render(){
  return (
   <div id='crop' className="row sheet">
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
