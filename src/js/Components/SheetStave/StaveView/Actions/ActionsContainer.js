import React from 'react';
import { connect } from 'react-redux';

import NoteList from 'omrComponents/SheetStave/StaveView/Actions/NoteList';
import NewNote from 'omrComponents/SheetStave/StaveView/Actions/AddNote';

import SheetActions from 'omrActions/Sheet';

const mapStateToProps = (state) => {
 return {

 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
  addNewNote: () => {
   dispatch({ "type": SheetActions.ADD_NOTE });
  },
  setAsBarNote: () => {
   dispatch({ 'type': SheetActions.GROUP_AS_BAR});
  }
 });
}

const ActionsContainer = ({ addNewNote, setAsBarNote }) => (
 <div className='row notes'>
  <NewNote addNewNote={addNewNote} />
  <div className='notes__annotate'>
   <button onClick={setAsBarNote} className="btn btn-primary">Set As Bar Notes</button>
  </div>
  <NoteList />
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(ActionsContainer);
