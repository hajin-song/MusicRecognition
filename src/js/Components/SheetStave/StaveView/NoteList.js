import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

const mapStateToProps = (state) => {
 return {
  stave: state.sheet.currentStave
 }
}

const mapDispatchToProps =(dispatch) => {
 return ({

 });
}

const NoteList = ({ stave }) => (
 <div className='col-xs-9'>
  {
   stave.stave.notes.sort( (a, b) => {
    return a.x > b.x;
   }).filter( (section) => {
    return stave.section[0] <= section.x && section.x <= stave.section[1];
   }).map( (section) => {
    return section.notes.map( (note) => {
     return (<div key={note.x + "-" + note.y}>{note.x} - {note.y} - {note.note_type} - {note.tail_type} - {note.pitch}</div>);
    })
   })
  }
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);
