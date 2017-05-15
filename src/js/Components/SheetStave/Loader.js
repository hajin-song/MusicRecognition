import React from 'react';
import { PropTypes } from 'prop-types';

import SheetActions from 'omrActions/MusicSheet';
import AppACtions from 'omrActions/App';
import MusicSheet from 'omrActions/MusicSheet';

class Uploader extends React.Component{
 componentDidMount() {
  const { store } = this.context;
  $('#sheet-loader').modal('show');
  $("#form-stave").on("submit", function(e){
   e.preventDefault();
   $('#sheet-loader').modal('hide');
   $('#staves div').css('display', 'block');
   $(this).ajaxSubmit({
    success: function(res){
     let actionuploadedImage = {
      "type": MusicSheet.UPLOAD_SHEET
     };
     store.dispatch(actionuploadedImage);
      $.get("/session", (data) => {
       let actionUpdateStave = {
        "type": AppACtions.GET_STAVE_GROUPS,
        "staveGroup": JSON.parse(data["staveGroup"])
       };
       store.dispatch(actionUpdateStave);
      });
    },
    error: function(err){ console.log(err); }
   });
  });
 }
 render() {
  return (
   <div id='sheet-loader' className="modal fade">
     <div className="modal-dialog" role="document">
       <div className="modal-content">
         <div className="modal-header">
           <h5 className="modal-title">Load Image</h5>
         </div>
         <div className="modal-body">
          <form id='form-stave' action='/' method='POST' encType='multipart/form-data'>
            <div>
             <input type="file" name="musicSheet" id="musicSheet" />
            </div>
            <input type="submit" value="Submit"/>
           </form>
         </div>
       </div>
     </div>
   </div>
  )
 }
}

Uploader.contextTypes = {
 store: PropTypes.object
}

export default Uploader;
