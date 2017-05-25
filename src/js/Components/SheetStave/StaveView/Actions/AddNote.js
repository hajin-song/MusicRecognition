import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

class Note extends React.Component{
 render(){
  return(
   <div className='notes__add'>
     <select id='note-pitch'>
      <option value='a'>A</option>
      <option value='b'>B</option>
      <option value='c'>C</option>
      <option value='d'>D</option>
      <option value='e'>E</option>
      <option value='f'>F</option>
      <option value='g'>G</option>
      <option value='r'>Rest</option>
     </select>
     <input id='note-octave' type='number'/>
     <select id='note-duration'>
      <option value='w'>Semibreve</option>
      <option value='h'>Minim</option>
      <option value='q'>Crotchet</option>
      <option value='8'>Quaver</option>
      <option value='16'>Semi-Quaver</option>
      <option value='32'>Demi-Semi-Quaver</option>
     </select>
     <button onClick={this.props.addNewNote} className="btn btn-primary">Add</button>
   </div>
  )
 }
}


export default Note;
