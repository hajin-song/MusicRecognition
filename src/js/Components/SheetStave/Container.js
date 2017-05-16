import React from 'react';
import { PropTypes } from 'prop-types';

import Sheet from 'omrComponents/SheetStave/Sheet';
import Loader from 'omrComponents/SheetStave/Loader';
import Actions from 'omrComponents/SheetStave/Actions';
import StaveView from 'omrComponents/SheetStave/StaveView/Container';
class SheetContainer extends React.Component{
 componentDidMount(){
  const { store } = this.context;
  console.log(store.getState());
 }
 render(){
  return (
   <div id='staves' className="row sheet">
    <Actions />
    <Sheet />
    <Loader />
    <StaveView />
   </div>
  );
 }
}

SheetContainer.contextTypes = {
 store: PropTypes.object
}

export default SheetContainer;
