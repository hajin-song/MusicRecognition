import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import SheetActions from 'omrActions/Sheet';
import SessionActions from 'omrActions/Session';

import Loader from 'omrComponents/SheetStave/Loader/Loader';

function getImageURL(src, dispatch, actionType){
 let image = new Image();
 let c = document.createElement('canvas'),
     ctx = c.getContext('2d');
 image.onload = () => {
  c.width = image.width;
  c.height = image.height;

  ctx.drawImage(image, 0, 0, image.width, image.height);
  let dataURL = c.toDataURL();
  dispatch({
   "type": actionType,
   "data": dataURL
  })
 }
 image.src = "/" + src;
}

const mapStateToProps = (state) => {
 return {
  uuid: state.session.unique_path,
 }
}



const mapDispatchToProps = (dispatch) => {
 return ({
  imageUploaded: (uuid) => {
   $('#sheet-loader').modal('hide');
   $("#form-stave").ajaxSubmit({
    success: function(res){
      $.get("/session", (data) => {
       getImageURL(uuid + "/original.png", dispatch, SessionActions.ORIGINAL_SHEET);
       getImageURL(uuid + "/sheet_without_staves.png", dispatch, SessionActions.UNSTAVED_SHEET);
       dispatch({"type": SheetActions.GET_STAVE_GROUPS, "stave_group": JSON.parse(data["stave_group"])});
      });
    },
    error: function(err){ console.log(err); }
   });
  },

 });
}

const LoaderContainer = ( { uuid, imageUploaded } ) => (
 <div id='sheet-loader' className="modal fade">
   <div className="modal-dialog" role="document">
     <div className="modal-content">
       <div className="modal-header">
         <h5 className="modal-title">Load Image</h5>
       </div>
       <div className="modal-body">
        <Loader uuid={uuid} imageUploaded={imageUploaded} />
       </div>
     </div>
   </div>
 </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(LoaderContainer);
