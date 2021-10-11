import React, { useState } from 'react'

import icon1 from '../../../images/icon-1.png';
import icon2 from '../../../images/icon-2.png';
import icon3 from '../../../images/icon-3.png';
import icon6 from '../../../images/icon-6.png';
import cross from '../../../images/cross.png';
import and from '../../../images/and.png';
import icon7 from '../../../images/icon-7.png';

import LeftSideBar from '../../../layouts/LeftSideBar';
import CopyrightBrand from '../../../components/CopyrightBrand';
import LoadingLayout from '../../../layouts/LoadingLayout';
import TopRight from '../../../components/TopRight';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import { USERTYPE } from '../../../constants/usertypes';

const ThumballAddSegment = () => {
  const [loading, setLoading] = useState(false);
  const [filter2, setFilter2] = useState(false);
  return (
    <LoadingLayout loading={loading}>
      <>
        <div className="dashboard__menu">
          <LeftSideBar active="notifications" page="segment" />
        </div>
        <div className="dashboard__content">
          <div className="ml-0">
            <div className="row">
              <div className="col-12">
                <div className="dashboard__header">
                  <ul className="breadcumb">
                    <li><a href="/">Home</a></li>
                    <li><i className="fa fas fa-chevron-right"></i></li>
                    <li><a href="#">Notifications</a></li>
                    <li><i className="fa fas fa-chevron-right"></i></li>
                    <li className="active">Create Segment</li>
                  </ul>
                  <TopRight setLoading={setLoading} />
                </div>
              </div>
              <div className="col-12">
                <div className="segment__wrapper">
                  <h4 className="segment__title">Create New Segment</h4>
                  <table className="table segment__table-1">
                    <tbody>
                      <tr>
                        <td style={{ width: "10%" }}><img src={icon1} className="img-1" alt="icon1" /></td>
                        <td style={{ width: "70%" }}>
                          <form>
                            <input type="text" className="custom__class" placeholder="Speech Therapy All Thumball Users" name="" onChange={() => console.log()} />
                          </form>
                        </td>
                        <td style={{ width: "10%" }}>
                          <img src={icon2} alt="icon2" />
                        </td>
                        <td style={{ width: "10%" }}>
                          <p>15</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="table segment__table-2">
                    <tbody>
                      <tr>
                        <td style={{ backgroundColor: "#fffbf3", width: "25%" }}>
                          <div className="d-flex align-items-center">
                            <img src={icon3} width="80" alt="icon3" />
                            <p className="title-1">First Session</p>
                          </div>
                        </td>
                        <td style={{ width: "30%", textAlign: "center" }}>
                          <select className="custom-select">
                            <option defaultValue>Greater than</option>
                            <option value="1">Less than</option>
                            <option value="2">Is</option>
                          </select>
                        </td>
                        <td style={{ width: "10%", textAlign: "center" }}>
                          <input type="text" name="" value="168" className="season__value" onChange={() => console.log()} />
                        </td>
                        <td style={{ width: "10%", textAlign: "center" }}>
                          <p style={{ color: "#ababab", fontWeight: "500" }} >hours ago</p>
                        </td>
                        <td style={{ width: "25%", textAlign: "right", paddingRight: "40px" }}>
                          <a href="#"><img src={cross} alt="cross" /></a>
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: "#fff" }}>
                        <td colSpan="5" style={{ padding: "0px 23px" }}>
                          <img src={and} alt="and" />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ backgroundColor: "#fffbf3", width: "25%" }}>
                          <div className="d-flex align-items-center">
                            <img src={icon3} width="80" alt="icon3" />
                            <p className="title-1">Last Session</p>
                          </div>
                        </td>
                        <td style={{ width: "30%", textAlign: "center" }}>
                          <select className="custom-select">
                            <option defaultValue>Greater than</option>
                            <option value="1">Less than</option>
                            <option value="2">Is</option>
                          </select>
                        </td>
                        <td style={{ width: "10%", textAlign: "center" }}>
                          <input type="text" name="" value="72" className="season__value" onChange={() => console.log()} />
                        </td>
                        <td style={{ width: "10%", textAlign: "center" }}>
                          <p style={{ color: "#ababab", fontWeight: "500" }}>hours ago</p>
                        </td>
                        <td style={{ width: "25%", textAlign: "right", paddingRight: "40px" }}>
                          <a href="#"><img src={cross} alt="cross" /></a>
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: "#fff" }}>
                        <td colSpan="5">
                          <a href="#" className="filter__btn ml-auto addpanel">Add Filter</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text__wrapper">
                    <span>or</span>
                  </div>
                  <table className="table segment__table-2 ans-hint">
                    <tbody className="ans-flds">
                      <tr className="ans-fld">
                        <td style={{ backgroundColor: "#fffbf3", width: "25%" }}>
                          <div className="d-flex align-items-center">
                            <img src={icon6} width="80" alt="icon6" />
                            <p className="title-1">Session Count</p>
                          </div>
                        </td>
                        <td style={{ width: "30%", textAlign: "center" }}>
                          <select className="custom-select">
                            <option defaultValue>Greater than</option>
                            <option value="1">Less than</option>
                            <option value="2">Is</option>
                          </select>
                        </td>
                        <td style={{ width: "10%", textAlign: "center" }}>
                          <input type="text" name="" value="5" className="season__value" onChange={() => console.log()} />
                        </td>
                        <td style={{ width: "10%", textAlign: "center" }}>
                          <p style={{ color: "#ababab", fontWeight: "500" }}>sessions</p>
                        </td>
                        <td style={{ width: "25%", textAlign: "right", paddingRight: "40px" }}>
                          <a href="#"><img src={cross} alt="cross" /></a>
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: "#fff" }}>
                        {filter2 ?
                          <>
                            <td style={{ backgroundColor: "#fffbf3", width: "25%" }}>
                              <div className="d-flex align-items-center">
                                <img src={icon7} width="80" alt="icon7" />
                                <select className="custom-select">
                                  <option value="" disabled defaultValue>Select Filter</option>
                                  <option value="1">One</option>
                                  <option value="2">Two</option>
                                  <option value="3">Three</option>
                                </select>
                              </div>
                            </td>
                            <td colSpan="3" style={{ width: "10%", textAlign: "center", paddingLeft: "20px" }}>
                              <input className="add-segment-filter-description" placeholder="Filter description/explanation text goes here." />
                            </td>
                            <td style={{ width: "25%", textAlign: "right", paddingRight: "40px" }}>
                              <a onClick={() => setFilter2(false)} className="cursor-pointer"><img src={cross} alt="cross" /></a>
                            </td>
                          </>
                          :
                          <td colSpan="5" className="px-4">
                            <a className="button filter__btn ml-auto addpanel cursor-pointer" onClick={() => setFilter2(true)}>Add Filter</a>
                          </td>
                        }

                      </tr>
                    </tbody>
                  </table>
                  <div className="text-right px-4 pb-4">
                    <a href="#" className="filter__btn ml-auto addor">Add Or</a>
                  </div>
                  <div className="text__wrapper">
                    <span>FInished?</span>
                  </div>
                  <table className="table segment__table-2">
                    <tbody>
                      <tr style={{ backgroundColor: "#fff" }}>
                        <td colSpan="3" style={{ width: "70%", textAlign: "left" }}>
                          <a href="#" className="filter__btn mr-auto bg-del">Delete</a>
                        </td>
                        <td style={{ width: "15%", paddingRight: "15px" }}>
                          <a href="#" className="filter__btn ml-auto bg-cancel">Cancel</a>
                        </td>
                        <td style={{ width: "15%" }}>
                          <a href="#" className="filter__btn ml-auto bg-update">Update</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
const condition = authUser => !!authUser && !(Number(authUser.user_type_id) === USERTYPE.EDITOR && !authUser.capability.notification);

export default compose(withFirebase, withAuthorization(condition))(ThumballAddSegment);

