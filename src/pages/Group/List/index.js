import React, { useState, useEffect } from 'react'

import thumballicon from '../../../images/thumball-icon.png';
import graph from '../../../images/graph.png';
import edit from '../../../images/edit.png';
import LeftSideBar from '../../../layouts/LeftSideBar';
import LoadingLayout from '../../../layouts/LoadingLayout';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import PerPageSelect from '../../../components/PerPageSelect';
import Pagination from '../../../components/Pagination';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import { USERTYPE } from '../../../constants/usertypes';

const GroupsList = (props) => {

    const [loading, setLoading] = useState(false);

    const [groups, setGroups] = useState([]);
    const [groups_show, setGroupsShow] = useState([]);
    const [users, setUsers] = useState([]);

    const [pagenumber, setPageNumber] = useState(0);
    const [perpage, setPerPage] = useState(5);

    const [sortasc, setSortASC] = useState(true);
    const [sorttype, setSortType] = useState("name");
    const [searchtext, setSearchText] = useState("");

    const [usertype, setUserType] = useState(0);
    const [capability, setCapability] = useState({});

    useEffect(() => {
        getGroups();
        getUsers();
        getUserType();
    }, []);

    useEffect(() => {
        setGroupsShow(groups.filter(x =>
            x.group_name.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1));
    }, [searchtext]);

    const getUserType = () => {

        var data = JSON.parse(localStorage.getItem("authUser"));
        if (data) {

            setUserType(data.user_type_id);
            setCapability(data.capability);
        }
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
                return groups_;
            })
            .then((groups_) => {

                var users_ = [];

                props.firebase.appusers().get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            users_.push({ id: doc.id, ...doc.data() });
                        });
                        console.log("Users Received-----", users_);

                        let groups_modified = groups_.map(item => {
                            let users = [];
                            users_.forEach(user => {
                                let list = [];
                                Object.keys(user.group).map(key => {
                                    if (user.group[key]) {
                                        list.push(key);
                                    }
                                })
                                if (list.includes(item.id)) {
                                    users.push(user.id);
                                }
                            });
                            return Object.assign({}, item, { users: users });

                        });

                        let groups_tosave = groups_modified.map(item => {
                            if (item.parent_id === null) {

                                let users = [];
                                groups_modified.forEach(el => {
                                    if (el.parent_id === item.id) {
                                        users.push(...el.users);
                                    }
                                });
                                if (users.length === 0) {
                                    return item;
                                } else {
                                    return Object.assign({}, item, { users: users });
                                }
                            } else {
                                return item;
                            }
                        })

                        console.log("groups_tosave-----", groups_tosave);

                        setGroups(groups_tosave);
                        setGroupsShow(groups_tosave);

                        setLoading(false);
                    });
            })
            ;
    }

    const getGroupNameById = id => {

        var data = groups.find(group => group.id === id);

        if (data !== undefined) {
            return data.group_name;
        }

    }

    const getUsers = () => {

        setLoading(true);

        var users_ = [];

        props.firebase.appusers().get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    users_.push({ id: doc.id, ...doc.data() });
                });
                console.log("Users Received-----", users_);

                setUsers(users_);
                setLoading(false);
            });
    }

    const handlePerPage = e => {
        setPerPage(e.target.value);
        setPageNumber(0);
    }

    const sort = (type) => {
        switch (type) {
            case "name":
                if (type === sorttype) {
                    if (sortasc) {
                        setGroups(groups_show.sort((a, b) => b.group_name > a.group_name ? 1 : -1));

                    } else {
                        setGroups(groups_show.sort((a, b) => a.group_name > b.group_name ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setGroups(groups_show.sort((a, b) => a.group_name > b.group_name ? 1 : -1));
                    setSortASC(true);
                }
                break;
            case "type":
                if (type === sorttype) {
                    if (sortasc) {
                        setGroups(groups_show.sort((a, b) => b.parent_id > a.parent_id ? 1 : -1));

                    } else {
                        setGroups(groups_show.sort((a, b) => a.parent_id > b.parent_id ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setGroups(groups_show.sort((a, b) => a.parent_id > b.parent_id ? 1 : -1));
                    setSortASC(true);
                }
                break;
        }
        setSortType(type);
        setPageNumber(0);

    }

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="groups" page="all" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">View Groups/Subgroups</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="card-panel">
                                <div className="d-flex justify-content-between align-items-center pb-3 border-new">
                                    <div className="Customers-title">Groups/Subgroups List</div>
                                    <div><a className="btn bg-col btn-new btn-fill" data-toggle="modal" href="/groups/new"> Add Group </a></div>
                                </div>

                                <div className="row mb-4 justify-content-between">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-5">
                                                <div className="grip2">
                                                    <input type="text" className="input-box" placeholder="Search" value={searchtext} onChange={e => setSearchText(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-5">
                                        <PerPageSelect
                                            title="Groups Per Page"
                                            perpage={perpage}
                                            handlePerPage={handlePerPage}
                                        />
                                    </div>

                                </div>

                                <table className="table table-2 table-3 group-list">
                                    <tbody>

                                        <tr>
                                            <th className="text-left cursor-pointer" onClick={() => sort("name")}> <div className="inline-flex"><span>Group / Subgroup <br /> name</span> <i className="fa fa-sort" aria-hidden="true"></i></div> </th>
                                            <th className="text-left cursor-pointer" onClick={() => sort("type")}>Type <i className="fa fa-sort" aria-hidden="true"></i></th>
                                            <th>Parent group</th>
                                            <th># of Users</th>
                                            <th>assign thumball/ <br /> thumbstacks</th>
                                            <th>analytics</th>
                                            {!(usertype === USERTYPE.EDITOR && !capability.user) &&
                                                <th>Edit</th>
                                            }
                                        </tr>

                                        {groups_show !== [] && groups_show.slice(pagenumber * perpage, (pagenumber + 1) * pagenumber > groups_show.length - 1 ? groups_show.length : (pagenumber + 1) * perpage).map(group => (
                                            <tr key={group.id}>
                                                <td>{group.group_name}</td>
                                                <td>
                                                    {group.parent_id !== null ?
                                                        "SubGroup"
                                                        :
                                                        "Group"
                                                    }
                                                </td>
                                                <td>
                                                    {group.parent_id !== null ?
                                                        getGroupNameById(group.parent_id)
                                                        :
                                                        "-------"
                                                    }
                                                </td>
                                                <td>{group.users.length}</td>
                                                <td><a href={"/thumballs/assign/group/" + group.id}><img src={thumballicon} alt="thumballicon" /></a></td>
                                                <td className="text-center"><a href="#"><img src={graph} alt="analytics" /></a></td>
                                                {!(usertype === USERTYPE.EDITOR && !capability.user) &&
                                                    <td className="text-center"><a href={"/groups/edit/" + group.id}><img src={edit} alt="edit" /></a></td>
                                                }
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>

                                <Pagination
                                    items={groups_show}
                                    pagenumber={pagenumber}
                                    perpage={perpage}
                                    setPageNumber={setPageNumber}
                                />
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

const condition = authUser => !!authUser && (Number(authUser.user_type_id) === USERTYPE.CUSTOMER || Number(authUser.user_type_id) === USERTYPE.EDITOR);

export default compose(withFirebase, withAuthorization(condition))(GroupsList);