import React, { useState } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';
import { Collapse } from 'react-collapse';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import LoadingLayout from '../../../layouts/LoadingLayout';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import { USERTYPE } from '../../../constants/usertypes';

const ThumballAnalyticsIndividual = () => {

    const [loading, setLoading] = useState(false);

    const [panel1, setPanel1] = useState(true);
    const [panel2, setPanel2] = useState(true);

    const [panel21, setPanel21] = useState(true);
    const [panel22, setPanel22] = useState(true);


    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="analytics" page="analytics" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Thumball Analytics</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="box__wrapper px-0 analyt">
                                    <div className="form__container">
                                        <div className="current-subs border-new">
                                            <h5>Thumball Analytics</h5>
                                        </div>
                                        <div className="analyt-inn">
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="analyt-txt">
                                                        <p><strong>Thumball Name: </strong>Food Safety Procedures</p>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="analyt-txt">
                                                        <p><strong>Type of Thumball: </strong> <span>Thumball Challenge - 32</span></p>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="analyt-txt">
                                                        <p><strong>Type of Questions: </strong> <span>Variety</span></p>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="panel d-block p-0 my-4">
                                                        <div className="ques-ans">
                                                            <strong>Question answered correctly most often on first attempt:</strong>
                                                            <p><span>Panel #3</span> - Food should not be left at room temperature for more than</p>
                                                        </div>
                                                        <div className="ques-ans">
                                                            <strong>Question answered incorrectly most often on first attempt:</strong>
                                                            <p><span>Panel #10</span> - Is it safe to put cooked food on a plate that held raw meat, poultry or seafood?</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row align-items-center indi-sel">
                                                        <div className="col">
                                                            <div className="report-inn d-flex align-items-center justify-content-center">
                                                                <label>Download Report: </label>
                                                                <select className="form-control m-0 ml-2" id="exampleFormControlSelect1">
                                                                    <option>User Detailed Report</option>
                                                                    <option>2</option>
                                                                    <option>3</option>
                                                                    <option>4</option>
                                                                    <option>5</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="report-inn d-flex align-items-center justify-content-center">
                                                                <label>Select User: </label>
                                                                <select className="form-control m-0 ml-2" id="exampleFormControlSelect1">
                                                                    <option>Austen, Jane</option>
                                                                    <option>2</option>
                                                                    <option>3</option>
                                                                    <option>4</option>
                                                                    <option>5</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="add-btn m-0">
                                                                <button type="button" className="btn btn__submit">Download Report</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion analytic-accord" id="accordion2">
                                    <div className="accordion-group create-thumb">
                                        <div className="accordion-heading">
                                            <div className="accordion-toggle" style={{ position: "relative" }} onClick={() => setPanel1(!panel1)}>
                                                <h5>Panel 1 <span>question type: Multiple Choice</span></h5>
                                                <p>Question: <span>Which one of the following is a legal responsibility of food handlers?</span></p>
                                                <span className="toggle-icon">&#9662;</span>
                                            </div>
                                        </div>
                                        <Collapse isOpened={panel1} >
                                            <div id="collapseOne" className="accordion-body collapse show">
                                                <div className="accordion-inner">
                                                    <div className="analytic-bdy">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <p><strong>Correct Answer: </strong>Wearing latex gloves when handling food</p>
                                                            <p><strong>Total attempts/sessions: </strong> 30</p>
                                                        </div>
                                                        <p><strong>Answered correctly – First Attempt (# and %): </strong>20 sessions or 66.67% of the time</p>
                                                        <p><strong>Answered correctly – Second Attempt (# and %): </strong>25 sessions or 83.33% of the time</p>
                                                    </div>
                                                    <button type="button" className="btn btn__submit addpanel">Read More</button>
                                                </div>
                                            </div>
                                        </Collapse>
                                    </div>
                                    <div className="accordion-group create-thumb">
                                        <div className="accordion-heading">
                                            <div className="accordion-toggle" style={{ position: "relative" }} onClick={() => setPanel2(!panel2)}>
                                                <h5>Panel 2 <span>question type:</span></h5>
                                                <p>Question: <span>Hands should be washed with water and soap for at least:</span></p>
                                                <span className="toggle-icon">&#9662;</span>
                                            </div>
                                        </div>
                                        <Collapse isOpened={panel2} >
                                            <div id="collapseTwo" className="accordion-body collapse show">
                                                <div className="accordion-inner">
                                                    <div className="analytic-bdy">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <p><strong>Correct Answer: </strong>20 seconds</p>
                                                            <p><strong>Total attempts/sessions: </strong> 30</p>
                                                        </div>
                                                        <p><strong>Answered correctly – First Attempt (# and %): </strong>24 sessions or 80% of the time</p>
                                                        <p><strong>Answered correctly – Second Attempt (# and %): </strong>27 sessions or 90% of the time</p>
                                                        <p><strong>Wrong answer most commonly chosen: </strong>10 seconds (4 sessions or 13% of the time)</p>


                                                        <div className="ans-selected">
                                                            <h6>How often each answer was selected</h6>
                                                            <p>5 seconds – 1 sessions or 3.33% (Answered 0 times on second attempt)</p>
                                                            <p>10 seconds – 4 sessions or 13.33% (Answered 1 time on second attempt)</p>
                                                            <p>15 seconds – 1 session or 3.33% (Answered 1 time on second attempt)</p>
                                                        </div>
                                                        <div className="accordion analytic-accord accord-inn" id="accordion33">
                                                            <div className="accordion-group create-thumb mb-5">
                                                                <div className="accordion-heading">
                                                                    <div className="accordion-toggle d-flex justify-content-between pr-4" onClick={() => setPanel21(!panel21)}>
                                                                        How did the groups perform?
                                                                    <div>&#9662;</div>
                                                                    </div>
                                                                </div>
                                                                <Collapse isOpened={panel21}>
                                                                    <div id="collapse1" className="accordion-body collapse show">
                                                                        <div className="accordion-inner">
                                                                            <p>Alpha Group – 20 sessions – 18 answered correctly on first attempt (90%)</p>
                                                                            <p>Omega Group – 10 sessions – 6 answered correctly on first attempt (60%)</p>
                                                                        </div>
                                                                    </div>
                                                                </Collapse>
                                                            </div>
                                                            <div className="accordion-group create-thumb">
                                                                <div className="accordion-heading">
                                                                    <div className="accordion-toggle d-flex justify-content-between pr-4" onClick={() => setPanel22(!panel22)}>
                                                                        How did individual users do?
                                                                    <div>&#9662;</div>
                                                                    </div>
                                                                </div>
                                                                <Collapse isOpened={panel22}>
                                                                    <div id="collapse2" className="accordion-body collapse show">
                                                                        <div className="accordion-inner">
                                                                            <table className="table table-2 table-3">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th>Name</th>
                                                                                        <th>Group</th>
                                                                                        <th>Date Attempted</th>
                                                                                        <th>Answered Correctly<br />
                                                                1st Attempt</th>
                                                                                        <th>Answered Correctly<br />
                                                                2nd Attempt</th>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Austen, Jane</td>
                                                                                        <td>Alpha</td>
                                                                                        <td>8-20-2020</td>
                                                                                        <td><span className="yestype">Yes</span></td>
                                                                                        <td><span className="notype">N/A</span></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Byrd, Dave</td>
                                                                                        <td>Omega</td>
                                                                                        <td>8-25-2020</td>
                                                                                        <td><span className="notype">No | 10 Seconds</span></td>
                                                                                        <td><span className="notype">No | 10 Seconds</span></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Deere, John</td>
                                                                                        <td>Omega</td>
                                                                                        <td>7-26-2020</td>
                                                                                        <td><span className="yestype">Yes</span></td>
                                                                                        <td><span className="notype">N/A</span></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Jobs, Steve</td>
                                                                                        <td>Alpha</td>
                                                                                        <td>9-2-2020</td>
                                                                                        <td><span className="notype">No | 10 Seconds</span></td>
                                                                                        <td><span className="yestype">Yes</span></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>Michaels, Brian</td>
                                                                                        <td>Alpha</td>
                                                                                        <td>8-11-2020</td>
                                                                                        <td><span className="yestype">Yes</span></td>
                                                                                        <td><span className="yestype">Yes</span></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </Collapse>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Collapse>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <CopyrightBrand />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </LoadingLayout>
    )
}

const condition = authUser => !!authUser && (Number(authUser.user_type_id) === USERTYPE.CUSTOMER || Number(authUser.user_type_id) === USERTYPE.EDITOR);

export default compose(withFirebase, withAuthorization(condition))(ThumballAnalyticsIndividual);
