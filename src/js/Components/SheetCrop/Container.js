import React from 'react';
import { PropTypes } from 'prop-types';

import Sheet from 'omrComponents/SheetCrop/Sheet';
import Actions from 'omrComponents/SheetCrop/Actions/ActionsContainer';

class SheetContainer extends React.Component{
 render(){
  return (
   <div id='crop' className="row content content--sheet">
    <Actions />
    <Sheet />
   </div>
  );
 }
}

SheetContainer.contextTypes = {
 store: PropTypes.object
}

export default SheetContainer;
