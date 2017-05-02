import React from 'react';
import { connect } from 'react-redux';

import Symbol from 'omrComponents/SheetView/Symbol';

const mapStateToProps = (state) => {
 return {
  normal: state.symbols.normal,
  half: state.symbols.half,
  whole: state.symbols.whole,
  flat: state.symbols.flat,
  sharp: state.symbols.sharp
 }
}

const mapDispatchToProps = (dispatch) => {
 return {

 }
}

const Symbols = ({normal, half, whole, flat, sharp}) => (
 <div id='symbols' className='symbol-container'>
  <Symbol name="normal" image={normal.image} />
  <Symbol name="half" image={half.image} />
  <Symbol name="whole" image={whole.image} />
  <Symbol name="flat" image={flat.image} />
  <Symbol name="sharp" image={sharp.image} />
 </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Symbols);
