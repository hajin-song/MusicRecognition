import React from 'react';
import SheetContainer from 'omrComponents/SheetView/SheetContainer'
import Form from 'omrComponents/SheetForm/SheetForm';

class App extends React.Component{
 render() {
   return (
    <div className="container-fluid">
     <SheetContainer />
     <Form />
    </div>
   )
 }
}
export default App;
