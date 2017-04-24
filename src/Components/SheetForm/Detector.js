import React from 'react';

const Detector = () => (
 <div className="col-xs-3">
  <form id="form-detect" action="/detect" method="POST">
   <div>
    <input type="text" name="normalNote" id="normalNote" />
    <input type="text" name="halfNote" id="halfNote" />
    <input type="text" name="wholteNote" id="wholteNote" />
   </div>
   <input type="submit" value="Submit"/>
  </form>
 </div>
)

export default Detector;
