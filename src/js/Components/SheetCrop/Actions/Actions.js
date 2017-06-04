import React from 'react';
import PropTypes from 'prop-types';

import Symbol from 'omrComponents/SheetCrop/Actions/Symbol';
import Action from 'omrComponents/Common/ActionButton';

import SymbolActions from 'omrActions/Symbols';

const Actions = ({
 cropper, crop,
 normal, half, whole,
 normal_rest, half_rest, quaver_rest, semi_quaver_rest, demi_semi_quaver_rest,
 flat, sharp, detect, toEdit,
}) => {
 return(
  <div id='symbols' className='col-xs-3 content__actions content__actions--sheet'>
   <Symbol name="normal" image={normal.image} onClick={() => {
    crop(cropper, SymbolActions.CROP_NORMAL_NOTE);
   }} />
   <Symbol name="half" image={half.image} onClick={ () => {
    crop(cropper, SymbolActions.CROP_HALF_NOTE);
   }} />
   <Symbol name="whole" image={whole.image} onClick={ () => {
    crop(cropper, SymbolActions.CROP_WHOLE_NOTE);
   }} />
   <Symbol name="normal rest" image={normal_rest.image} onClick={ () => {
    crop(cropper, SymbolActions.CROP_NORMAL_REST);
   }} />
   <Symbol name="half rest" image={half_rest.image} onClick={ () => {
    crop(cropper, SymbolActions.CROP_HALF_REST);
   }} />
   <Symbol name="quaver rest" image={quaver_rest.image} onClick={ () => {
    crop(cropper, SymbolActions.CROP_QUAVER_REST);
   }} />
   <Symbol name="semi quaver rest" image={semi_quaver_rest.image} onClick={ () => {
    crop(cropper, SymbolActions.CROP_SEMI_QUAVER_REST);
   }} />
   <Symbol name="demi semi quaver rest" image={demi_semi_quaver_rest.image} onClick={ () => {
    crop(cropper, SymbolActions.CROP_DEMI_SEMI_QUAVER_REST);
   }} />
   <Symbol name="flat" image={flat.image} onClick={ () => {
    crop(cropper, SymbolActions.CROP_FLAT);
   }} />
   <Symbol name="sharp" image={sharp.image} onClick={ () => {
    crop(cropper, SymbolActions.CROP_SHARP);
   }} />
   <Action className="action" text="Detect" onClick={()=>{
    let data = {
     normal: normal.coordinates,
     half: half.coordinates,
     whole: whole.coordinates,
     flat: flat.coordinates,
     sharp: sharp.coordinates,
     normal_rest: normal_rest.coordinates,
     half_rest: half_rest.coordinates,
     quaver_rest: quaver_rest.coordinates,
     semi_quaver_rest: semi_quaver_rest.coordinates,
     demi_semi_quaver_rest: demi_semi_quaver_rest.coordinates,
    };
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
