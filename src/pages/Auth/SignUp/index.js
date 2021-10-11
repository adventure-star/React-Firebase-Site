import React, { Component } from 'react'

import headerlogo from '../../../images/header-logo.png';
import '../../../css/signup-form.css';

import * as ROLES from '../../../constants/roles';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../../services/Firebase';
import { compose } from 'recompose';

import LoadingOverlay from 'react-loading-overlay';
import { BeatLoader } from 'react-spinners';

import { countries } from '../../../constants/countries'
import { organizationtypes } from '../../../constants/organizationtypes'
import { USERTYPE } from '../../../constants/usertypes';
import Moment from 'moment-timezone';
import moment from 'moment';


const INITIAL_STATE = {
    organizationname: '',
    organizationtype: '',
    industry: '',
    firstname: '',
    lastname: '',
    streetaddress1: '',
    streetaddress2: '',
    country: '',
    state: '',
    username: '',
    phonenumber: '',

    selectedpackage: 'classNameroom (Billed Monthly) $49.00/mo.',
    discountcode: '',
    nameoncard: '',
    creditcard: '',
    expirationmonth: '',
    expirationyear: '',
    cvv: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false,
    error: null,
    step: 1,
    isAgree: false,
    isLoading: false
};

const STEP = {
    YOURSELF: 1,
    ORGANIZATION: 2,
    PAYMENTDETAILS: 3
}

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpBase extends Component {

    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };

        if (localStorage.getItem("authUser")) {
            this.props.history.push("/");
        }
    }

    onSubmit = event => {

        event.preventDefault();

        let date = Moment.tz(new Date(), "Europe/Paris").format();

        this.setState({ isLoading: true });

        const { firstname,
            lastname,
            phonenumber,
            organizationname,
            streetaddress1,
            streetaddress2,
            country,
            state,
            organizationtype,
            industry,
            selectedpackage,
            discountcode,
            nameoncard,
            expirationmonth,
            expirationyear,
            cvv,
            username,
            email,
            passwordOne,
            isAdmin
        } = this.state;

        const roles = {};

        if (isAdmin) {
            roles[ROLES.ADMIN] = ROLES.ADMIN;
        }

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                console.log("=====authUser", authUser);

                // Create a user in your Firebase firestore database

                this.props.firebase.user(authUser.user.uid).set({
                    user_type_id: USERTYPE.CUSTOMER.toString(),
                    first_name: firstname,
                    last_name: lastname,
                    username: username,
                    email: email,
                    created_at: Moment(date).format("x"),
                    modified_at: Moment(date).format("x")
                });

                return authUser.user.id;
            })
            .then((userId) => {

                return this.props.firebase.customer(userId).set({

                    organization_name: organizationname,
                    organization_type_main: organizationtype,
                    organization_type_child: industry,
                    contact_first_name: firstname,
                    contact_last_name: lastname,
                    address_1: streetaddress1,
                    address_2: streetaddress2,
                    city: "",
                    state: state,
                    country: country,
                    postal_code: "",
                    mobile_phone: phonenumber,
                    office_phone: "",
                    note: "",
                    partner: "",
                    package_tier: "",
                    selectedpackage: selectedpackage,
                    discountcode: discountcode,
                    nameoncard: nameoncard,
                    expirationmonth: expirationmonth,
                    expirationyear: expirationyear,
                    cvv: cvv,
                    username: username,
                    email,
                    roles,
                    user_type_id: "5",
                    created_at: Moment(date).format("x"),
                    modified_at: Moment(date).format("x")
                });

            })
            // .then(() => {
            //     return this.props.firebase.doSendEmailVerification();
            // })
            .then(() => {
                console.log("updated");
                this.setState({ isLoading: false });
                this.setState({ ...INITIAL_STATE });
                this.props.history.push("/");
            })
            .catch(error => {
                console.log("=====error", error);
                this.setState({ isLoading: false });
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

                this.setState({ error });
            });

    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeCheckbox = event => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    step1Validate = () => {
        return this.state.firstname !== "" &&
            this.state.lastname !== "" &&
            this.state.phonenumber !== "" &&
            this.emailValidate() &&
            this.usernameValidate() &&
            this.passwordOneValidate() &&
            this.passwordTwoValidate()
    }

    emailValidate = () => {
        return this.state.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }

    usernameValidate = () => {
        return this.state.username.length >= 12 && this.state.username.length <= 24 && this.state.username.match("^[A-Za-z0-9]+$");
    }
    passwordOneValidate = () => {
        return this.state.passwordOne.length >= 12 && this.state.passwordOne.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/);
    }
    passwordTwoValidate = () => {
        return this.passwordOneValidate() && this.state.passwordOne === this.state.passwordTwo;
    }

    step2Validate = () => {
        return this.state.organizationname !== "" &&
            this.state.streetaddress1 !== "" &&
            this.state.streetaddress2 !== "" &&
            this.state.country !== "" &&
            this.state.state !== "" &&
            this.state.organizationtype !== "" &&
            this.state.industry !== ""
    }
    step3Validate = () => {
        return this.state.selectedpackage !== "" &&
            this.state.nameoncard !== "" &&
            this.state.creditcard !== "" &&
            this.state.expirationmonth !== "" &&
            this.state.expirationyear !== "" &&
            this.state.cvv !== "" &&
            this.state.isAgree
    }

    render() {
        const {
            firstname,
            lastname,
            username,
            phonenumber,
            organizationname,
            streetaddress1,
            streetaddress2,
            country,
            state,
            organizationtype,
            industry,
            selectedpackage,
            discountcode,
            nameoncard,
            creditcard,
            expirationmonth,
            expirationyear,
            cvv,
            email,
            passwordOne,
            passwordTwo,
            isAdmin,
            error,
            isAgree
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner={<BeatLoader color={"white"} size={20} />}
                className="w-full h-full"
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: '#745fd1'
                    }),
                }}
            >
                <section className="signup__wrapper">
                    <div className="" style={{ padding: 0 }}>
                        {!this.state.isLoading &&
                            <>
                                <header>
                                    <div className="" style={{ paddingLeft: "100px" }}>
                                        <a href="/"><img src={headerlogo} alt="headerlogo" /></a>
                                    </div>
                                </header>
                                {this.state.step === STEP.YOURSELF &&
                                    <div className="form-box">
                                        <div className="row">
                                            <div className="column left">
                                                <div className="box-left">
                                                    <h1>Tell us about yourself.</h1>
                                                    <h2>Step 1 <span className="number">(1 of 3)</span></h2>
                                                </div>
                                            </div>
                                            <div className="column right">
                                                <div className="box-right">
                                                    <form>
                                                        <div className="inline-input">
                                                            <div className="input">
                                                                <label htmlFor="fname">First Name</label>
                                                                <input id="fname" type="text" name="firstname" value={firstname} onChange={this.onChange} autoFocus />
                                                            </div>
                                                            <div className="input">
                                                                <label htmlFor="lname">Last Name</label>
                                                                <input id="lname" type="text" name="lastname" value={lastname} onChange={this.onChange} />
                                                            </div>
                                                        </div>
                                                        <div className="input">
                                                            <label htmlFor="email">Email Address</label>
                                                            <input id="email" type="email" name="email" value={email} onChange={this.onChange} />
                                                        </div>
                                                        <div className="input">
                                                            <label htmlFor="phone">Phone Number</label>
                                                            <input id="phone" type="text" name="phonenumber" value={phonenumber} onChange={this.onChange} />
                                                        </div>
                                                        <div className="input">
                                                            <label htmlFor="username">Create Username</label>
                                                            <small className="input-desc">(Between 12 and 24 alphanumeric characters)</small>
                                                            <div className="input-has-status">
                                                                <input id="username" type="text" name="username" value={username} onChange={this.onChange} />
                                                                {this.usernameValidate() &&
                                                                    <span className="status success">Username Available</span>
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="input">
                                                            <label htmlFor="password">Password </label>
                                                            <div className="input-has-status">
                                                                <input id="password" type="pasword" name="passwordOne" value={passwordOne} onChange={this.onChange} />
                                                                {this.passwordOneValidate() &&
                                                                    <span className="status success">Success!</span>
                                                                }
                                                            </div>
                                                            <div className="password-requirements">
                                                                <p className="title">Password Requirements</p>
                                                                <div className="requirements">
                                                                    <p className={this.state.passwordOne.length >= 12 ? `validation-passed` : `validation-failed`}>12 character minimum</p>
                                                                    <p className={this.state.passwordOne.match(/(?=.*[A-Z])/) ? `validation-passed` : `validation-failed`}>At least one UPPERCASE character</p>
                                                                    <p className={this.state.passwordOne.match(/(?=.*[a-z])/) ? `validation-passed` : `validation-failed`}>At least one lowercase character</p>
                                                                    <p className={this.state.passwordOne.match(/(?=.*\d)/) ? `validation-passed` : `validation-failed`}>At least one number (0-9)</p>
                                                                    <p className={this.state.passwordOne.match(/[^a-zA-Z\d]/) ? `validation-passed` : `validation-failed`}>At least one symbol (example: @ ! ? # * ^ ) </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="input">
                                                            <label htmlFor="retypepassword">Retype Password</label>
                                                            <div className="input-has-status">
                                                                <input id="retypepassword" type="text" name="passwordTwo" value={passwordTwo} onChange={this.onChange} />
                                                                {this.passwordTwoValidate() &&
                                                                    <span className="status success">Passwords Match!</span>
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="submit-form">
                                                            {this.step1Validate() ?
                                                                <button className="submit-button" onClick={() => this.setState({ step: this.state.step + 1 })}>Next</button>
                                                                :
                                                                <button type="button" className="disabled-button">Next</button>
                                                            }
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {this.state.step === STEP.ORGANIZATION &&
                                    <div className="form-box">
                                        <div className="row">
                                            <div className="column left">
                                                <div className="box-left">
                                                    <h1>Tell us <br /> about your organization.</h1>
                                                    <h2>Step 2 <span className="number">(2 of 3)</span></h2>
                                                </div>
                                            </div>
                                            <div className="column right">
                                                <div className="box-right">
                                                    <form>
                                                        <div className="input">
                                                            <label htmlFor="organigationsName">Organization’s Name*</label>
                                                            <input id="organigationsName" type="text" name="organizationname" value={organizationname} onChange={this.onChange} />
                                                        </div>
                                                        <div className="input">
                                                            <label htmlFor="streetAddress">Street Address*</label>
                                                            <input id="streetAddress" type="text" name="streetaddress1" value={streetaddress1} onChange={this.onChange} />
                                                        </div>
                                                        <div className="input">
                                                            <label htmlFor="streetAddress2">Street Address 2</label>
                                                            <input id="streetAddress2" type="text" name="streetaddress2" value={streetaddress2} onChange={this.onChange} />
                                                        </div>
                                                        <div className="inline-input">
                                                            <div className="input">
                                                                <label htmlFor="country">Country*</label>
                                                                <select id="country" name="country" value={country} onChange={this.onChange}>
                                                                    <option value="" disabled defaultValue>Select Country</option>
                                                                    {countries.map((item, index) => (
                                                                        <option key={index} value={item}>{item}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="input">
                                                                <label htmlFor="state">State*</label>
                                                                <input id="state" type="text" name="state" value={state} onChange={this.onChange} />
                                                            </div>
                                                        </div>

                                                        <div className="inline-input">
                                                            <div className="input">
                                                                <label htmlFor="typeOfOrganization">Type of Organization*</label>
                                                                <select id="typeOfOrganization" name="organizationtype" value={organizationtype} onChange={this.onChange}>
                                                                    <option value="" disabled defaultValue>Select Organization Type</option>
                                                                    {organizationtypes !== [] && organizationtypes.filter(obj => { return obj.parent === 0 }).map(item => (
                                                                        <option key={item.id} value={item.id}>{item.type}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="input">
                                                                <label htmlFor="industry">Select Industry</label>
                                                                <select id="industry" name="industry" value={industry} onChange={this.onChange}>
                                                                    <option value="" disabled defaultValue>Select the Industry Type</option>
                                                                    {organizationtypes !== [] && organizationtypes.filter(obj => { return obj.parent === Number(organizationtype) }).map(item => (
                                                                        <option key={item.id} value={item.id}>{item.type}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="submit-form">
                                                            {this.step2Validate() ?
                                                                <button className="submit-button" onClick={() => this.setState({ step: this.state.step + 1 })}>Next</button>
                                                                :
                                                                <button type="button" className="disabled-button">Next</button>
                                                            }
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {this.state.step === STEP.PAYMENTDETAILS &&
                                    <div className="form-box">
                                        <div className="row">
                                            <div className="column left">
                                                <div className="box-left">
                                                    <h1>Enter your payment details.</h1>
                                                    <h2>Step 3 <span className="number">(3 of 3)</span></h2>
                                                </div>
                                            </div>
                                            <div className="column right">
                                                <div className="box-right">
                                                    <form onSubmit={this.onSubmit}>
                                                        <div className="input">
                                                            <label htmlFor="package">Selected Package</label>
                                                            <select id="package" name="selectedpackage" value={selectedpackage} onChange={this.onChange}>
                                                                <option value="classNameroom (Billed Monthly) $49.00/mo.">classNameroom (Billed Monthly) $49.00/mo.</option>
                                                                <option value="Other 1 (Billed Monthly) $59.00/mo.">Other 1 (Billed Monthly) $59.00/mo.</option>
                                                                <option value="Other 2 (Billed Monthly) $69.00/mo.">Other 2 (Billed Monthly) $69.00/mo.</option>
                                                                <option value="Other 3 (Billed Monthly) $79.00/mo.">Other 3 (Billed Monthly) $79.00/mo.</option>
                                                            </select>
                                                            <small style={{ marginTop: "10px" }} className="input-desc">Note: Your card will be charged monthly until you cancel.</small>
                                                        </div>

                                                        <div className="input promo-code">
                                                            <label htmlFor="promo">Discount Code</label>
                                                            <div className="input-has-status" id="apply-promo">
                                                                <input id="promo" type="text" name="discountcode" value={discountcode} onChange={this.onChange} />
                                                                <button type="button" className="apply-promo-button">Submit</button>
                                                                <span className="status success">Success!</span>
                                                            </div>
                                                        </div>

                                                        <div className="form-notice">
                                <p>You will receive a 14 day free trial. Your card will be charged your monthly subscrition fee beginning on {moment().add(14, 'days').format('LL')}.</p>
                                                        </div>

                                                        <div className="billing-information">
                                                            <p className="title">Billing Information</p>

                                                            <div className="input">
                                                                <label htmlFor="nameOncard">Name On Card</label>
                                                                <input id="nameOncard" type="text" name="nameoncard" value={nameoncard} onChange={this.onChange} />
                                                            </div>
                                                            <div className="input">
                                                                <label htmlFor="cardNumber">Credit Card #</label>
                                                                <input id="cardNumber" type="number" name="creditcard" value={creditcard} onChange={this.onChange} />
                                                            </div>

                                                            <div className="card-expiration">
                                                                <div className="input">
                                                                    <label htmlFor="expirationDate">Expiration (MM/YY)</label>
                                                                    <div className="expiration-fields">
                                                                        <input id="expirationDate" type="number" placeholder="MM" name="expirationmonth" value={expirationmonth} onChange={this.onChange} />
                                                                        <input id="expirationMonth" type="number" placeholder="YY" name="expirationyear" value={expirationyear} onChange={this.onChange} />
                                                                    </div>
                                                                </div>

                                                                <div className="input">
                                                                    <label htmlFor="cvv">CVV</label>
                                                                    <input id="cvv" type="number" placeholder="CVV" name="cvv" value={cvv} onChange={this.onChange} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="signature">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" value="" name="isAgree" value={isAgree} onChange={this.onChangeCheckbox} />
                                                                <span className="signature-text">I have read and agree to the terms and conditions of  using the  Thumball Digital Platform.</span>
                                                            </label>
                                                        </div>

                                                        <div className="submit-form center">
                                                            {this.step3Validate() ?
                                                                <button type="submit" className="submit-button" id="start-subscription">Start Subscription</button>
                                                                :
                                                                <button className="step3-disabled-button">Start Subscription</button>
                                                            }
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <footer>
                                    <div className="container">
                                        <p>© Copyright 2021 - Thumball® - Answers In Motion, LLC | All Rights Reserved</p>
                                    </div>
                                </footer>
                            </>
                        }
                    </div>
                </section>

            </LoadingOverlay>
        )
    }

}

const condition = authUser => authUser;

const SignUp = compose(
    withRouter,
    withFirebase,
)(SignUpBase);

export default SignUp;
