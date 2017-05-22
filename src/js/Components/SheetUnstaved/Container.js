import React from 'react';
import { PropTypes } from 'prop-types';

import Sheet from 'omrComponents/SheetUnstaved/Sheet';
import Actions from 'omrComponents/SheetUnstaved/Actions/ActionsContainer';

const SheetContainer = () => {
 return (
  <div id='unstaved' className="row content content--sheet">
   <Actions />
   <Sheet />
  </div>
 );
}

export default SheetContainer;
