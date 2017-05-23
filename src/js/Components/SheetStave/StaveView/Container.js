import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import SheetActions from 'omrActions/Sheet';

import OriginalStave from 'omrComponents/SheetStave/StaveView/Original';
import DetectedStave from 'omrComponents/SheetStave/StaveView/Detected';

import Actions from 'omrComponents/SheetStave/StaveView/Actions/ActionsContainer';

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
        <Actions />
       </div>
     </div>
   </div>
 </div>
);


export default StaveContainer;
