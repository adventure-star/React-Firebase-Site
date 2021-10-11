import React, { useEffect, useState } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import LoadingLayout from '../../../layouts/LoadingLayout';
import { useHistory } from 'react-router-dom';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import _ from 'lodash';
import { USERTYPE } from '../../../constants/usertypes';
import Moment from 'moment-timezone';


const UserEdit = (props) => {

    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [assigngroup, setAssignGroup] = useState(true);
    const [group, setGroup] = useState("");
    const [devicetype, setDeviceType] = useState(1);
    const [note, setNote] = useState("");
    const [logout, setLogout] = useState(true);

    const [groups, setGroups] = useState([]);
    const [groups_original, setGroupsOriginal] = useState([]);


    const [subgroups, setSubGroups] = useState([]);

    const GROUPTYPE = {
        GROUP: 0,
        SUBGROUP: 1
    };

    useEffect(() => {
        getUserById(props.match.params.id);
        getGroups();

    }, []);

    const getUserById = id => {

        props.firebase.appuser(id).get()
            .then(doc => {
                if (doc.exists) {
                    console.log("User-----", doc.data());
                    var res = doc.data();
                    setFirstName(res.first_name);
                    setLastName(res.last_name);
                    setEmail(res.email);
                    setPhoneNumber(res.cell_phone);
                    setGroup(res.group);
                    getSubGroupsByGroupId(res.group);
                    setDeviceType(res.device_type);
                    setNote(res.note);
                    setLogout(res.logout === 1 ? true : false);

                    setLoading(false);
                }
            })
    }

    const updateUser = () => {

        let date = Moment.tz(new Date(), "Europe/Paris").format();

        setLoading(true);

        var ref = props.firebase.appuser(props.match.params.id);

        ref.update({
            first_name: firstname,
            last_name: lastname,
            email: email,
            cell_phone: phonenumber,
            group: group,
            device_type: devicetype,
            note: note,
            logout: logout ? 1 : 0,
            modified_at: Moment(date).format("x")
        })
            .then(() => {
                console.log("-----AppUser Updated-----");
                setLoading(false);
                history.push("/users/all");

            })
            .catch(error => {
                console.log("=====error", error);
                setLoading(false);
            });

    }

    const getSubGroupsByGroupId = (groupid) => {

        setLoading(true);

        var groups_ = [];

        props.firebase.groups().where('parent_id', '==', groupid).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    groups_.push({ id: doc.id, ...doc.data() });
                });
                console.log("SubGroups Received-----", groups_);
                setSubGroups(groups_);
                setLoading(false);
            });

    }

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

    const getGroupNameById = id => {

        console.log(groups.find(group => group.id === id));

        var data = groups.find(group => group.id === id);

        if (data !== undefined) {
            return data.group_name;
        }

    }

    const handleGroup = (id, type) => {

        let group_ = _.cloneDeep(group);
        group_[id] = !group[id];
        let subgroupids = [];
        let parentid = null;

        if (type === GROUPTYPE.GROUP) {
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
            if(parentid !== null) {
                group_[parentid] = true;
            }
        }

        setGroup(group_);
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
                                        <li className="active">Edit User</li>
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
                                                {/* <div className="col-3">
                                                    <div className="form-group editt">
                                                        <label htmlFor="groupmembership">Group membership - <a href="#">EDIT</a></label>
                                                        <input type="text" className="form-control" placeholder="Enter Group membership" value={getGroupNameById(group)} readOnly />
                                                    </div>
                                                </div>
                                                <div className="col-9">
                                                    <div className="form-group">
                                                        <label htmlFor="subgroupmembership">subGroup membership</label>
                                                        <div className="multi-check">
                                                            {subgroups !== null && subgroups !== undefined && subgroups !== [] && subgroups.map(subgroup => (
                                                                <label key={subgroup.id} className="container-panel mb-3">{subgroup.group_name}
                                                                    <input type="checkbox" defaultChecked />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div> */}
                                                <div className="col-6">
                                                    <label htmlFor="">Group Membership</label>
                                                    {assigngroup && groups !== [] && groups.map(el => (
                                                        <div key={el.index}>
                                                            <label className="container-panel mb-3">
                                                                {el.group_name}<span className="text-lowercase">(group)</span>
                                                                <input type="checkbox" checked={group[el.id]} onChange={() => handleGroup(el.id, GROUPTYPE.GROUP)} />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                            <div className="pl-5">
                                                                {el.subgroups.map(item => (
                                                                    <label key={item.id} className="container-panel">
                                                                        {item.group_name}
                                                                        <input type="checkbox" checked={group[item.id]} onChange={() => handleGroup(item.id, GROUPTYPE.SUBGROUP)} />
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                            <hr />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <h5>Login Credentials</h5>
                                                </div>
                                                <div className="col-6">
                                                    <label htmlFor="resendsms">Resend SMS Message with link to download app?</label>
                                                    <button type="submit" className="btn btn__submit addpanel">Resend</button>
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

                                            <a href="/users/all"><button type="button" className="btn btn__submit btn__cancel mr-4">Cancel</button></a>
                                            <button type="button" className="btn btn__submit" onClick={updateUser} >Save</button>

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

const condition = authUser => !!authUser && (Number(authUser.user_type_id) === USERTYPE.CUSTOMER || (Number(authUser.user_type_id) === USERTYPE.EDITOR && authUser.capability.user));

export default compose(withFirebase, withAuthorization(condition))(UserEdit);
