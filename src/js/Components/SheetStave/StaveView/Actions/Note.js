/**
* Note.js
* Component for Note Item
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/

import React from 'react';

import { PropTypes } from 'prop-types';

class Note extends React.Component{
 componentDidMount(){
  console.log(this.props.note);
  // Fill edit form fields with note
  if(this.props.note.type === "n"){
   $('#note-pitch-' + this.props.note.id).val(this.props.note.pitch);
  }else{
   $('#note-pitch-' + this.props.note.id).val(this.props.note.type);
  }
  $('#note-accidental-' + this.props.note.id).val(this.props.note.accidental);
  $('#note-octave-' + this.props.note.id).val(this.props.note.octave);
  $('#note-duration-' + this.props.note.id).val(this.props.note.duration);

  // Mark as clicked
  if(this.props.clicked_notes.indexOf(this.props.note.id) != -1){
   $('#note-'+this.props.note.id).css("background-color", "red");
  }

  // Save note as being clicked
  $('#note-' + this.props.note.id).on('click', (e) => {
   if(e.ctrlKey){
    this.props.controlClickNote(this.props.note.id);
   }
  });

  // remove note from section
  $('#note-remove-' + this.props.note.id).on('click', () => {
   this.props.removeNote(this.props.note.id);
  });

  // Edit note
  $('#note-pitch-' + this.props.note.id +
   ',#note-octave-' + this.props.note.id +
   ',#note-duration-' + this.props.note.id +
   ',#note-accidental-' + this.props.note.id ).on('change', () => {
   this.props.editNote(this.props.note.id);
  });
 }

 componentDidUpdate(prevProps, prevState){
  if(this.props.clicked_notes.indexOf(this.props.note.id) != -1){
   $('#note-'+this.props.note.id).css("background-color", "red");
  }else{
   $('#note-'+this.props.note.id).css("background-color", "");
  }
 }
 render(){
  return (
   <div id={'note-'+this.props.note.id} className='notes__item'>
    <select id={'note-pitch-'+this.props.note.id}>
     <option value='a'>A</option>
     <option value='b'>B</option>
     <option value='c'>C</option>
     <option value='d'>D</option>
     <option value='e'>E</option>
     <option value='f'>F</option>
     <option value='g'>G</option>
     <option value='r'>Rest</option>
    </select>
    <select id={'note-accidental-'+this.props.note.id}>
     <option value=''>Natural</option>
     <option value='b'>b</option>
     <option value='#'>#</option>
     <option value='##'>##</option>
    </select>
    <input id={'note-octave-'+this.props.note.id} type='number' />
    <select id={'note-duration-'+this.props.note.id}>
     <option value='w'>Semibreve</option>
     <option value='h'>Minim</option>
     <option value='q'>Crotchet</option>
     <option value='8'>Quaver</option>
     <option value='16'>Semi-Quaver</option>
     <option value='32'>Demi-Semi-Quaver</option>
    </select>
    <button id={'note-remove-'+this.props.note.id} className="btn btn-warning">Remove</button>
   </div>
  );
 }
}

Note.propTypes = {
 clicked_notes: PropTypes.array,
 note: PropTypes.object,
 removeNote: PropTypes.func,
 editNote: PropTypes.func,
 controlClickNote: PropTypes.func,
}

export default Note;
