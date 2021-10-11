import React, { useState } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';
import { compose } from 'recompose';
import { withAuthorization } from '../../../services/Session';
import { withFirebase } from '../../../services/Firebase';
import { useHistory } from 'react-router-dom';
import LoadingLayout from '../../../layouts/LoadingLayout';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';

import { countries } from '../../../constants/countries'
import { states } from '../../../constants/states'
import { USERTYPE } from '../../../constants/usertypes';
import Moment from 'moment-timezone';


const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const PartnerAdd = (props) => {

    let history = useHistory();

    const [loading, setLoading] = useState(false);

    const [organization, setOrganization] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [note, setNote] = useState("");

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phonenumber, setPhonenumber] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const addPartner = () => {

        let date = Moment.tz(new Date(), "Europe/Paris").format();

        setLoading(true);

        props.firebase
            .doSecondaryCreateUserWithEmailAndPassword(email, password)
            .then(authUser => {

                console.log("Created Partner-----", authUser);

                // Create a partner in your Firebase firestore database

                props.firebase.secondaryAuth.signOut();

                console.log("Created Partner Id-----", authUser.user.uid);

                props.firebase.user(authUser.user.uid).set({
                    user_type_id: USERTYPE.PARTNER.toString(),
                    first_name: firstname,
                    last_name: lastname,
                    username: username,
                    email: email,
                    created_at: Moment(date).format("x"),
                    modified_at: Moment(date).format("x")
                });

                return authUser.user.uid;

            })
            .then(userId => {

                console.log("Actions in Partner Table-----", userId);

                return props.firebase.partner(userId).set({
                    organization_name: organization,
                    contact_first_name: firstname,
                    contact_last_name: lastname,
                    address_1: address1,
                    address_2: address2,
                    city: city,
                    state: state,
                    country: country,
                    postal_code: zipcode,
                    phone_number: phonenumber,
                    created_at: Moment(date).format("x"),
                    modified_at: Moment(date).format("x")
                });

            })
            .then(() => {
                console.log("-----Partner Created-----");
                history.push("/partners/all");
            })
            .catch(error => {
                console.log("=====error", error);
                setLoading(false);
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

            });

    }

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="partners" page="new" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Add Partner</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="box__wrapper">
                                    <div className="form__container">
                                        <div>
                                            <div className="form-group">
                                                <label htmlFor="organization">Organization’s Name</label>
                                                <input type="text" className="form-control" placeholder="Add Organization Name" value={organization} onChange={e => setOrganization(e.target.value)} />
                                            </div>
                                            <h5>Mailing Address</h5>
                                            <div className="form-group">
                                                <label htmlFor="addr1">Address 1</label>
                                                <input type="text" className="form-control" placeholder="Add Address" value={address1} onChange={e => setAddress1(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="addr2">Address 2</label>
                                                <input type="text" className="form-control" placeholder="Add Address" value={address2} onChange={e => setAddress2(e.target.value)} />
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="exampleFormControlSelect1">Country</label>
                                                        <select className="form-control" id="exampleFormControlSelect1" value={country} onChange={e => setCountry(e.target.value)}>
                                                            <option value="" disabled defaultValue>Select Your Country</option>
                                                            {countries.map((item, index) => (
                                                                <option key={index} value={item}>{item}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="city">City</label>
                                                        <input type="text" className="form-control" placeholder="Add City" value={city} onChange={e => setCity(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="exampleFormControlSelect1">State</label>
                                                        <select className="form-control" id="exampleFormControlSelect1" value={state} onChange={e => setState(e.target.value)}>
                                                            <option value="" disabled defaultValue>Select Your State</option>
                                                            {states.map((item, index) => (
                                                                <option key={index} value={item}>{item}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="zipcode">Zip Code</label>
                                                        <input type="text" className="form-control" placeholder="Add Zipcode" value={zipcode} onChange={e => setZipcode(e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <h5>Contact Information</h5>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="firstname">First Name</label>
                                                        <input type="text" className="form-control" placeholder="First Name" value={firstname} onChange={e => setFirstname(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="lastname">Last Name</label>
                                                        <input type="text" className="form-control" placeholder="Last Name" value={lastname} onChange={e => setLastname(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="email">Email Address</label>
                                                        <input type="text" className="form-control" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="phone">Phone Number</label>
                                                        <input type="text" className="form-control" placeholder="Phone Number" value={phonenumber} onChange={e => setPhonenumber(e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-12">
                                                    <h5>Login Credentials</h5>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="username">Username</label>
                                                        <input type="text" className="form-control" placeholder="Add Username" value={username} onChange={e => setUsername(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="temporarypassword">temporary password</label>
                                                        <input type="text" className="form-control" placeholder="Add Password" value={password} onChange={e => setPassword(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-group add-cust">
                                                        <label htmlFor="exampleFormControlSelect1">Account Notes</label>
                                                        <textarea className="form-control" placeholder="Add account notes here..." value={note} onChange={e => setNote(e.target.value)}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <a href="/partners/all">
                                                <button type="button" className="btn btn__submit btn__cancel mr-4">Cancel</button>
                                            </a>
                                            <button type="button" className="btn btn__submit" onClick={addPartner}>Save</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <CopyrightBrand />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </LoadingLayout>
    )
}

const condition = authUser => !!authUser && Number(authUser.user_type_id) === USERTYPE.SUPERADMIN;

export default compose(withFirebase, withAuthorization(condition))(PartnerAdd);