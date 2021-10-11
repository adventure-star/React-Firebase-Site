import React, { useState, useEffect } from 'react'

import user2 from '../../../images/user-2.png';
import day from '../../../images/day.png';
import arrowright from '../../../images/arrow-right.png';
import LeftSideBar from '../../../layouts/LeftSideBar';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import { useHistory } from 'react-router-dom';
import LoadingLayout from '../../../layouts/LoadingLayout';
import SearchForm from '../../../components/SearchForm';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import { USERTYPE } from '../../../constants/usertypes';

const MessageAdd = (props) => {

    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {

        getAllUser();

        getMessages();

        if (!localStorage.getItem("authUser")) {
            props.history.push("/signin");
        };

    }, []);
    const getAllUser = () => {
        setLoading(true);
        var ref = props.firebase.users();

        var users_ = [];

        ref.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                users_.push({ id: doc.id, ...doc.data() });
            });
            setUsers(users_);
            setLoading(false);
        });

    }

    const getMessages = () => {
        setLoading(true);

        var data = JSON.parse(localStorage.getItem("authUser"));

        console.log("data.username-----", data.username);

        var messages_ = [];
        props.firebase.messages().where("from", "==", data.username).orderBy("date").get()
            // props.firebase.messages().orderBy("date").get()
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
                history.push("/messages/new");

            });

    }

    const sendMessage = () => {

        var data = JSON.parse(localStorage.getItem("authUser"));

        var ref = props.firebase.addMessage(
            {
                subject: subject,
                from: data.username,
                to: name,
                date: new Date(),
                content: content
            });

        ref.then(docRef => {
            console.log("Document written with ID: ", docRef.id);
            getMessages();
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="messages" page="new" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Add Message</li>
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
                                        <a href="#" className="more__btn">More<img src={arrowright} alt="arrowright" /></a>
                                    </div>
                                ))}
                                <div className="box__wrapper">
                                    <h4 className="box__title">Users</h4>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Country</th>
                                                <th>Username</th>
                                            </tr>
                                            {users !== [] && users.map(user => (
                                                <tr key={user.email}>
                                                    <td>{user.country}</td>
                                                    <td>{user.username}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <div className="col-7">
                                <div className="box__wrapper box__wrapper--mod">
                                    <div className="form__container">
                                        <div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6 mb-0">
                                                    <label htmlFor="inputState">To</label>
                                                    <select id="inputState" className="form-control">
                                                        <option value="" disabled defaultValue>Select One</option>
                                                        <option>Individual</option>
                                                        <option>Mr.</option>
                                                        <option>Mrs.</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-6 mb-0">
                                                    <label htmlFor="inputPassword4">Name</label>
                                                    <input type="text" className="form-control" placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputAddress">Subject</label>
                                                <input type="text" className="form-control" id="inputAddress" placeholder="Helpful tips on creating a Quiz/ Challenge" value={subject} onChange={e => setSubject(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="validationTextarea">Enter Message</label>
                                                <textarea className="form-control" rows="5" placeholder="Enter your message here..." value={content} onChange={e => setContent(e.target.value)} ></textarea>
                                            </div>
                                            <div className="text-right">
                                                <a href="/messages/all">
                                                    <button type="button" className="btn btn__submit btn__cancel mr-1">Cancel</button>
                                                </a>
                                                <button type="button" className="btn btn__submit" onClick={() => sendMessage()}>Send</button>
                                            </div>
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

const condition = authUser => !!authUser && !(Number(authUser.user_type_id) === USERTYPE.EDITOR && !authUser.capability.message);

export default compose(withFirebase, withAuthorization(condition))(MessageAdd);