import React from 'react';

import { connect } from 'react-redux';

import Annotator from 'omrComponents/SheetExport/Actions/Annotator';

import SheetActions from 'omrActions/Sheet';

const mapStateToProps = (state) => {
 return {

 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
  annotate: () => {
   $('#export-annotator').toggle();
   dispatch({
    type: SheetActions.ANNOTATE,
    text: $('#annotate-value').val()
   });
  }
 });
}

const AnnotatorContainer = ({annotate}) => (
 <Annotator annotate={annotate} inputID={'annotate-value'} containerID={'export-annotator'} />
);

export default connect(mapStateToProps, mapDispatchToProps)(AnnotatorContainer);
