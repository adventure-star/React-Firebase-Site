import React, { useState, useEffect } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';
import LoadingLayout from '../../../layouts/LoadingLayout';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { USERTYPE } from '../../../constants/usertypes';
import Individual from '../../Analytics/Individual';

const ASSIGN = {
    THUMBALL: 0,
    THUMBTRACK: 1
};

const SELECTFROM = {
    ALL: 0,
    CREATED: 1
};

const ASSIGNTO = {
    INDIVIDUALS: 0,
    INDIVIDUAL: 1,
    GROUPS: 2,
};

const GROUPTYPE = {
    GROUP: 0,
    SUBGROUP: 1
}

const CATEGORY = [
    {
        id: 1,
        cat_name: "Education",
        cat_description: "aa",
        cat_image: "aa",
        parent_id: null,
    },
    {
        id: 2,
        cat_name: "Society",
        cat_description: "aa",
        cat_image: "aa",
        parent_id: null,
    },
    {
        id: 3,
        cat_name: "Science",
        cat_description: "aa",
        cat_image: "aa",
        parent_id: null,
    },
];

const ThumballAssign = (props) => {

    let history = useHistory();

    let groupid = props.history.location.pathname.split("/").slice(-1)[0];

    const [loading, setLoading] = useState(true);

    const [assign, setAssign] = useState(ASSIGN.THUMBALL);

    const [type, setType] = useState(groupid === "assign" ? ASSIGNTO.INDIVIDUALS : ASSIGNTO.GROUPS);
    const [selectfrom, setSelectFrom] = useState(SELECTFROM.ALL);
    const [groups, setGroups] = useState([]);
    const [groups_original, setGroupsOriginal] = useState([]);

    const [fixed, setFixed] = useState(groupid === "assign" ? false : true);
    const [group, setGroup] = useState(groupid === "assign" ? [] : groupid);


    const [users, setUsers] = useState([]);

    const [mycreatedthumballs, setMyCreatedThumballs] = useState([]);
    const [allthumballs, setAllThumballs] = useState([]);

    const [categories, setCategories] = useState([]);

    const [category, setCategory] = useState("");
    const [thumball, setThumball] = useState("");

    const [individual, setIndividual] = useState("");
    const [individuals, setIndividuals] = useState([]);

    const [usertype, setUserType] = useState(0);
    const [userid, setUserId] = useState("");

    useEffect(() => {
        getGroup();
        getUsers();
        getMyCreatedThumballs();
        getThumballsByCategory();
        getParentId();
    }, []);

    const getParentId = () => {
        var data = JSON.parse(localStorage.getItem("authUser"));
        if (data) {
            setUserId(data.uid);
            setUserType(Number(data.user_type_id));
        }
    }

    const getUsers = () => {

        var data = JSON.parse(localStorage.getItem("authUser"));

        var users_ = [];

        if (data) {

            if (Number(data.user_type_id) === USERTYPE.CUSTOMER) {

                props.firebase.appusers().where("customer_id", "==", data.uid).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            users_.push({ id: doc.id, ...doc.data() });
                        });
                        console.log("Users Received-----", users_);

                        setUsers(users_);
                        setLoading(false);
                    });

            } else {

                props.firebase.appusers().where("editor_id", "==", data.uid).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            users_.push({ id: doc.id, ...doc.data() });
                        });
                        console.log("Users Received-----", users_);

                        setUsers(users_);
                        setLoading(false);
                    });
            }

        }
    }

    const getGroup = () => {

        var groups_ = [];

        props.firebase.groups().get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    groups_.push({ id: doc.id, ...doc.data() });
                });
                console.log("Groups Received-----", groups_);

                if (groupid === "assign") {
                    let group_ = {};
                    groups_.forEach(item => {
                        group_[item.id] = true;
                    });
                    setGroup(group_);

                }

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
            if (parentid !== null) {
                group_[parentid] = true;
            }
        }

        setGroup(group_);
    }

    const getMyCreatedThumballs = () => {

        setLoading(true);
        var data = JSON.parse(localStorage.getItem("authUser"));

        if (data) {

            let thumballs_ = [];

            props.firebase.thumballs().where("author_id", "==", data.uid).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        thumballs_.push({ id: doc.id, ...doc.data() });
                    });
                    console.log("My Created Thumballs Received-----", thumballs_);

                    setMyCreatedThumballs(thumballs_);
                    setLoading(false);
                });

        }
    }

    const getThumballsByCategory = () => {

        let thumballs_ = [];
        let categories_ = [];

        props.firebase.thumballs().orderBy("category", "asc").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    thumballs_.push({ id: doc.id, ...doc.data() });
                });

                let formerCategory = "";

                thumballs_.forEach(thumball => {
                    if (thumball.category !== formerCategory) {
                        console.log("thumball.category-----", thumball.category);
                        categories_.push({ id: thumball.category, name: CATEGORY.find(x => x.id === Number(thumball.category)).cat_name });
                        formerCategory = thumball.category;
                    }
                })
                console.log("All Thumballs Received-----", thumballs_);
                console.log("Categories-----", categories_);

                setAllThumballs(thumballs_);
                setCategories(categories_);
                setLoading(false);
            });

    }

    const handleIndividuals = id => {

        console.log("id-----", id)

        if (individuals.includes(id)) {
            setIndividuals(individuals.filter(item => item !== id));
        } else {
            setIndividuals([...individuals, id]);
        }

    }

    const assignThumball = () => {

        if(!thumball) {
            return;
        }

        if (type === ASSIGNTO.INDIVIDUAL && individual !== "") {

            setLoading(true);

            props.firebase.appuser(individual).get()
                .then(doc => {
                    if (doc.exists) {
                        var res = doc.data();
                        return !!res.thumballs ? res.thumballs : [];
                    }
                })
                .then(thumballs => {

                    if (!thumballs.includes(thumball)) {
                        thumballs.push(thumball);
                        props.firebase.appuser(individual).update({
                            thumballs: thumballs
                        })
                            .then(() => {
                                console.log("-----Thumball Assigned To App User-----");
                                setLoading(false);
                                history.push("/thumballs/all");
                            })
                            .catch(error => {
                                console.log("=====error", error);
                                setLoading(false);
                            });
                    } else {
                        setLoading(false);
                    }

                });

        }

        if (type === ASSIGNTO.INDIVIDUALS && individuals.length !== 0) {

            let index = 0;

            individuals.forEach(item => {

                setLoading(true);

                props.firebase.appuser(item).get()
                    .then(doc => {
                        if (doc.exists) {
                            var res = doc.data();
                            return !!res.thumballs ? res.thumballs : [];
                        }
                    })
                    .then(thumballs => {

                        if (!thumballs.includes(thumball)) {
                            thumballs.push(thumball);
                            props.firebase.appuser(item).update({
                                thumballs: thumballs
                            })
                                .then(() => {
                                    console.log("-----Thumball Assigned To App User-----");
                                    setLoading(false);
                                    index++;
                                    if (index === individuals.length) {
                                        history.push("/thumballs/all");
                                    }
                                })
                                .catch(error => {
                                    console.log("=====error", error);
                                    setLoading(false);
                                });
                        } else {
                            setLoading(false);
                        }

                    });
            })
        }

        if (type === ASSIGNTO.GROUPS) {

            props.firebase.appusers().where(usertype === USERTYPE.CUSTOMER ? "customer_id" : "editor_id", "==", userid).get()
                .then((querySnapshot) => {

                    let users_ = [];
                    querySnapshot.forEach((doc) => {
                        users_.push({ id: doc.id, ...doc.data() });
                    });
                    console.log("Users Received-----", users_);

                    return users_;
                })
                .then(users => {

                    let users_modified = users.filter(user => {
                        let value = false;
                        Object.keys(user.group).forEach(key => {
                            if (user.group[key] && group[key]) {
                                value = true;
                            }
                        });
                        return value;
                    });

                    let index = 0;

                    users_modified.forEach(user => {
                        props.firebase.appuser(user.id).get()
                            .then(doc => {
                                if (doc.exists) {
                                    var res = doc.data();
                                    return !!res.thumballs ? res.thumballs : [];
                                }
                            })
                            .then(thumballs => {

                                if (!thumballs.includes(thumball)) {
                                    thumballs.push(thumball);
                                    props.firebase.appuser(user.id).update({
                                        thumballs: thumballs
                                    })
                                        .then(() => {
                                            console.log("-----Thumball Assigned To App User-----");
                                            setLoading(false);
                                            index++;
                                            if (index === users_modified.length) {
                                                history.push("/thumballs/all");
                                            }
                                        })
                                        .catch(error => {
                                            console.log("=====error", error);
                                            setLoading(false);
                                        });
                                } else {
                                    setLoading(false);
                                }

                            });
                    })
                })
        }

    }

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="thumballs" page="assign" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Assign Thumball/Thumbtrack </li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="col-12">

                                <div className="box__wrapper">
                                    <div className="form__container">

                                        <div className="row">
                                            <div className="col-md-7 col-sm-12">
                                                <label htmlFor="exampleFormControlSelect1 mb-4">Assign a:</label>
                                                <div className="form-group d-flex justify-content-between">

                                                    <div className="custom-radio form-check-inline m-0">
                                                        <input className={assign === ASSIGN.THUMBALL ? "custom-radio-input checked" : "custom-radio-input"} id="someRadio-71" name="radio-assign" type="radio" onChange={() => setAssign(ASSIGN.THUMBALL)} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-71"></label>
                                                        <label className="custom-radio-label custom-radio-label2" htmlFor="someRadio-71">Thumball</label>
                                                    </div>
                                                    <div className="custom-radio form-check-inline m-0">
                                                        <input className={assign === ASSIGN.THUMBTRACK ? "custom-radio-input checked" : "custom-radio-input"} id="someRadio-72" name="radio-assign" type="radio" onChange={() => setAssign(ASSIGN.THUMBTRACK)} />
                                                        <label className="custom-radio-elem" htmlFor="someRadio-72"></label>
                                                        <label className="custom-radio-label custom-radio-label2" htmlFor="someRadio-72">Thumbtrack</label>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row d-flex justify-content-start d-flex align-items-center">
                                            <div className="col-md-8 col-sm-12">
                                                <label htmlFor="exampleFormControlSelect1">Select from:</label>
                                                <div className="row">
                                                    <div className="col-md-6 col-sm-12">
                                                        <div className="custom-radio form-check-inline m-0">
                                                            <input className="custom-radio-input" id="someRadio-32" name="radio-selectfrom" type="radio" defaultChecked onChange={() => setSelectFrom(SELECTFROM.ALL)} />
                                                            <label className="custom-radio-elem mb-0" htmlFor="someRadio-32"></label>
                                                            <label className="custom-radio-label2" htmlFor="someRadio-32">All available Thumballs</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-sm-12">
                                                        <div className="custom-radio form-check-inline m-0">
                                                            <input className="custom-radio-input" id="someRadio-33" name="radio-selectfrom" type="radio" onChange={() => setSelectFrom(SELECTFROM.CREATED)} />
                                                            <label className="custom-radio-elem mb-0" htmlFor="someRadio-33"></label>
                                                            <label className="custom-radio-label2" htmlFor="someRadio-33">My created Thumballs</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectfrom === SELECTFROM.CREATED &&
                                                <div className="col-md-4 col-sm-12">
                                                    <label>Select Thumball</label>
                                                    <select className="form-control form-control-gra" id="exampleFormControlSelect1">
                                                        <option value="" disabled defaultValue>Select Thumball</option>
                                                        {mycreatedthumballs !== [] && mycreatedthumballs.map(item => (
                                                            <option key={item.id} value={item.id}>{item.title}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            }
                                        </div>
                                        {selectfrom === SELECTFROM.ALL &&
                                            <div className="row d-flex justify-content-between d-flex align-items-center my-2">

                                                <div className="col-md-6 col-sm-12">
                                                    <label>Select Thumball Category</label>
                                                    <select className="form-control form-control-gra" value={category} onChange={e => setCategory(e.target.value)}>
                                                        <option value="" disabled defaultValue>Select Category</option>
                                                        {categories !== [] && categories.map(item => (
                                                            <option key={item.id} value={item.id}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-md-6 col-sm-12">
                                                    <label>Select Thumball</label>
                                                    <select className="form-control form-control-gra" value={thumball} onChange={e => setThumball(e.target.value)}>
                                                        <option value="" disabled defaultValue>Select Thumball</option>
                                                        {allthumballs != [] && allthumballs.filter(x => x.category === category).map(item => (
                                                            <option key={item.id} value={item.id}>{item.title}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        }
                                        <div className="row d-flex justify-content-between d-flex align-items-center my-2">
                                            <div className="col-md-5 col-sm-12">
                                                <label>Assign to</label>
                                                {fixed ?
                                                    <select className="form-control form-control-gra" id="exampleFormControlSelect1" value={type} readOnly>
                                                        <option value={ASSIGNTO.GROUPS}>Group(s)</option>
                                                    </select>
                                                    :
                                                    <select className="form-control form-control-gra" id="exampleFormControlSelect1" value={type} onChange={e => setType(Number(e.target.value))}>
                                                        <option value={ASSIGNTO.INDIVIDUALS}>Individuals</option>
                                                        <option value={ASSIGNTO.INDIVIDUAL}>Individual</option>
                                                        <option value={ASSIGNTO.GROUPS}>Group(s)</option>
                                                    </select>
                                                }
                                            </div>
                                            {type === ASSIGNTO.INDIVIDUAL &&
                                                <div className="col-md-7 col-sm-12">
                                                    <label>Enter the individual’s name that you would like to assign this to</label>
                                                    <select className="form-control form-control-gra" value={individual} onChange={e => setIndividual(e.target.value)}>
                                                        <option value="" disabled defaultValue>Select Name</option>
                                                        {users !== [] && users.map(user => (
                                                            <option key={user.id} value={user.id}>{user.first_name + " " + user.last_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            }
                                        </div>
                                        {type === ASSIGNTO.INDIVIDUALS &&
                                            <div className="row d-flex justify-content-start d-flex align-items-center mt-4">
                                                <div className="col-sm-12 mb-4">Select the individuals that you would like to assign this to:</div>
                                                {users !== [] && users.map(user => (
                                                    <div key={user.id} className="col-md-4 col-sm-12">
                                                        <label className="container-panel">{user.first_name + " " + user.last_name}
                                                            <input type="checkbox" checked={individuals.includes(user.id)} onChange={() => handleIndividuals(user.id)} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        }
                                        {type === ASSIGNTO.GROUPS &&
                                            // <div className="row d-flex justify-content-start d-flex align-items-center mt-4">
                                            <div className="mt-4">
                                                <div className="col-sm-12 mb-4">Select the group(s) that you would like to assign this to:</div>
                                                {/* {groups !== [] && groups.map(group => (
                                                    <div key={group.id} className="col-md-4 col-sm-12">
                                                        <label className="container-panel">{group.group_name}
                                                            <input type="checkbox" defaultChecked />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                ))} */}
                                                {fixed && groups !== [] && groups.map(el => (
                                                    <div key={el.index}>
                                                        <label className="container-panel mb-3">
                                                            {el.group_name}<span className="text-lowercase">(group)</span>
                                                            <input type="checkbox" checked={el.id === group} readOnly />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                        <div className="pl-5">
                                                            {el.subgroups.map(item => (
                                                                <label key={item.id} className="container-panel">
                                                                    {item.group_name}
                                                                    <input type="checkbox" checked={item.id === group || el.id === group} readOnly />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                        <hr />
                                                    </div>
                                                ))}
                                                {!fixed && groups !== [] && groups.map(el => (
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
                                        }
                                        <div className="form-group my-4">
                                            <a href="/thumballs/all"><button type="submit" className="btn btn__submit btn__cancel mr-4">Cancel</button></a>
                                            <button type="button" className="btn btn__submit" onClick={assignThumball}>Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <CopyrightBrand />
                            </div>
                        </div>
                    </div>
                </div></>
        </LoadingLayout>
    )
}

const condition = authUser => !!authUser && (Number(authUser.user_type_id) === USERTYPE.CUSTOMER || Number(authUser.user_type_id) === USERTYPE.EDITOR);

export default compose(withFirebase, withAuthorization(condition))(ThumballAssign);