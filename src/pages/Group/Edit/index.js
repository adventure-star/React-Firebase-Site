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

const GroupEdit = (props) => {

  let history = useHistory();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [othergroups, setOtherGroups] = useState([]);

  const getGroupExceptID = id => {

    setLoading(true);

    var groups_ = [];

    props.firebase.groups().get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id !== id) {
            groups_.push({ id: doc.id, ...doc.data() });
          }
        });
        console.log("Received-----", groups_);
        setOtherGroups(groups_);
        setLoading(false);
      });
  }

  const update = () => {

    if(!validateName(name)) return;

    setLoading(true);

    var ref = props.firebase.group(props.match.params.id);

    ref.update({
      group_name: name,
      description: description,
      date_modified: new Date()
    })
      .then(() => {
        console.log("-----Updated-----");
        setLoading(false);
        history.push("/groups/all");

      })
      .catch(error => {
        console.log("=====error", error);
        setLoading(false);
      });

  }

  const validateName = (name) => {
    var result = name !== "" ? true : false;
    othergroups.forEach(item => {
      if(item.group_name === name) {
        result = false;
      }
    });
    console.log("result-----", result);

    return result;
  }

  const getItemById = id => {

    setLoading(true);

    props.firebase.group(id).get()
      .then(doc => {
        if (doc.exists) {
          console.log("Received-----", doc.data());
          var res = doc.data();

          setName(res.group_name);
          setDescription(res.description);

          setLoading(false);
        }
      })
  }

  useEffect(() => {
    getItemById(props.match.params.id);
    getGroupExceptID(props.match.params.id);
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

                      <div className="form-group">
                        <label htmlFor="desc">Description</label>
                        <input type="text" className="form-control h-150" placeholder="Add Description here..." value={description} onChange={e => setDescription(e.target.value)} />
                      </div>

                      <a href="/groups/all"><button type="button" className="btn btn__submit btn__cancel mr-4">Cancel</button></a>
                      <button type="button" className="btn btn__submit" onClick={update}>Save</button>
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

export default compose(withFirebase, withAuthorization(condition))(GroupEdit);