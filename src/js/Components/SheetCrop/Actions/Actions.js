import React from 'react';
import PropTypes from 'prop-types';

import Symbol from 'omrComponents/SheetCrop/Actions/Symbol';
import Action from 'omrComponents/Common/ActionButton';

import SymbolActions from 'omrActions/Symbols';

const Actions = ({
 cropper, crop,
 normal, half, whole,
 normal_rest, half_rest, quaver_rest, semi_quaver_rest, demi_semi_quaver_rest,
 flat, sharp, detect, toMain,
}) => {
 return(
  <div id='symbols' className='col-xs-3 content__actions content__actions--sheet'>
   <Symbol name="Crochet Note" image={normal.image} onClick={(e) => {
    crop(cropper, SymbolActions.CROP_NORMAL_NOTE, e);
   }} />
   <Symbol name="Minim Note" image={half.image} onClick={ (e) => {
    crop(cropper, SymbolActions.CROP_HALF_NOTE, e);
   }} />
   <Symbol name="Semibreve Note" image={whole.image} onClick={ (e) => {
    crop(cropper, SymbolActions.CROP_WHOLE_NOTE, e);
   }} />
   <Symbol name="Crochet Rest" image={normal_rest.image} onClick={ (e) => {
    crop(cropper, SymbolActions.CROP_NORMAL_REST, e);
   }} />
   <Symbol name="Minim Rest" image={half_rest.image} onClick={ (e) => {
    crop(cropper, SymbolActions.CROP_HALF_REST, e);
   }} />
   <Symbol name="Semibreve Rest" image={quaver_rest.image} onClick={ (e) => {
    crop(cropper, SymbolActions.CROP_QUAVER_REST, e);
   }} />
   <Symbol name="Semi Quaver Rest" image={semi_quaver_rest.image} onClick={ (e) => {
    crop(cropper, SymbolActions.CROP_SEMI_QUAVER_REST, e);
   }} />
   <Symbol name="Demi Semi Quaver Rest" image={demi_semi_quaver_rest.image} onClick={ (e) => {
    crop(cropper, SymbolActions.CROP_DEMI_SEMI_QUAVER_REST, e);
   }} />
   <Symbol name="Flat" image={flat.image} onClick={ (e) => {
    crop(cropper, SymbolActions.CROP_FLAT, e);
   }} />
   <Symbol name="Sharp" image={sharp.image} onClick={ (e) => {
    crop(cropper, SymbolActions.CROP_SHARP, e);
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
   <Action className="action" text="To Main" onClick={toMain} />
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
 toMain: PropTypes.func,
}

export default Actions;
