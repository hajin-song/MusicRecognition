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
  },
  setAsSlur: () => {
   dispatch({ 'type': SheetActions.GROUP_AS_SLUR});
  },
  addArticulation: (symbol) => {
   dispatch({ 'type': SheetActions.ADD_ARTICULATION, 'symbol': symbol });
  }
 });
}

const ActionsContainer = ({ addNewNote, setAsBarNote, addArticulation, setAsSlur }) => (
 <div className='row notes'>
  <div className='col-xs-3 notes__annotate'>
   <button onClick={setAsBarNote} className="btn btn-primary">Bar</button>
   <button onClick={setAsSlur} className="btn btn-primary">Slur</button>
   <button onClick={()=>{ addArticulation('a@a');}} className="btn btn-primary">Fermata</button>
   <button onClick={()=>{ addArticulation('a.');}} className="btn btn-primary">Staccato</button>
  </div>
  <div className='col-xs-9'>
   <NewNote addNewNote={addNewNote} />
   <NoteList />
  </div>
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(ActionsContainer);
