import React from 'react';
import { PropTypes } from 'prop-types';

import SheetActions from 'omrActions/MusicSheet';

class Uploader extends React.Component{
 componentDidMount() {
  const { store } = this.context;
  $("#form-stave").on("submit", function(e){
   e.preventDefault();
   $(this).ajaxSubmit({
    success: function(res){
     var action = {
      "type": SheetActions.UPLOAD_SHEET,
      "sheet": $("#form-stave")[0][0].files[0]
     };
     store.dispatch(action);
    },
    error: function(err){ console.log(err); }
   });
  });
 }
 render() {
  return (
   <div className='col-xs-3'>
   <form id='form-stave' action='/' method='POST' encType='multipart/form-data'>
     <div>
      <input type="file" name="musicSheet" id="musicSheet" />
     </div>
     <input type="submit" value="Submit"/>
    </form>
  </div>
  )
 }
}

Uploader.contextTypes = {
 store: PropTypes.object
}

export default Uploader;
