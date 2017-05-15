import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Symbol from 'omrComponents/Common/Symbol';
import SymbolActions from 'omrActions/Symbols';

class Symbols extends React.Component{
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
   <div id='symbols' className='symbol-container'>
    <Symbol name="normal" image={store.getState().symbols.normal.image} onClick={
     () => {
      store.dispatch({
       type: SymbolActions.CROP_NORMAL_NOTE,
       cropPane: store.getState().crop.cropper.getData(),
       cropImage: store.getState().crop.cropper.getCroppedCanvas().toDataURL('image/jpeg')
      })
    }} />
    <Symbol name="half" image={store.getState().symbols.half.image} onClick={() => {console.log("!!"); }}/>
    <Symbol name="whole" image={store.getState().symbols.whole.image} onClick={() => {console.log("!!"); }}/>
    <Symbol name="flat" image={store.getState().symbols.flat.image} onClick={() => {console.log("!!"); }}/>
    <Symbol name="sharp" image={store.getState().symbols.sharp.image} onClick={() => {console.log("!!"); }}/>
   </div>
  );
 }
}

Symbols.contextTypes = {
 store: PropTypes.object
}

export default Symbols;
