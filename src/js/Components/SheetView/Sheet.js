import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
 console.log(state);
 return {
  sheet: state.session.uniquePath + "/" + state.sheet.current,
  original: state.sheet.sheet
 }
}

const mapDispatchToProps = (dispatch) => {
 return {

 }
}

const Sheet = ({sheet, original, reloadCropper}) => (
 <img id="image" src={sheet} name={original.name}>
 </img>
);

export default connect(mapStateToProps, mapDispatchToProps)(Sheet);
