import React from 'react';
import { connect } from 'react-redux';

import SheetActions from 'omrActions/Sheet';

import Actions from 'omrComponents/SheetStave/Actions/Actions';

const mapStateToProps = (state) => {
 return {
  sheet: state.session.original,
  staves: state.sheet.stave_group,
  clicked_staves: state.sheet.clicked_staves
 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
  mergeStave: () => { dispatch({ type: SheetActions.MERGE_STAVE_SECTIONS }); },
  toEditUnstaved: () => { $('#unstaved').css('left', '0'); },
  toDetect: () => { $('#crop').css('left', '0'); },
  toExport: () => { $('#export').css('left', '0'); },
 });
}

const ActionsContainer = ({ mergeStave, toEditUnstaved, toDetect, toExport })=> {
 return(
  <Actions
   mergeStave={mergeStave}
   toDetect={toDetect}
   toEditUnstaved={toEditUnstaved}
   toExport={toExport}
  />
 );
}


export default connect(mapStateToProps, mapDispatchToProps)(ActionsContainer);
