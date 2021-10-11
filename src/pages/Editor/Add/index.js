import React, { useState, useEffect } from 'react'
import { generate } from 'generate-password';

import LeftSideBar from '../../../layouts/LeftSideBar';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import LoadingLayout from '../../../layouts/LoadingLayout';
import { useHistory } from 'react-router-dom';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
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


const EditorAdd = (props) => {

    let history = useHistory();

    const [loading, setLoading] = useState(false);


    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [description, setDescription] = useState("");
    const [note, setNote] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [activation, setActivation] = useState(true);

    const [informemail, setInformEmail] = useState(true);

    const [capability, setCapability] = useState({
        user: true,
        group: true,
        notification: true,
        message: true,
        thumball: true
    });

    const [customerid, setCustomerId] = useState(0);


    const handleCapability = (type, value) => {
        setCapability(Object.assign({}, capability, { [type]: value }));
    }

    const addEditor = () => {

        let date = Moment.tz(new Date(), "Europe/Paris").format();

        setLoading(true);

        props.firebase
            .doSecondaryCreateUserWithEmailAndPassword(email, password)
            .then(authUser => {

                console.log("Created Editor-----", authUser);

                // Create a editor in your Firebase firestore database

                props.firebase.secondaryAuth.signOut();

                console.log("Created Editor Id-----", authUser.user.uid);

                props.firebase.user(authUser.user.uid).set({
                    user_type_id: USERTYPE.EDITOR.toString(),
                    first_name: firstname,
                    last_name: lastname,
                    username: username,
                    email: email,
                    capability: capability,
                    created_at: Moment(date).format("x"),
                    modified_at: Moment(date).format("x")
                });

                return authUser.user.uid;

            })
            .then(userId => {

                console.log("Actions in Editor Table-----", userId);

                return props.firebase.editor(userId).set({
                    contact_first_name: firstname,
                    contact_last_name: lastname,
                    phone_number: phonenumber,
                    description: description,
                    note: note,
                    username: username,
                    capability: capability,
                    customer_id: customerid,
                    created_at: Moment(date).format("x"),
                    modified_at: Moment(date).format("x")
                });

            })
            .then(() => {
                console.log("-----Created-----");
                history.push("/editors/all");
            })
            .catch(error => {
                console.log("=====error", error);
                setLoading(false);
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

            });
    }


    const generatePassword = () => {
        setPassword(generate({
            length: 15,
            numbers: true,
            symbols: true
        }));
    }

    const getCustomerId = () => {
        var data = JSON.parse(localStorage.getItem("authUser"));
        if (data) {
            setCustomerId(data.uid);
        }
    }

    useEffect(() => {
        getCustomerId();
    }, []);

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="editors" page="new" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Add Editor</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>

                            <div className="add-editor-form">
                                <div className="card-panel">
                                    <div className="box-title">
                                        <div className="Customers-title container p-3" style={{ textTransform: "uppercase" }}>Add Editor</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="field-group">
                                                <label htmlFor="firstname">First Name</label>
                                                <input type="text" id="firstname" placeholder="Add First Name" value={firstname} onChange={e => setFirstName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="field-group">
                                                <label htmlFor="lastname">Last Name</label>
                                                <input type="text" id="lastname" placeholder="Add Last Name" value={lastname} onChange={e => setLastName(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="field-group">
                                                <label htmlFor="email">Email Address</label>
                                                <input type="email" id="email" placeholder="Add Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="field-group">
                                                <label htmlFor="phone">Phone Number</label>
                                                <input type="text" id="phone" placeholder="Phone Number" value={phonenumber} onChange={e => setPhoneNumber(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="field-group">
                                                <label htmlFor="description">Description</label>
                                                <input type="text" id="description" placeholder="Add description here..." value={description} onChange={e => setDescription(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="field-group">
                                                <label htmlFor="notes">Notes</label>
                                                <textarea name="notes" id="notes" placeholder="notes" value={note} onChange={e => setNote(e.target.value)}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-panel">
                                    <div className="box-title">
                                        <div className="Customers-title container p-3" style={{ textTransform: "uppercase" }}>Login Credentials </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="field-group">
                                                <label htmlFor="username">Username</label>
                                                <input type="text" id="username" placeholder="Enter Username" value={username} onChange={e => setUserName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="field-group">
                                                <label htmlFor="password">Password</label>
                                                <input type="text" id="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 align-bottom">
                                            <div className="field-group">
                                                <button type="button" className="btn generate-pasword" onClick={generatePassword}>Generate Secure Password</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="pricing-tires">
                                                <label className="container"><span className="label">Can only be used on new account activation </span>
                                                    <input type="checkbox" checked={activation} onChange={() => setActivation(!activation)} />                                                 <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form__container">
                                                <p htmlFor="exampleInputEmail1" className="radio-item-label">How do you want to inform the editor of their new account?</p>
                                                <div className="form-group">
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={informemail ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-inform-1" name="someRadio" type="radio" onChange={e => setInformEmail(true)} checked={informemail} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-inform-1"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-inform-1">Send Email Invite</label>
                                                    </div>
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={!informemail ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-inform-2" name="someRadio" type="radio" onChange={e => setInformEmail(false)} checked={!informemail} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-inform-2"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-inform-2">in person/offline</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>

                                <div className="card-panel">
                                    <div className="box-title">
                                        <div className="Customers-title container p-3" style={{ textTransform: "uppercase" }}>Editor Capabilities</div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form__container">
                                                <p className="radio-item-label">Add Users?</p>
                                                <div className="form-group">
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={capability.user ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-adduser-1" name="someRadio" type="radio" onChange={e => handleCapability("user", true)} checked={capability.user} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-adduser-1"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-adduser-1">Yes</label>
                                                    </div>
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={!capability.user ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-adduser-2" name="someRadio" type="radio" onChange={e => handleCapability("user", false)} checked={!capability.user} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-adduser-2"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-adduser-2">No</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form__container">
                                                <p className="radio-item-label">Create Groups/Subgroups?</p>
                                                <div className="form-group">
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={capability.group ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-group-1" name="someRadio" type="radio" onChange={e => handleCapability("group", true)} checked={capability.group} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-group-1"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-group-1">Yes</label>
                                                    </div>
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={!capability.group ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-group-2" name="someRadio" type="radio" onChange={e => handleCapability("group", false)} checked={!capability.group} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-group-2"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-group-2">No</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form__container">
                                                <p className="radio-item-label">Send Notifications?</p>
                                                <div className="form-group">
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={capability.notification ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-notification-1" name="someRadio" type="radio" onChange={e => handleCapability("notification", true)} checked={capability.notification} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-notification-1"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-notification-1">Yes</label>
                                                    </div>
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={!capability.notification ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-notification-2" name="someRadio" type="radio" onChange={e => handleCapability("notification", false)} checked={!capability.notification} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-notification-2"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-notification-2">No</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form__container">
                                                <p className="radio-item-label">Send/Receive Messages?</p>
                                                <div className="form-group">
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={capability.message ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-message-1" name="someRadio" type="radio" onChange={e => handleCapability("message", true)} checked={capability.message} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-message-1"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-message-1">Yes</label>
                                                    </div>
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={!capability.message ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-message-2" name="someRadio" type="radio" onChange={e => handleCapability("message", false)} checked={!capability.message} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-message-2"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-message-2">No</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form__container">
                                                <p className="radio-item-label">Create Thumballs?</p>
                                                <div className="form-group">
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={capability.thumball ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-thumball-1" name="someRadio" type="radio" onChange={e => handleCapability("thumball", true)} checked={capability.thumball} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-thumball-1"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-thumball-1">Yes</label>
                                                    </div>
                                                    <div className="custom-radio form-check-inline" style={{ marginTop: 0 }}>
                                                        <input className={!capability.thumball ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-thumball-2" name="someRadio" type="radio" onChange={e => handleCapability("thumball", false)} checked={!capability.thumball} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-thumball-2"></label>
                                                        <label className="custom-radio-label" htmlFor="someRadio-thumball-2">No</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="form-field">
                                    <div className="inline-buttons">
                                        <a href="/editors/all"><button className="btn btn-cancel">Cancel</button></a>
                                        <button className="btn btn-save" onClick={addEditor}> Save</button>
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

const condition = authUser => !!authUser && Number(authUser.user_type_id) === USERTYPE.CUSTOMER;

export default compose(withFirebase, withAuthorization(condition))(EditorAdd);
