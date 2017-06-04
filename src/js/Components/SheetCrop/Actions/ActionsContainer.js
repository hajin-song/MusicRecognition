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
  normal_rest: state.symbols.normal_rest,
  half_rest: state.symbols.half_rest,
  quaver_rest: state.symbols.quaver_rest,
  semi_quaver_rest: state.symbols.semi_quaver_rest,
  demi_semi_quaver_rest: state.symbols.demi_semi_quaver_rest,
  half: state.symbols.half,
  whole: state.symbols.whole,
  flat: state.symbols.flat,
  sharp: state.symbols.sharp,
 }
}

const mapDispatchToProps = (dispatch) => {
 return ({
  crop: (cropper, symbol) => {
   dispatch({
    type: symbol,
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
 cropper, crop,
 normal, half, whole, flat, sharp,
 normal_rest, half_rest, quaver_rest, semi_quaver_rest, demi_semi_quaver_rest,
 detect, toEdit,
}) => (
 <Actions cropper={cropper}
  crop={crop}
  normal={normal}
  half={half}
  whole={whole}
  normal_rest={normal_rest}
  half_rest={half_rest}
  quaver_rest={quaver_rest}
  semi_quaver_rest={semi_quaver_rest}
  demi_semi_quaver_rest={demi_semi_quaver_rest}
  flat={flat}
  sharp={sharp}
  detect={detect}
  toEdit={toEdit}
 />
);

export default connect(mapStateToProps, mapDispatchToProps)(ActionsContainer);
