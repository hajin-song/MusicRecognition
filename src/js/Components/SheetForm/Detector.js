import React from 'react';
import { PropTypes } from 'prop-types';
import DetectorActions from 'omrComponents/SheetForm/Detector/DetectorActions';

class Detector extends React.Component{
 componentDidMount(){
  const { store } = this.context;
  $("#form-detect-submit").on("click", ()=>{
   let state = store.getState();
   var data = {}
   data["normal"] = state.symbols.normal.coordinates;
   data["half"] = state.symbols.half.coordinates;
   data["whole"] = state.symbols.whole.coordinates;
   data["flat"] = state.symbols.flat.coordinates;
   data["sharp"] = state.symbols.sharp.coordinates;
   $.post('/detect', data, (res)=>{
    console.log(res);
   });
  });

 }
 render(){
  return (
   <div className="col-xs-3">
    <DetectorActions />
    <div id="form-detect-submit" className="btn btn-primary">Detect</div>
   </div>
  )
 }
}

Detector.contextTypes = {
 store: PropTypes.object
}

export default Detector;
