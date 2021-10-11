import React, { Component, useState } from 'react';

import { withFirebase } from '../../../services/Firebase';

import logo from '../../../images/logo.png';
import { compose } from 'recompose';
import { withAuthorization } from '../../../services/Session';
import LoadingOverlay from 'react-loading-overlay';
import { BeatLoader } from 'react-spinners';
import { withRouter } from 'react-router-dom';

const PasswordReset = () => {

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
                                            <h2>Password Reset</h2>
                                            <p className="form__text">Please create a new password.</p>
                                            <PasswordResetForm displayLoading={displayLoading} hideLoading={hideLoading} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="copyright text-right selection-none">© Copyright 2020 - Thumball® - Answers In Motion, LLC | All Rights Reserved</p>
                    </div>
                </div>
            </section>
        </LoadingOverlay>
    )

}

const INITIAL_STATE = {
    password: '',
    view: false,
    error: null,
};

class PasswordResetFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {

        event.preventDefault();

        console.log(this.props);

        this.props.displayLoading();

        const { password } = this.state;

        this.props.firebase
            .doPasswordUpdate(password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                console.log("-----request sent-----");
                this.props.hideLoading();
                this.props.history.push("/");

            })
            .catch(error => {
                this.props.hideLoading();
                this.setState({ error });
                console.log("error-----", error);
            });

    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    passwordValidate = () => {
        return this.state.password.length >= 12 && this.state.password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/);
    }

    render() {
        const { password, view, error } = this.state;

        const isInvalid = !this.passwordValidate();

        return (
            <form onSubmit={this.onSubmit}>
                {error && <p className="text-danger">{error.message}</p>}
                <div className="form-group">
                    <label>New Password</label>
                    <div className="input-group">
                        <input
                            name="password"
                            className="form-control"
                            style={{ marginBottom: 0 }}
                            value={this.state.password}
                            onChange={this.onChange}
                            type={view ? `text` : `password`}
                            placeholder="Enter New Password"
                            autoFocus
                        />
                        <div className="form-control-after cursor-pointer" onClick={() => this.setState({ view: !view })}>
                            {view ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="25.52" height="16.939" viewBox="0 0 25.52 16.939">
                                    <path d="M20.028,27.346a.715.715,0,0,0,1.224-.5.724.724,0,0,0-.213-.51L5.52,10.824a.715.715,0,0,0-.51-.2.738.738,0,0,0-.714.7.685.685,0,0,0,.2.51Zm.872-2.625c2.913-1.883,4.62-4.332,4.62-5.418,0-1.883-5.148-7.885-12.755-7.885a14.059,14.059,0,0,0-4.406.714l2.421,2.412a5,5,0,0,1,1.985-.408A5.143,5.143,0,0,1,17.95,19.3a4.532,4.532,0,0,1-.436,1.976Zm-8.136,2.468a14.306,14.306,0,0,0,4.74-.807l-2.458-2.458a4.933,4.933,0,0,1-2.282.547A5.192,5.192,0,0,1,7.57,19.3a5.116,5.116,0,0,1,.547-2.319L4.889,13.737C1.828,15.62,0,18.19,0,19.3,0,21.177,5.241,27.188,12.765,27.188Zm2.95-8.08a2.938,2.938,0,0,0-2.95-2.941c-.121,0-.241.009-.352.019L15.7,19.47C15.705,19.359,15.715,19.229,15.715,19.108ZM9.805,19.09a2.967,2.967,0,0,0,2.969,2.95c.13,0,.25-.009.38-.019l-3.33-3.33C9.815,18.821,9.805,18.96,9.805,19.09Z" transform="translate(0 -10.62)" fill="#3b3b3a" opacity="0.596"></path>
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="25.515" height="16" viewBox="0 0 25.515 16">
                                    <path d="M12.762,27.286c7.539,0,12.753-6.1,12.753-8s-5.224-8-12.753-8C5.28,11.286,0,17.376,0,19.286S5.318,27.286,12.762,27.286Zm0-2.758a5.274,5.274,0,0,1-5.271-5.242,5.266,5.266,0,0,1,10.532,0A5.266,5.266,0,0,1,12.762,24.529Zm0-3.351a1.9,1.9,0,1,0-1.92-1.892A1.914,1.914,0,0,0,12.762,21.178Z" transform="translate(0 -11.286)" fill="#3b3b3a" opacity="0.596"></path>
                                </svg>
                            }
                        </div>
                    </div>

                </div>
                <div className="password-requirements">
                    <p className="title selection-none">Password Requirements</p>
                    <div className="requirements selection-none">
                        <p className={this.state.password.length >= 12 ? `validation-passed` : `validation-failed`}>12 character minimum</p>
                        <p className={this.state.password.match(/(?=.*[A-Z])/) ? `validation-passed` : `validation-failed`}>At least one UPPERCASE character</p>
                        <p className={this.state.password.match(/(?=.*[a-z])/) ? `validation-passed` : `validation-failed`}>At least one lowercase character</p>
                        <p className={this.state.password.match(/(?=.*\d)/) ? `validation-passed` : `validation-failed`}>At least one number (0-9)</p>
                        <p className={this.state.password.match(/[^a-zA-Z\d]/) ? `validation-passed` : `validation-failed`}>At least one symbol (example: @ ! ? # * ^ ) </p>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-8">
                        <a href="/signin" className="form__forgot selection-none">Back To Sign In</a>
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

const condition = authUser => !!authUser;

const PasswordResetForm = compose(withRouter, withFirebase)(PasswordResetFormBase);

export default compose(withAuthorization(condition))(PasswordReset);
