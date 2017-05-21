import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Symbol from 'omrComponents/SheetCrop/Symbol';

import SymbolActions from 'omrActions/Symbols';
import SheetActions from 'omrActions/Sheet';

import ActionButton from 'omrComponents/Common/ActionButton';

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
   <div id='symbols' className='col-xs-3 content__actions content__actions--sheet'>
    <Symbol name="normal" image={store.getState().symbols.normal.image} onClick={
     () => {
      store.dispatch({
       type: SymbolActions.CROP_NORMAL_NOTE,
       cropPane: store.getState().crop.cropper.getData(),
       cropImage: store.getState().crop.cropper.getCroppedCanvas().toDataURL('image/jpeg')
      });
    }} />
    <Symbol name="half" image={store.getState().symbols.half.image} onClick={() => {
     store.dispatch({
      type: SymbolActions.CROP_HALF_NOTE,
      cropPane: store.getState().crop.cropper.getData(),
      cropImage: store.getState().crop.cropper.getCroppedCanvas().toDataURL('image/jpeg')
     });
    }}/>
    <Symbol name="whole" image={store.getState().symbols.whole.image} onClick={() => {
     store.dispatch({
      type: SymbolActions.CROP_WHOLE_NOTE,
      cropPane: store.getState().crop.cropper.getData(),
      cropImage: store.getState().crop.cropper.getCroppedCanvas().toDataURL('image/jpeg')
     });
    }}/>
    <Symbol name="flat" image={store.getState().symbols.flat.image} onClick={() => {
     store.dispatch({
      type: SymbolActions.CROP_FLAT,
      cropPane: store.getState().crop.cropper.getData(),
      cropImage: store.getState().crop.cropper.getCroppedCanvas().toDataURL('image/jpeg')
     });
    }}/>
    <Symbol name="sharp" image={store.getState().symbols.sharp.image} onClick={() => {
     store.dispatch({
      type: SymbolActions.CROP_SHARP,
      cropPane: store.getState().crop.cropper.getData(),
      cropImage: store.getState().crop.cropper.getCroppedCanvas().toDataURL('image/jpeg')
     });
    }}/>
    <ActionButton className="action" text="Detect" onClick={()=>{
     let state = store.getState();
     var data = {}
     data["normal"] = state.symbols.normal.coordinates;
     data["half"] = state.symbols.half.coordinates;
     data["whole"] = state.symbols.whole.coordinates;
     data["flat"] = state.symbols.flat.coordinates;
     data["sharp"] = state.symbols.sharp.coordinates;
     $.post('/detect', data, (res)=>{
      let actionUpdateStave = {
       "type": SheetActions.GET_STAVE_GROUPS,
       "staveGroup": res
      };
      store.dispatch(actionUpdateStave);
     });
    }}/>
    <ActionButton className="action" text="To Edit" onClick={()=>{
     $('#crop').css('left', '-100%');
    }}/>
   </div>
  );
 }
}

Symbols.contextTypes = {
 store: PropTypes.object
}

export default Symbols;
