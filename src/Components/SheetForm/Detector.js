import React from 'react';

import DetectorActions from 'omrComponents/SheetForm/Detector/DetectorActions';

class Detector extends React.Component{
 render(){
  return (
   <div className="col-xs-3">
    <form id="form-detect" action="/detect" method="POST">
     <DetectorActions />
     <input type="submit" value="Submit"/>
    </form>
   </div>
  )
 }
}

export default Detector;
