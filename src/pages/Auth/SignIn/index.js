import React, { Component, useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../../services/Firebase';

import logo from '../../../images/logo.png';

import SignUpLink from '../../../components/SignUpLink';
import PasswordForgetLink from '../../../components/PasswordForgetLink';

import LoadingOverlay from 'react-loading-overlay';
import { BeatLoader } from 'react-spinners';

const SignIn = (props) => {

  let history = useHistory();

  const [loading, setLoading] = useState(false);

  const displayLoading = () => {
    setLoading(true);
  }
  const hideLoading = () => {
    setLoading(false);
  }

  useEffect(() => {

    if (localStorage.getItem("authUser")) {
      history.push("/");
    }

  }, [])

  return (
    <LoadingOverlay
      active={loading}
      spinner={<BeatLoader color={"white"} size={20} />}
      className="w-full h-full"
      styles={{
        overlay: (base) => ({
          ...base,
          background: '#745fd1'
        }),
      }}
    >
      <section className="login__wrapper">
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
          <div className="container" style={{ padding: 0 }}>
            {
              !loading &&
              <>
                <div className="row justify-content-end">
                  <div className="col-12 col-md-6 col-lg-6">
                    <div className="login__box pr-sm-0">
                      <div className="login__form__wrapper">
                        <img src={logo} alt="logo" />
                        <div className="form__section">
                          <h2>Sign In</h2>
                          <SignInForm displayLoading={displayLoading} hideLoading={hideLoading} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="copyright text-right">© Copyright 2021 - Thumball® - Answers In Motion, LLC | All Rights Reserved</p>
              </>
            }
          </div>
        </div>

      </section>
    </LoadingOverlay>
  )
}

const INITIAL_STATE = {
  username: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();

    this.props.displayLoading();

    const { username, password } = this.state;

    this.props.firebase
      .users().where("username", "==", username).get()
      .then((querySnapshot) => {
        let users_ = [];
        querySnapshot.forEach((doc) => {
          users_.push({ id: doc.id, ...doc.data() });
        });
        console.log("users_-----", users_);
        if(users_.length !== 0) {
          return users_[0].email;
        } else {
          this.props.hideLoading();
        }
      })
      .then(email => {

        this.props.firebase
          .doSignInWithEmailAndPassword(email, password)
          .then(() => {
            console.log("onsubmit");
            // this.props.hideLoading();
            // this.setState({ ...INITIAL_STATE });
            this.props.history.push("/");
          })
          .catch(error => {
            this.setState({ error });
            this.props.hideLoading();
          });

      })

  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { username, password, error } = this.state;

    const isInvalid = password === '' || username === '';

    return (
      <form onSubmit={this.onSubmit}>
        {error && <p className="text-danger">{error.message}</p>}
        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            className="form-control"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="UserName"
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            className="form-control"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Enter Password"
          />
        </div>
        <div className="row align-items-center">
          <div className="col-8">
            <PasswordForgetLink />
            <SignUpLink />
          </div>
          <div className="col-4">
            <button disabled={isInvalid} type="submit" className="btn btn-custom">
              Sign In
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const condition = authUser => authUser;

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignIn;

export { SignInForm };
