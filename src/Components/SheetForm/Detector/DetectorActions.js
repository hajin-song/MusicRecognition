import React from 'react';
import PropTypes from 'prop-types';

import SymbolActions from 'omrActions/Symbols';
import Link from 'omrComponents/Common/Link';

class DetectorActions extends React.Component{
 componentDidMount(){
  const { store } = this.context;
  this.unsubscribe = store.subscribe(() =>
    this.forceUpdate()
  );
 }
 componentWillUnmount(){
  this.unsubscribe();
 }
 render(){
  const { store } = this.context;
  return(
   <div>
    <Link text="Normal" onClick={()=>{
     store.dispatch({
      type: SymbolActions.CROP_NORMAL_NOTE,
      cropPane: store.getState().crop
     })
    }} />
    <Link text="Half" onClick={()=>{
     store.dispatch({
      type: SymbolActions.CROP_HALF_NOTE,
      cropPane: store.getState().crop
     })
    }}/>
    <Link text="Whole" onClick={()=>{
     store.dispatch({
      type: SymbolActions.CROP_WHOLE_NOTE,
      cropPane: store.getState().crop
     })
    }}/>
   </div>
  );
 }
}

DetectorActions.contextTypes = {
 store: PropTypes.object
}

export default DetectorActions;
