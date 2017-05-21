import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SheetActions from 'omrActions/Sheet';

import OriginalStave from 'omrComponents/SheetStave/StaveView/Original';
import DetectedStave from 'omrComponents/SheetStave/StaveView/Detected';

import NoteList from 'omrComponents/SheetStave/StaveView/NoteList';

const StaveContainer = () => (
 <div id='stave-viewer' className="modal fade">
   <div className="modal-dialog" role="document">
     <div className="modal-content">
       <div className="modal-header">
         <h5 className="modal-title">Stave View</h5>
       </div>
       <div className="modal-body container-fluid">
        <OriginalStave/>
        <DetectedStave />
        <NoteList />
       </div>
     </div>
   </div>
 </div>
);


export default StaveContainer;
