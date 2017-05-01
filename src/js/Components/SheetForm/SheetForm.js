import React from 'react';

import Uploader from 'omrComponents/SheetForm/Uploader';
import Switcher from 'omrComponents/SheetForm/Switcher';
import Detector from 'omrComponents/SheetForm/Detector';

const SheetForm = ({ onClick }) => (
 <div id="sheet-form" className="row">
  <Uploader />
  <Switcher />
  <Detector />
 </div>
)

export default SheetForm;
