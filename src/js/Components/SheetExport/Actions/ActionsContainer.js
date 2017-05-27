import React from 'react';
import { connect } from 'react-redux';

import SheetActions from 'omrActions/Sheet';

import Actions from 'omrComponents/SheetExport/Actions/Actions';

const mapStateToProps = (state) => {
 return {

 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
  toEdit: () => { $('#export').css('left', '100%'); },
  transpose: () => {
   var toneValue = prompt("", "Semitone Value")
   if(toneValue != null){
    dispatch({
     type: SheetActions.TRANSPOSE,
     tone: parseFloat(toneValue)
    })
   }
  }
 });
}

const ActionsContainer = ({ toEdit, transpose })=> {
 return(
  <Actions
   toEdit={toEdit}
   transpose={transpose}
  />
 );
}


export default connect(mapStateToProps, mapDispatchToProps)(ActionsContainer);
