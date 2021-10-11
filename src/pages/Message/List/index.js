import React, { useState, useEffect } from 'react'

import user2 from '../../../images/user-2.png';
import day from '../../../images/day.png';
import arrowright from '../../../images/arrow-right.png';
import rly from '../../../images/rly.png';
import LeftSideBar from '../../../layouts/LeftSideBar';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import { compose } from 'recompose';
import LoadingLayout from '../../../layouts/LoadingLayout';
import SearchForm from '../../../components/SearchForm';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import { USERTYPE } from '../../../constants/usertypes';

const MessagesList = (props) => {

    const [loading, setLoading] = useState(true);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getMessages();

        if (!localStorage.getItem("authUser")) {
            props.history.push("/signin");
        };
    }, []);

    const getMessages = () => {

        var data = JSON.parse(localStorage.getItem("authUser"));

        var messages_ = [];
        // props.firebase.messages().where("to", "=", data.username).orderBy("date").get()
        // props.firebase.messages().get()
        props.firebase.messages().where("to", "==", data.username).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    messages_.push(
                        {
                            id: doc.id,
                            subject: doc.data().subject,
                            from: doc.data().from,
                            to: doc.data().to,
                            date: doc.data().date.seconds,
                            content: doc.data().content
                        });
                });
                console.log("messages received-----", messages_);
                setMessages(messages_);

                setLoading(false);

            });

    }

    const [reply, setReply] = useState(false);

    const displayReplyArea = () => {
        setReply(true);
    }
    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="messages" page="all" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Messages</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="col-5">
                                <SearchForm />
                                {messages !== [] && messages.map(message => (
                                    <div key={message.id} className="box__wrapper">
                                        <h4 className="box__title">{message.subject}</h4>
                                        <div className="box__meta">
                                            <h5><img src={user2} alt="user2" />{message.to}</h5>
                                            <h5><img src={day} alt="day" />{message.date}</h5>
                                        </div>
                                        <p className="content">{message.content.substring(0, 200)}{message.content.length > 200 ? "..." : ""}</p>
                                        <a href="#" className="more__btn">More<img src={arrowright} /></a>
                                    </div>
                                ))}
                            </div>
                            <div className="col-7">
                                <div className="box__wrapper box__wrapper--mod">
                                    <div className="box__container">
                                        <h4>Help with building Custom Thumball</h4>
                                        <h6>Tom Jones - Customer/ Bronx PS100</h6>
                                        <h6>Tuesday, July 28th, 2020 - 8:00pm</h6>
                                        <p className="content-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis</p>
                                        <p className="footer__content"><i>Regards,</i><br />Tom Jones <br />
                                        Director of Curriculum<br />
                                        Bronx PS100 Scholl<br />
                                        555-555-5555
                                    </p>
                                    </div>
                                    {!reply &&
                                        <button className="reply_btn" onClick={displayReplyArea}><img src={rly} alt="rly" />Reply</button>
                                    }
                                    {reply &&
                                        <div className="form__container">
                                            <form>
                                                <div className="form-group">
                                                    <label htmlFor="validationTextarea">Enter Message</label>
                                                    <textarea className="form-control" rows="5" placeholder="Enter your message here..."></textarea>
                                                </div>
                                                <div className="text-right">
                                                    <button type="submit" className="btn btn__submit btn__cancel mr-4" onClick={() => setReply(false)}>Cancel</button>
                                                    <button type="submit" className="btn btn__submit">Send</button>
                                                </div>
                                            </form>
                                        </div>
                                    }
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

const condition = authUser => !!authUser && !(Number(authUser.user_type_id) === USERTYPE.EDITOR && !authUser.capability.message);

export default compose(withFirebase, withAuthorization(condition))(MessagesList);