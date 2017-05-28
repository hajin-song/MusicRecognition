/**
* Container.js
* Container Component for Stave View
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/

import React from 'react';

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
