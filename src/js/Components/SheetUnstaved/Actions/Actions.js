import React from 'react';
import PropTypes from 'prop-types';

import Action from 'omrComponents/Common/ActionButton';

const Actions = ({ toEdit, saveChanges }) => {
 return(
  <div className="col-xs-3 content__actions content__actions--sheet">
   <Action className="action" text="To Edit" onClick={toEdit} />
   <Action className="action" text="Save Changes" onClick={saveChanges} />
  </div>
 );
}

Actions.propTypes = {
 saveChanges: PropTypes.func,
 toEdit: PropTypes.func,
}

export default Actions;
