import React, { useState, useEffect } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';
import { useHistory } from 'react-router-dom';
import LoadingLayout from '../../../layouts/LoadingLayout';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import _ from 'lodash';

import { USERTYPE } from '../../../constants/usertypes';
import { PRICING } from '../../../constants/pricingtiers';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Moment from 'moment-timezone';


const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const UserAdd = (props) => {

    let history = useHistory();

    const [loading, setLoading] = useState(false);

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [assigngroup, setAssignGroup] = useState(true);
    const [group, setGroup] = useState([]);
    const [devicetype, setDeviceType] = useState(1);
    const [note, setNote] = useState("");
    const [sendsms, setSendSMS] = useState(false);
    const [logout, setLogout] = useState(true);


    const [groups, setGroups] = useState([]);
    const [groups_original, setGroupsOriginal] = useState([]);

    const [usertype, setUserType] = useState(0);
    const [customerid, setCustomerId] = useState("");
    const [editorid, setEditorId] = useState("");

    const [pricingtier, setPricingTier] = useState(1);
    const [users, setUsers] = useState([]);


    const addUser = () => {

        let date = Moment.tz(new Date(), "Europe/Paris").format();

        if (pricingtier !== undefined) {

            if (users.length >= PRICING[pricingtier - 1].users.active) {
                toast.error("You cannot add new app users! You can add " + PRICING[pricingtier - 1].users.active + "active users with your pricing tier.");
                return;
            }

        }

        setLoading(true);

        var ref = props.firebase.appusers().doc();

        ref.set({
            first_name: firstname,
            last_name: lastname,
            access_code: "",
            email: email,
            cell_phone: phonenumber,
            group: (assigngroup && group.length) !== 0 ? group : null,
            device_type: devicetype,
            note: note,
            logout: logout ? 1 : 0,
            customer_id: customerid,
            editor_id: usertype === USERTYPE.EDITOR ? editorid : null,
            created_at: Moment(date).format("x"),
            modified_at: Moment(date).format("x")
        })
            .then(() => {
                console.log("-----AppUser Created-----");
                setLoading(false);
                history.push("/users/all");

            })
            .catch(error => {
                console.log("=====error", error);
                setLoading(false);
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

            });

    }

    useEffect(() => {
        getGroups();
        getPrentId();
    }, [])

    const getGroups = () => {

        setLoading(true);

        var groups_ = [];

        props.firebase.groups().get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    groups_.push({ id: doc.id, ...doc.data() });
                });
                console.log("Groups Received-----", groups_);
                setGroupsOriginal(groups_);

                let group_ = {};
                groups_.forEach(item => {
                    group_[item.id] = true;
                });
                setGroup(group_);
                classifyGroup(groups_);
                setLoading(false);
            });
    }

    const classifyGroup = (list) => {
        let list_ = [];
        let index_ = 0;
        console.log("original-----", list);
        list.forEach(item => {
            console.log("item-----", item);
            if (index_ === 0 && item.parent_id !== null) {
                list_.push({ index: index_, id: item.parent_id, group_name: item.group_name, subgroups: [item] });
                index_++;
            } else {
                if (item.parent_id === null) {
                    console.log("list.id-----", item.id)
                    list_.push({ index: index_, id: item.id, group_name: item.group_name, subgroups: [] });
                    index_++;

                } else {

                    list_.map(item_ => {
                        if (item.parent_id === item_.id) {
                            let subgroups = item_.subgroups.push(item);
                            return Object.assign({}, item_, { subgroups: subgroups });
                        } else {
                            return item_;
                        }
                    })

                }
            }
        });
        setGroups(list_);
        console.log("classified-----", list_);
    }

    const handleGroup = (id, type) => {

        let group_ = _.cloneDeep(group);
        group_[id] = !group[id];
        let subgroupids = [];
        let parentid = null;

        if (type === 0) {
            subgroupids = groups.filter(x => x.id === id)[0].subgroups.map(item => {
                return item.id;
            });
        } else {
            parentid = groups_original.filter(x => x.id === id)[0].parent_id;
        }

        if (!group[id]) {
            subgroupids.forEach(item => {
                group_[item] = true;
            });
            if (parentid !== null) {
                group_[parentid] = true;
            }
        }

        setGroup(group_);
    }

    const getPrentId = () => {
        var data = JSON.parse(localStorage.getItem("authUser"));
        if (data) {

            if (Number(data.user_type_id) === USERTYPE.CUSTOMER) {
                setCustomerId(data.uid);
                getUsers(data.uid);
                getCustomerInfo(data.uid);
            } else {
                setEditorId(data.uid);
                getEditorById(data.uid);
            }
            setUserType(Number(data.user_type_id));

        }
    }

    const getEditorById = (id) => {
        props.firebase.editor(id).get()
            .then(doc => {
                if (doc.exists) {
                    console.log("Received-----", doc.data());
                    var res = doc.data();

                    setCustomerId(res.customer_id);
                    getUsers(res.customer_id);
                    getCustomerInfo(res.customer_id);

                    setLoading(false);
                }
            })
    }

    const getUsers = (id) => {
        props.firebase.appusers().where("customer_id", "==", id).get()
            .then((querySnapshot) => {
                let users_ = [];
                querySnapshot.forEach((doc) => {
                    users_.push({ id: doc.id, ...doc.data() });
                });

                setUsers(users_);
            });
    }

    const getCustomerInfo = (id) => {
        props.firebase.customer(id).get()
            .then(doc => {
                if (doc.exists) {
                    console.log("Customer-----", doc.data());
                    var res = doc.data();

                    setPricingTier(res.pricing_tier);

                    setLoading(false);
                }
            })
    }


    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="users" page="new" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Add User</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="box__wrapper">
                                    <div className="form__container">
                                        <div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="firstname">First Name</label>
                                                        <input type="text" className="form-control" placeholder="Enter First Name" value={firstname} onChange={e => setFirstName(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="lastname">Last Name</label>
                                                        <input type="text" className="form-control" placeholder="Enter Last Name" value={lastname} onChange={e => setLastName(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="email">Email Address</label>
                                                        <input type="text" className="form-control" placeholder="Enter Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="phone">Phone Number</label>
                                                        <input type="text" className="form-control" placeholder="Enter Phone Number" value={phonenumber} onChange={e => setPhoneNumber(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <label htmlFor="assigngroup pl-3">assign to a group?<br />
                                        (note: you can do this later.)</label>
                                                            <div className="form-group">
                                                                <div className="custom-radio form-check-inline mr-5">
                                                                    <input className={assigngroup ? `custom-radio-input checked` : `custom-radio-input`} id="radio-assign-1" name="radio-assign" type="radio" onChange={() => setAssignGroup(true)} checked={assigngroup} />
                                                                    <label className="custom-radio-elem" htmlFor="radio-assign-1"></label>
                                                                    <label className="custom-radio-label" htmlFor="radio-assign-1">Yes</label>
                                                                </div>
                                                                <div className="custom-radio form-check-inline">
                                                                    <input className={!assigngroup ? `custom-radio-input checked` : `custom-radio-input`} id="radio-assign-2" name="radio-assign" type="radio" onChange={() => setAssignGroup(false)} checked={!assigngroup} />
                                                                    <label className="custom-radio-elem" htmlFor="radio-assign-2"></label>
                                                                    <label className="custom-radio-label" htmlFor="radio-assign-2">No</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            {assigngroup && groups !== [] && groups.map(el => (
                                                                <div key={el.index}>
                                                                    <label className="container-panel mb-3">
                                                                        {el.group_name}<span className="text-lowercase">(group)</span>
                                                                        <input type="checkbox" checked={group[el.id]} onChange={() => handleGroup(el.id, 0)} />
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                    <div className="pl-5">
                                                                        {el.subgroups.map(item => (
                                                                            <label key={item.id} className="container-panel">
                                                                                {item.group_name}
                                                                                <input type="checkbox" checked={group[item.id]} onChange={() => handleGroup(item.id, 1)} />
                                                                                <span className="checkmark"></span>
                                                                            </label>
                                                                        ))}
                                                                    </div>
                                                                    <hr />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <h5>Login Credentials</h5>
                                                </div>
                                                <div className="col-6">
                                                    <label htmlFor="sendsms">Send SMS Message with link to download app?</label>
                                                    <div className="form-group">
                                                        <div className="custom-radio form-check-inline mr-5">
                                                            <input className={sendsms ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-11" name="someRadio" type="radio" onChange={() => setSendSMS(true)} checked={sendsms} />
                                                            <label className="custom-radio-elem" htmlFor="someRadio-11"></label>
                                                            <label className="custom-radio-label" htmlFor="someRadio-11">Yes</label>
                                                        </div>
                                                        <div className="custom-radio form-check-inline">
                                                            <input className={!sendsms ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-22" name="someRadio" type="radio" onChange={() => setSendSMS(false)} checked={!sendsms} />
                                                            <label className="custom-radio-elem" htmlFor="someRadio-22"></label>
                                                            <label className="custom-radio-label" htmlFor="someRadio-22">No</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <label htmlFor="typeofdevice pl-3">Type of Device?</label>
                                                    <div className="form-group">
                                                        <div className="custom-radio form-check-inline mr-5">
                                                            <input className={devicetype === 1 ? `custom-radio-input checked` : `custom-radio-input`} id="radio-type-1" name="radio-type" type="radio" onChange={() => setDeviceType(1)} checked={devicetype === 1} />
                                                            <label className="custom-radio-elem" htmlFor="radio-type-1"></label>
                                                            <label className="custom-radio-label" htmlFor="radio-type-1">ios</label>
                                                        </div>
                                                        <div className="custom-radio form-check-inline">
                                                            <input className={devicetype !== 1 ? `custom-radio-input checked` : `custom-radio-input`} id="radio-type-2" name="radio-type" type="radio" onChange={() => setDeviceType(2)} checked={devicetype !== 1} />
                                                            <label className="custom-radio-elem" htmlFor="radio-type-2"></label>
                                                            <label className="custom-radio-label" htmlFor="radio-type-2">Android</label>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-group add-cust">
                                                        <label htmlFor="exampleFormControlSelect1">Account Notes</label>
                                                        <textarea className="form-control" placeholder="Add account notes here..." value={note} onChange={e => setNote(e.target.value)}></textarea>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="container-panel mb-5"> Logout user when app has been closed/minimized.
                                <input type="checkbox" checked={logout} onChange={() => setLogout(!logout)} />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <a href="/users/all"><button className="btn btn__submit btn__cancel mr-4">Cancel</button></a>
                                            <button type="button" className="btn btn__submit" onClick={addUser}>Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <CopyrightBrand />
                            </div>
                        </div>
                    </div>
                    <ToastContainer autoClose={4000} />
                </div>
            </>
        </LoadingLayout>
    )
}

const condition = authUser => !!authUser && (Number(authUser.user_type_id) === USERTYPE.CUSTOMER || (Number(authUser.user_type_id) === USERTYPE.EDITOR && authUser.capability.user));

export default compose(withFirebase, withAuthorization(condition))(UserAdd);