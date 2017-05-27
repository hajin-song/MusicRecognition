import React from 'react';
import { PropTypes } from 'prop-types';

import Sheet from 'omrComponents/SheetExport/Sheet';
import Actions from 'omrComponents/SheetExport/Actions/ActionsContainer';

const SheetContainer = () => {
 return (
  <div id='export' className="row content content--sheet">
   <Actions />
   <Sheet />
  </div>
 );
}

export default SheetContainer;
