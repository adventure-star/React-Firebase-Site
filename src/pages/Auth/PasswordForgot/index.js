import React, { Component, useState } from 'react';

import { withFirebase } from '../../../services/Firebase';

import logo from '../../../images/logo.png';
import LoadingOverlay from 'react-loading-overlay';
import { BeatLoader } from 'react-spinners';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

const PasswordForgot = () => {

    const [loading, setLoading] = useState(false);

    const displayLoading = () => {
        setLoading(true);
    }
    const hideLoading = () => {
        setLoading(false);
    }

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
                        <div className="row justify-content-end">
                            <div className="col-12 col-md-6 col-lg-6">
                                <div className="login__box pr-sm-0">
                                    <div className="login__form__wrapper">
                                        <img src={logo} alt="logo" />
                                        <div className="form__section">
                                            <h2>Forgot Your Password ?</h2>
                                            <p className="form__text">Enter your email address  to reset password. You may need to check  your spam folder or unblock no-reply@app.thumball.com.</p>
                                            <PasswordForgetForm displayLoading={displayLoading} hideLoading={hideLoading} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="copyright text-right">© Copyright 2020 - Thumball® - Answers In Motion, LLC | All Rights Reserved</p>
                    </div>
                </div>
            </section>
        </LoadingOverlay>
    )

}

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {

        event.preventDefault();

        this.props.displayLoading();

        const { email } = this.state;

        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                console.log("-----request sent-----");
                this.props.hideLoading();
                this.props.history.push("/");

            })
            .catch(error => {
                this.setState({ error });
                console.log("error-----", error);
                this.props.hideLoading();

            });

    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, error } = this.state;

        const isInvalid = email === '';

        return (
            <form onSubmit={this.onSubmit}>
                {error && <p className="text-danger">{error.message}</p>}
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        name="email"
                        className="form-control"
                        value={this.state.email}
                        onChange={this.onChange}
                        type="email"
                        placeholder="Enter Email Address"
                        autoFocus
                    />
                </div>
                <div className="row align-items-center">
                    <div className="col-8">
                        <a href="/signin" className="form__forgot">Back To Sign In</a>
                    </div>
                    <div className="col-4">
                        <button disabled={isInvalid} type="submit" className="btn btn-custom">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

const PasswordForgetLink = () => (
    <p>
        <a href="/forgot-password" className="form__forgot">Forgot Password?</a>
    </p>
);

export default PasswordForgot;

const PasswordForgetForm = compose(withRouter, withFirebase)(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
