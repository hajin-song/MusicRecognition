import React from 'react';
import PropTypes from 'prop-types';

import ImageActions from 'omrActions/Image';

import Action from 'omrComponents/Common/ActionButton';

class Actions extends React.Component{
 componentDidMount(){
  const { store } = this.context;
  this.unsubscribe = store.subscribe(() =>
    this.forceUpdate()
  );
 }
 componentWillUnmount(){
  this.unsubscribe();
 }
 render(){
  const { store } = this.context;
  return(
   <div className="col-xs-3 content__actions content__actions--sheet">
    <Action className="action" text="To Edit" onClick={() => {
      $('#unstaved').css('left', '100%');
     }
    }/>
    <Action className="action" text="Save Changes" onClick={() => {
      var c = $('#unstave-canvas')[0];
      store.dispatch({
       type: ImageActions.UNSTAVED_SHEET,
       sheet: c.toDataURL('image/png', 1.0)
      });
     }
    }/>
   </div>
  );
 }
}

Actions.contextTypes = {
 store: PropTypes.object
}

export default Actions;
