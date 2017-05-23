import React from 'react';
import PropTypes from 'prop-types';

import Symbol from 'omrComponents/SheetCrop/Actions/Symbol';
import Action from 'omrComponents/Common/ActionButton';

const Actions = ({
 cropper, crop_normal, crop_half, crop_whole, crop_flat, crop_sharp,
 normal, half, whole, flat, sharp, detect, toEdit,
}) => {
 console.log(cropper);
 return(
  <div id='symbols' className='col-xs-3 content__actions content__actions--sheet'>
   <Symbol name="normal" image={normal.image} onClick={() => {
    console.log(cropper);
    console.log(normal);
    crop_normal(cropper);
   }} />
   <Symbol name="half" image={half.image} onClick={ () => {
    let cropper = cropper;
    crop_half(cropper);
   }} />
   <Symbol name="whole" image={whole.image} onClick={crop_whole} cropper={cropper} />
   <Symbol name="flat" image={flat.image} onClick={crop_flat} cropper={cropper} />
   <Symbol name="sharp" image={sharp.image} onClick={crop_sharp} cropper={cropper} />
   <Action className="action" text="Detect" onClick={()=>{
    let data = {
     normal: normal.coordinates,
     half: half.coordinates,
     whole: whole.coordinates,
     flat: flat.coordinates,
     sharp: sharp.coordinates,
    };
    console.log(cropper);
    detect(data);
   }}/>
   <Action className="action" text="To Edit" onClick={toEdit} />
  </div>
 );
}

Actions.propTypes = {
 corp_normal: PropTypes.func,
 crop_half: PropTypes.func,
 crop_whole: PropTypes.func,
 crop_flat: PropTypes.func,
 crop_sharp: PropTypes.func,
 normal: PropTypes.object,
 half: PropTypes.object,
 whole: PropTypes.object,
 sharp: PropTypes.object,
 flat: PropTypes.object,
 detect: PropTypes.func,
 toEdit: PropTypes.func,
}

export default Actions;
