import React from 'react';
import { connect } from 'react-redux';

import SymbolActions from 'omrActions/Symbols';
import SheetActions from 'omrActions/Sheet';

import Actions from 'omrComponents/SheetCrop/Actions/Actions';

const mapStateToProps = (state) => {
 return {
  sheet: state.session.original,
  cropper: state.crop.cropper,
  normal: state.symbols.normal,
  half: state.symbols.half,
  whole: state.symbols.whole,
  flat: state.symbols.flat,
  sharp: state.symbols.sharp,
 }
}

const mapDispatchToProps = (dispatch) => {
 return ({
  crop_normal: (cropper) => {
   dispatch({
    type: SymbolActions.CROP_NORMAL_NOTE,
    crop_pane: cropper.getData(),
    crop_image: cropper.getCroppedCanvas().toDataURL('image/jpeg')
   });
  },
  crop_half: (cropper) => {
   dispatch({
    type: SymbolActions.CROP_HALF_NOTE,
    crop_pane: cropper.getData(),
    crop_image: cropper.getCroppedCanvas().toDataURL('image/jpeg')
   });
  },
  crop_whole: (cropper) => {
   dispatch({
    type: SymbolActions.CROP_WHOLE_NOTE,
    crop_pane: cropper.getData(),
    crop_image: cropper.getCroppedCanvas().toDataURL('image/jpeg')
   });
  },
  crop_flat: (cropper) => {
   dispatch({
    type: SymbolActions.CROP_FLAT,
    crop_pane: cropper.getData(),
    crop_image: cropper.getCroppedCanvas().toDataURL('image/jpeg')
   });
  },
  crop_sharp: (cropper) => {
   dispatch({
    type: SymbolActions.CROP_SHARP,
    crop_pane: cropper.getData(),
    crop_image: cropper.getCroppedCanvas().toDataURL('image/jpeg')
   });
  },
  detect: (data) => {
   $.post('/detect', data, (res)=>{
    let actionUpdateStave = { "type": SheetActions.GET_STAVE_GROUPS, "stave_group": res };
    dispatch(actionUpdateStave);
   });
  },
  toEdit: () => {
   $('#crop').css('left', '-100%');
  },
 });
}

const ActionsContainer = ({
 cropper, crop_normal, crop_half, crop_whole, crop_flat, crop_sharp,
 normal, half, whole, flat, sharp,
 detect, toEdit,
}) => (
 <Actions cropper={cropper}
  crop_normal={crop_normal}
  crop_half={crop_half}
  crop_whole={crop_whole}
  crop_flat={crop_flat}
  crop_sharp={crop_sharp}
  normal={normal}
  half={half}
  whole={whole}
  flat={flat}
  sharp={sharp}
  detect={detect}
  toEdit={toEdit}
 />
);

export default connect(mapStateToProps, mapDispatchToProps)(ActionsContainer);
