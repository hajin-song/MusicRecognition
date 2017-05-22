import React from 'react';
import { PropTypes } from 'prop-types';

import Sheet from 'omrComponents/SheetStave/Sheet';
import Loader from 'omrComponents/SheetStave/Loader/LoaderContainer';
import Actions from 'omrComponents/SheetStave/Actions/ActionsContainer';
import StaveView from 'omrComponents/SheetStave/StaveView/Container';


const SheetContainer = () => (
 <div id='staves' className="row content content--sheet">
  <Actions />
  <Sheet />
  <Loader />
  <StaveView />
 </div>
);


export default SheetContainer;
