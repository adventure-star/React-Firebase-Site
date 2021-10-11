import React from 'react';
import { withFirebase } from '../../services/Firebase';
import { useHistory } from 'react-router-dom';

const SignOutButton = (props) => {

  let history = useHistory();

  const signout = () => {

    props.onClick();

    props.firebase.doSignOut().then(() => {
      history.push("/signin");
    });

  }
  return (
    <button type="button" className="btn btn__submit btn__cancel" onClick={signout}>
      Sign Out
    </button>
  )
};

export default withFirebase(SignOutButton);
