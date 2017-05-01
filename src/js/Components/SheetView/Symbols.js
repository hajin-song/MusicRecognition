import React from 'react';
import { connect } from 'react-redux';

import Symbol from 'omrComponents/SheetView/Symbol';

const mapStateToProps = (state) => {
 return {
  normal: state.symbols.normal,
  half: state.symbols.half,
  whole: state.symbols.whole
 }
}

const mapDispatchToProps = (dispatch) => {
 return {

 }
}

const Symbols = ({normal, half, whole}) => (
 <div id='symbols' className='symbol-container'>
  <Symbol name="normal" image={normal.image} />
  <Symbol name="half" image={half.image} />
  <Symbol name="whole" image={whole.image} />
 </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Symbols);
