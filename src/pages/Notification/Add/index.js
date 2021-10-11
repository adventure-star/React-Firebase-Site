import React, { useState, useEffect } from 'react'

import user2 from '../../../images/user-2.png';
import day from '../../../images/day.png';

import LeftSideBar from '../../../layouts/LeftSideBar';
import SearchForm from '../../../components/SearchForm';
import CopyrightBrand from '../../../components/CopyrightBrand';
import LoadingLayout from '../../../layouts/LoadingLayout';
import TopRight from '../../../components/TopRight';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import { USERTYPE } from '../../../constants/usertypes';


const NotificationAdd = () => {

    const [loading, setLoading] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const [audienceall, setAudienceAll] = useState(true);
    const [scheduleimmediate, setScheduleImmediate] = useState(true);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");


    useEffect(() => {
        setNotifications(demoList());
    }, []);

    const demoList = () => {
        return [
            {
                id: 1,
                title: "Help with building Custom Thumball",
                from: "Tom Jones",
                to: "",
                date: "Yesterday",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                brand: "Copy",
                state: 1
            },
            {
                id: 2,
                title: "How do I add an Editor?",
                from: "Tom Jones",
                to: "",
                date: "Yesterday",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                brand: "Edit Settings",
                state: 2
            },
            {
                id: 3,
                title: "Intersted in placing a small order of physical Thumballs",
                from: "Tom Jones",
                to: "",
                date: "Yesterday",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                brand: "Copy",
                state: 1
            },
        ]
    }
    return (
        <LoadingLayout loading={loading}>
            <>
            <div className="dashboard__menu">
                <LeftSideBar active="notifications" page="new" />
            </div>
            <div className="dashboard__content">
                <div className="ml-0">
                    <div className="row">
                        <div className="col-12">
                            <div className="dashboard__header">
                                <ul className="breadcumb">
                                    <li><a href="/">Home</a></li>
                                    <li><i className="fa fas fa-chevron-right"></i></li>
                                    <li className="active">Add Notification</li>
                                </ul>
                                <TopRight setLoading={setLoading} />
                            </div>
                        </div>
                        <div className="col-5">
                            <SearchForm />
                            {notifications !== [] && notifications.map(notification => (
                                <div key={notification.id} className="box__wrapper_notification">
                                    <div className="box_notification_inner">
                                        <h4 className="box__title">{notification.title}</h4>
                                        <div className="box__meta">
                                            <h5><img src={user2} alt="user2" />{notification.from}</h5>
                                            <h5><img src={day} alt="day" />{notification.date}</h5>
                                        </div>
                                        <p className="content">{notification.content}</p>
                                    </div>
                                    <div className="notification_footer">
                                        <p className="notification_brand_wrapper">
                                            <span className={`notification_brand ${notification.state === 1 ? 'brand_brown' : 'brand_blue'}`}>{notification.brand}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-7">
                            <div className="notification__title">
                                <h3>New Notification</h3>
                            </div>
                            <form>
                                <div className="content__wrapper">
                                    <div className="content__title">
                                        <h5>Audience</h5>
                                    </div>
                                    <div className="content__area">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="customRadio1" name="radio-audience" className="custom-control-input" onChange={() => setAudienceAll(true)} defaultChecked />
                                            <label className="custom-control-label" htmlFor="customRadio1">Send to Everyone</label>
                                        </div>
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="customRadio2" name="radio-audience" className="custom-control-input" onChange={() => setAudienceAll(false)} />
                                            <label className="custom-control-label" htmlFor="customRadio2">Send to Segment</label>
                                            <select className="custom-select" disabled={audienceall}>
                                                <option value="" disabled defaultValue>Select Segment Name</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="content__wrapper">
                                    <div className="content__title">
                                        <h5>Message</h5>
                                    </div>
                                    <div className="content__area">
                                        <div className="form__container">
                                            <div className="form-group">
                                                <label htmlFor="validationTextarea">Title</label>
                                                <textarea className="form-control h-80" onChange={e => setTitle(e.target.value)} placeholder="New Thumball! - Let’s Talk Teamwork! Created by best Selling author, Seth Godin."></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="validationTextarea">Enter Message</label>
                                                <textarea className="form-control h-150" onChange={e => setMessage(e.target.value)} placeholder="This thumbnail will help you address potential obstacles to your team working together. A must-have for all project managers and HR directors."></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="content__wrapper">
                                    <div className="content__title">
                                        <h5>Schedule</h5>
                                    </div>
                                    <div className="content__area">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="customRadio3" name="radio-schedule" className="custom-control-input" onChange={() => setScheduleImmediate(true)} defaultChecked />
                                            <label className="custom-control-label" htmlFor="customRadio3">Send Immediatey</label>
                                        </div>
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="customRadio4" name="radio-schedule" className="custom-control-input" onChange={() => setScheduleImmediate(false)} />
                                            <label className="custom-control-label" htmlFor="customRadio4">Send at a Specific Time (Users Time Zone)</label>
                                            <select className="custom-select" disabled={scheduleimmediate}>
                                                <option value="" disabled defaultValue>Select Time</option>
                                                <option>10:00 PM</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form__container">
                                    <div className="text-right">
                                        <button type="submit" className="btn btn__submit btn__cancel mr-4">Cancel</button>
                                        <button type="submit" className="btn btn__submit">Send</button>
                                    </div>
                                </div>
                            </form>
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

export default compose(withFirebase, withAuthorization(condition))(NotificationAdd);
