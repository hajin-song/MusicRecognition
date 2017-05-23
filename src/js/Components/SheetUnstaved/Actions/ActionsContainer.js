import React from 'react';
import { connect } from 'react-redux';

import SessionActions from 'omrActions/Session';

import Actions from 'omrComponents/SheetUnstaved/Actions/Actions';

const mapStateToProps = (state) => {
 return {

 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
  saveChanges: () => {
    dispatch({
     type: SessionActions.EDIT_UNSTAVED_SHEET,
     data: $('#unstave-canvas')[0].toDataURL('image/png', 1.0)
    });
   },
  toEdit: () => { $('#unstaved').css('left', '100%'); },
 });
}

const ActionsContainer = ({ saveChanges, toEdit })=> {
 return(
  <Actions
   saveChanges={saveChanges}
   toEdit={toEdit}
  />
 );
}


export default connect(mapStateToProps, mapDispatchToProps)(ActionsContainer);
