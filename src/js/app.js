import React from 'react';
import StaveMode from 'omrComponents/SheetStave/Container';
import CropMode from 'omrComponents/SheetCrop/Container';
import UnstavedMode from 'omrComponents/SheetUnstaved/Container';


class App extends React.Component{
 render() {
   return (
    <div className="container-fluid">
     <StaveMode />
     <CropMode />
     <UnstavedMode />
    </div>
   )
 }
}
export default App;
