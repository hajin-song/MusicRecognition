import React from 'react';

import SheetActions from 'omrActions/MusicSheet';

import Link from 'omrComponents/SheetForm/Link';

import PropTypes from 'prop-types';

class SwitcherLink extends React.Component{
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
    <Link text="Original" onClick={()=>{ store.dispatch({
      type: SheetActions.ORIGINAL_SHEET
     })
    }} />
    <Link text="Cropped" onClick={()=>{ store.dispatch({
      type: SheetActions.UNSTAVED_SHEET
     })
    }}/>
    <Link text="Detected" onClick={()=>{ store.dispatch({
      type: SheetActions.DETECTED_SHEET
     })
    }}/>
   </div>
  );
 }
}

SwitcherLink.contextTypes = {
 store: PropTypes.object
}

export default SwitcherLink;
