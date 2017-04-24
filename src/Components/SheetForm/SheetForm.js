import React from 'react';

import Uploader from 'omrComponents/SheetForm/Uploader';
import Switcher from 'omrComponents/SheetForm/Switcher';
import Detector from 'omrComponents/SheetForm/Detector';

const SheetForm = ({ onClick }) => (
 <div className="row" style={{height: '10vh' }}
  >
  <Uploader />
  <Switcher />
  <Detector />
 </div>
)


export default SheetForm;
