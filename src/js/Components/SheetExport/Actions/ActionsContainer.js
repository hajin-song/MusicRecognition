import React from 'react';
import { connect } from 'react-redux';

import SheetActions from 'omrActions/Sheet';

import Actions from 'omrComponents/SheetExport/Actions/Actions';

const mapStateToProps = (state) => {
 return {

 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
  toMain: () => { $('#export').css('left', '100%'); },
  transpose: () => {
   var toneValue = prompt("", "Semitone Value")
   if(toneValue != null){
    dispatch({
     type: SheetActions.TRANSPOSE,
     tone: parseFloat(toneValue)
    })
   }
  },
  download: () => {
   var sheet = document.getElementById('export-canvas');
   var sheetAnnotation = document.getElementById('export-canvas-action');
   var contextSheet = sheet.getContext('2d');
   var contextAnnoateSheet = sheetAnnotation.getContext('2d');

   contextSheet.drawImage(sheetAnnotation, 0, 0);

   var imgData=contextSheet.getImageData(0,0,sheet.width,sheet.height);
   var data=imgData.data;
   for(var i=0;i<data.length;i+=4){
       if(data[i+3] == 0){
           data[i]=255;
           data[i+1]=255;
           data[i+2]=255;
           data[i+3]=255;
       }
   }
   contextSheet.putImageData(imgData,0,0);

   var dataURL = sheet.toDataURL("image/png");
   var link = document.createElement('a');
   link.download = "transposed.png";
   link.href = dataURL.replace("image/png", "image/octet-stream");
   link.click();
  }
 });
}

const ActionsContainer = ({ toMain, transpose, download })=> {
 return(
  <Actions
   toMain={toMain}
   transpose={transpose}
   download={download}
  />
 );
}


export default connect(mapStateToProps, mapDispatchToProps)(ActionsContainer);
