import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';



class Note extends React.Component{
 componentDidMount(){
  if(this.props.clickedNotes.indexOf(this.props.note.id) != -1){
   $('#note-'+this.props.note.id).css("background-color", "red");
  }
  $('#note-pitch-' + this.props.note.id).val(this.props.note.pitch);
  $('#note-octave-' + this.props.note.id).val(this.props.note.octave);
  $('#note-duration-' + this.props.note.id).val(this.props.note.duration);
  $('#note-' + this.props.note.id).on('click', (e) => {
   if(e.ctrlKey){
    this.props.controlClickNote(this.props.note.id);
   }
  });
  $('#note-remove-' + this.props.note.id).on('click', () => {
   this.props.removeNote(this.props.note.id);
  });
  $('#note-pitch-' + this.props.note.id +
   ',#note-octave-' + this.props.note.id +
   ',#note-duration-' + this.props.note.id).on('change', () => {
   this.props.editNote(this.props.note.id);
  });
 }
 componentDidUpdate(prevProps, prevState){
  if(this.props.clickedNotes.indexOf(this.props.note.id) != -1){
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
 clickedNotes: PropTypes.array,
 note: PropTypes.object,
 removeNote: PropTypes.func,
 editNote: PropTypes.func,
 controlClickNote: PropTypes.func,
}

export default Note;
