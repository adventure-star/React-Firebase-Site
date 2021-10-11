import React, { useState, useEffect } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import LoadingLayout from '../../../layouts/LoadingLayout';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import { useHistory } from 'react-router-dom';
import { USERTYPE } from '../../../constants/usertypes';

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const GroupAdd = (props) => {

  let history = useHistory();

  const [loading, setLoading] = useState(false);

  const [groupList, setGroupList] = useState(false);

  const [name, setName] = useState("");
  const [parentgroupid, setParentGroupId] = useState(null);
  const [description, setDescription] = useState("");

  const [groups, setGroups] = useState([]);

  const addGroup = () => {

    if (groupList && parentgroupid === null) {
      return;
    }

    if (!validateName(name)) return;

    setLoading(true);

    var data = JSON.parse(localStorage.getItem("authUser"));

    var ref = props.firebase.groups().doc();

    ref.set({
      user_id: data.uid,
      group_name: name,
      parent_id: parentgroupid,
      description: description,
      date_created: new Date(),
      date_modified: new Date()
    })
      .then(() => {
        console.log("-----Group Created-----");
        setLoading(false);
        history.push("/groups/all");
      })
      .catch(error => {
        console.log("=====error", error);
        setLoading(false);
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

      });

  }

  const getGroup = () => {

    setLoading(true);

    var groups_ = [];

    props.firebase.groups().where("parent_id", "==", null).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          groups_.push({ id: doc.id, ...doc.data() });
        });
        console.log("Groups Received-----", groups_);
        setGroups(groups_);
        setLoading(false);
      });
  }

  const validateName = (name) => {
    var result = name !== "" ? true : false;
    groups.forEach(item => {
      if (item.group_name === name) {
        result = false;
      }
    });
    console.log("result-----", result);

    return result;
  }

  useEffect(() => {
    setLoading(true);
    getGroup();
  }, []);

  return (
    <LoadingLayout loading={loading}>
      <>
        <div className="dashboard__menu">
          <LeftSideBar active="groups" page="new" />
        </div>
        <div className="dashboard__content">
          <div className="ml-0">
            <div className="row">
              <div className="col-12">
                <div className="dashboard__header">
                  <ul className="breadcumb">
                    <li><a href="/">Home</a></li>
                    <li><i className="fa fas fa-chevron-right"></i></li>
                    <li className="active">New Group/ Subgroup</li>
                  </ul>
                  <TopRight setLoading={setLoading} />
                </div>
              </div>
              <div className="col-12">
                <div className="box__wrapper">
                  <div className="form__container">
                    <div>
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" className="form-control" placeholder="Enter Name" value={name} onChange={e => setName(e.target.value)} />
                      </div>

                      <label htmlFor="grouporsubgroup pl-3">Is this a Group or Subgroup?</label>
                      <div className="form-group">
                        <div className="custom-radio form-check-inline">
                          <input className="custom-radio-input" id="someRadio-1" name="someRadio" type="radio" onChange={() => { setGroupList(false); setParentGroupId(null); }} defaultChecked />
                          <label className="custom-radio-elem" htmlFor="someRadio-1"></label>
                          <label className="custom-radio-label" htmlFor="someRadio-1">Group</label>
                        </div>
                        <div className="custom-radio form-check-inline">
                          <input className="custom-radio-input" id="someRadio-2" name="someRadio" type="radio" onChange={() => setGroupList(true)} />
                          <label className="custom-radio-elem" htmlFor="someRadio-2"></label>
                          <label className="custom-radio-label" htmlFor="someRadio-2">SubGroup</label>
                        </div>

                      </div>

                      {groupList &&
                        <div className="form-group">
                          <label htmlFor="exampleFormControlSelect1">Group this subgroup belongs to</label>
                          <select className="form-control" id="exampleFormControlSelect1" value={parentgroupid != null ? parentgroupid : ""} onChange={e => setParentGroupId(e.target.value)}>
                            <option value="" disabled defaultValue>Select Group</option>
                            {groups !== [] && groups.map(group => (
                              <option key={group.id} value={group.id}>{group.group_name}</option>
                            ))
                            }
                          </select>
                        </div>
                      }

                      <div className="form-group">
                        <label htmlFor="desc">Description</label>
                        <input type="text" className="form-control h-150" placeholder="Add Description here..." value={description} onChange={e => setDescription(e.target.value)} />
                      </div>

                      <a href="/groups/all"><button type="button" className="btn btn__submit btn__cancel mr-4">Cancel</button></a>
                      <button type="button" className="btn btn__submit" onClick={addGroup}>Save</button>
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

const condition = authUser => !!authUser && (Number(authUser.user_type_id) === USERTYPE.CUSTOMER || (Number(authUser.user_type_id) === USERTYPE.EDITOR && authUser.capability.group));

export default compose(withFirebase, withAuthorization(condition))(GroupAdd);