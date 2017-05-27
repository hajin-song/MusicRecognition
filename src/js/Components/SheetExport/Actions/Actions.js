import React from 'react';
import PropTypes from 'prop-types';

import Action from 'omrComponents/Common/ActionButton';

const Actions = ({ toEdit, transpose }) => {
 return(
  <div className="col-xs-3 content__actions content__actions--sheet">
   <Action className="action" text="To Edit" onClick={toEdit} />
   <Action className="action" text="Transpose" onClick={transpose} />
  </div>
 );
}

Actions.propTypes = {
 toEdit: PropTypes.func,
 transpose: PropTypes.func,
}

export default Actions;
