import React from 'react';
import { PropTypes } from 'prop-types';

import SheetActions from 'omrActions/Sheet';


class Loader extends React.Component{
 componentDidMount() {
  $('#sheet-loader').modal('show');
  $("#form-stave").on("submit", (e) => {
   e.preventDefault();
   this.props.imageUploaded(this.props.uuid);
  });
 }

 render(){
  return (
   <form id='form-stave' action='/' method='POST' encType='multipart/form-data'>
     <div>
      <input type="file" name="musicSheet" id="musicSheet" />
     </div>
     <input type="submit" value="Submit"/>
    </form>
  );
 }
}

Loader.PropTypes = {
 imageUploaded: PropTypes.func,
}

export default Loader;
