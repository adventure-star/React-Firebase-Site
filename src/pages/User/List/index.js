import React, { useState, useEffect } from 'react'

import active from '../../../images/active.png';
import edit from '../../../images/edit.png';
import graph from '../../../images/graph.png';
import inactive from '../../../images/inactive.png';
import archived from '../../../images/archived.png';
import LeftSideBar from '../../../layouts/LeftSideBar';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import LoadingLayout from '../../../layouts/LoadingLayout';
import PerPageSelect from '../../../components/PerPageSelect';
import Pagination from '../../../components/Pagination';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import { USERTYPE } from '../../../constants/usertypes';

const UsersList = (props) => {

  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const [pagenumber, setPageNumber] = useState(0);
  const [perpage, setPerPage] = useState(5);

  const [sortasc, setSortASC] = useState(true);
  const [sorttype, setSortType] = useState("name");

  const [usertype, setUserType] = useState(0);
  const [capability, setCapability] = useState({});

  useEffect(() => {

    getGroup()
      .then(() => {
        getUsers();
      });

  }, []);

  const getUsers = () => {

    var data = JSON.parse(localStorage.getItem("authUser"));

    var users_ = [];

    if (data) {

      setUserType(data.user_type_id);
      setCapability(data.capability);

      console.log("getParentId----data-=----", data);

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

    setLoading(true);

    var groups_ = [];

    return props.firebase.groups().get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          groups_.push({ id: doc.id, ...doc.data() });
        });
        console.log("Groups Received-----", groups_);
        setGroups(groups_);
      });
  }

  const getGroupNamesByIdArray = (ids, type) => {

    let groups_ = [];
    let subgroups_ = [];

    Object.keys(ids).forEach(key => {
      if (ids[key]) {

        groups.forEach(group => {
          if (group.id === key) {
            if (group.parent_id === null) {
              if (!groups_.includes(group.group_name)) {
                groups_.push(group.group_name);
              }
            } else {
              subgroups_.push(group.group_name);
              if (!groups_.includes(getGroupNameById(group.parent_id))) {
                groups_.push(getGroupNameById(group.parent_id));
              }
            }
          }
        });

      }
    });

    console.log("groups_-----", groups_);
    console.log("subgroups_-----", subgroups_);

    if (type === 0) {
      return groups_.join(", ");
    } else {
      return subgroups_.join(", ");
    }

  }

  const getGroupNameById = (id) => {

    var data = groups.filter(group => group.id === id)[0];
    if (data !== undefined) {
      return data.group_name;
    }

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
            setUsers(users.sort((a, b) => b.first_name > a.first_name ? 1 : -1));

          } else {
            setUsers(users.sort((a, b) => a.first_name > b.first_name ? 1 : -1));

          }
          setSortASC(!sortasc);
        } else {
          setUsers(users.sort((a, b) => a.first_name > b.first_name ? 1 : -1));
          setSortASC(true);
        }
        break;
      case "status":
        if (type === sorttype) {
          if (sortasc) {
            setUsers(users.sort((a, b) => b.last_name > a.last_name ? 1 : -1));

          } else {
            setUsers(users.sort((a, b) => a.last_name > b.last_name ? 1 : -1));

          }
          setSortASC(!sortasc);
        } else {
          setUsers(users.sort((a, b) => a.last_name > b.last_name ? 1 : -1));
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
          <LeftSideBar active="users" page="all" />
        </div>
        <div className="dashboard__content">
          <div className="ml-0">
            <div className="row">
              <div className="col-12">
                <div className="dashboard__header">
                  <ul className="breadcumb">
                    <li><a href="/">Home</a></li>
                    <li><i className="fa fas fa-chevron-right"></i></li>
                    <li className="active">Users</li>
                  </ul>
                  <TopRight setLoading={setLoading} />
                </div>
              </div>
              <div className="card-panel">
                <div className="d-flex justify-content-between align-items-center pb-3 border-new">
                  <div className="Customers-title">Users List</div>
                  <div><a href="/users/new" className="btn bg-col btn-new btn-fill"> Add User </a></div>
                </div>

                <div className="row mb-4 justify-content-between">
                  <div className="col-sm-6">
                    <div className="row">
                      <div className="col-sm-5">
                        <div className="grip">
                          <input type="" className="input-box" placeholder="Group" name="" />
                        </div>
                      </div>
                      <div className="col-sm-7">
                        <div className="grip2">
                          <input type="" className="input-box2" placeholder="Math" name="" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-5">
                    <PerPageSelect
                      title="Users Per Page"
                      perpage={perpage}
                      handlePerPage={handlePerPage}
                    />
                  </div>

                </div>

                <table className="table table-2 table-4">
                  <tbody>
                    <tr>
                      <th className="text-left cursor-pointer" onClick={() => sort("name")}>Name <i className="fa fa-sort" aria-hidden="true"></i></th>
                      <th className="text-left cursor-pointer" onClick={() => sort("status")}>Status <i className="fa fa-sort" aria-hidden="true"></i></th>
                      <th>Last Login</th>
                      <th>of Sessions</th>
                      <th>Thumballs Assigned</th>
                      <th>Group</th>
                      <th>Subgroups</th>
                      <th>Analytics</th>
                      {!(usertype === USERTYPE.EDITOR && !capability.user) &&
                        <th>Edit</th>
                      }
                    </tr>

                    {users !== [] &&
                      users.slice(pagenumber * perpage, (pagenumber + 1) * pagenumber > groups.length - 1 ? groups.length : (pagenumber + 1) * perpage).map(user => (
                        <tr key={user.id}>
                          <td>{user.first_name + " " + user.last_name}</td>
                          <td>
                            {/* {user.status === 0 &&
                            <img src={inactive} alt="inactive" />
                          }
                          {user.status === 1 &&
                            <img src={active} alt="active" />
                          }
                          {user.status === 2 &&
                            <img src={archived} alt="archived" />
                          } */}
                            <img src={active} alt="active" />
                          </td>
                          <td>
                            {/* {user.lastlogin === null ?
                            <div className="resend">
                              Resend
                              Invitation
                            </div> : user.lastlogin} */}
                            <div className="resend">
                              Resend
                              Invitation
                            </div>
                          </td>
                          <td className="text-center">{user.ofsessions}</td>
                          <td className="text-center">{!!user.thumballs ? user.thumballs.length : 0}</td>
                          <td className="text-center">{getGroupNamesByIdArray(user.group, 0)}</td>
                          <td className="text-center">{getGroupNamesByIdArray(user.group, 1)}</td>
                          <td className="text-center"><img src={graph} alt="graph" /></td>
                          {!(usertype === USERTYPE.EDITOR && !capability.user) &&
                            <td className="text-center"><a href={"/users/edit/" + user.id}><img src={edit} /></a></td>
                          }
                        </tr>
                      ))
                    }

                  </tbody>
                </table>

                <Pagination
                  items={users}
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

export default compose(withFirebase, withAuthorization(condition))(UsersList);