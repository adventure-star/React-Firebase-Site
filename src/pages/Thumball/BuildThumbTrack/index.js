import React, { useState, useEffect } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import CopyrightBrand from '../../../components/CopyrightBrand';
import LoadingLayout from '../../../layouts/LoadingLayout';
import TopRight from '../../../components/TopRight';
import { USERTYPE } from '../../../constants/usertypes';
import Moment from 'moment-timezone';
import { useHistory } from 'react-router-dom';


const SELECTFROM = {
    ALL: "all",
    MYCREATED: "mycreated"
};

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

const BuildThumbTrack = (props) => {

    let history = useHistory();

    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [number, setNumber] = useState(0);
    const [specificorder, setSpecificOrder] = useState(true);

    const [thumballs, setThumballs] = useState([]);

    const [mycreatedthumballs, setMyCreatedThumballs] = useState([]);
    const [allthumballs, setAllThumballs] = useState([]);

    const [categories, setCategories] = useState([]);

    const handleThumballNumber = e => {

        setNumber(Number(e.target.value));

        var number = e.target.value;

        var index;
        var thumballs_ = [];
        for (index = 0; index < number; index++) {
            thumballs_.push({
                id: index,
                selectfrom: SELECTFROM.ALL,
                category: 0,
                thumball: "",
                trigger: 1,
                percent: 80
            });
        }
        setThumballs(thumballs_);
    }

    const handleThumball = (e, index, type) => {

        setThumballs(thumballs.map(thumball => {
            if (thumball.id === index) {
                switch (type) {
                    case "selectfrom":
                    case "thumball":
                        return Object.assign({}, thumball, { [type]: e.target.value });
                    case "category":
                    case "trigger":
                    case "percent":
                        return Object.assign({}, thumball, { [type]: Number(e.target.value) });
                }
            } else {
                return thumball;
            }
        }));

    }

    const getMaxIndex = () => {
        return thumballs.length !== 0 ? Math.max.apply(Math, thumballs.map(function (o) { return o.id; })) : -1;
    }

    const addThumbTrack = () => {

        setLoading(true);

        let date = Moment.tz(new Date(), "Europe/Paris").format();

        var ref = props.firebase.thumbtracks().doc();

        ref.set({
            title: title,
            number: number,
            specificorder: specificorder,
            content: thumballs,
            date_created: Moment(date).format("x"),
            date_modified: Moment(date).format("x")
        })
            .then(() => {
                console.log("-----ThumbTrack Created-----");
                setLoading(false);
                history.push("/thumballs/all");

            })
            .catch(error => {
                console.log("=====error", error);
                setLoading(false);
            });
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

    useEffect(() => {
        getMyCreatedThumballs();
        getThumballsByCategory();
    }, []);

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="thumballs" page="thumbtrack" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Build a ThumbTrack</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="box__wrapper">
                                    <div className="form__container">
                                        <div>
                                            <div className="row">
                                                <div className="col">
                                                    <label htmlFor="exampleFormControlSelect1">Name of thumtrack</label>
                                                    <input className="form-control" placeholder="Enter Thumbtrack Name" value={title} onChange={e => setTitle(e.target.value)} />
                                                </div>
                                                <div className="col">
                                                    <label htmlFor="exampleFormControlSelect1"># of Thumballs in Thumbtrack</label>
                                                    <select className="form-control" id="exampleFormControlSelect1" value={number} onChange={e => handleThumballNumber(e)}>
                                                        <option value="0" disabled defaultValue>Select Number</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col">
                                                    <label htmlFor="specificorder pl-3">Should the Thumballs be presented in a specific order to the user?</label>
                                                    <div className="form-group">
                                                        <div className="custom-radio form-check-inline mt0">
                                                            <input className={specificorder ? `custom-radio-input checked` : `custom-radio-input`} onChange={e => setSpecificOrder(true)} id="someRadio-1" name="radio-specific-order" type="radio" />
                                                            <label className="custom-radio-elem" htmlFor="someRadio-1"></label>
                                                            <label className="custom-radio-label custom-radio-label2" htmlFor="someRadio-1">Yes</label>
                                                        </div>
                                                        <div className="custom-radio form-check-inline mt0">
                                                            <input className={!specificorder ? `custom-radio-input checked` : `custom-radio-input`} onChange={e => setSpecificOrder(false)} id="someRadio-2" name="radio-specific-order" type="radio" />
                                                            <label className="custom-radio-elem" htmlFor="someRadio-2"></label>
                                                            <label className="custom-radio-label custom-radio-label2" htmlFor="someRadio-2">No, they can be random.</label>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>

                                            <div className="row">
                                                <div className="col">
                                                    <h2 className="now-select-titel">Now select the Thumballs</h2>
                                                </div>
                                            </div>

                                            {thumballs !== [] && thumballs.map(thumball => (
                                                <div key={thumball.id} className="row">
                                                    <div className="col">
                                                        <div className="Thumball-box">
                                                            <div className="Thumball-h w-100">Thumball #{thumball.id + 1}</div>
                                                            <div className="Select-from w-100">Select from:</div>
                                                            <div className="form-group d-flex justify-content-between">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="custom-radio form-check-inline">
                                                                        <input className={thumball.selectfrom === SELECTFROM.ALL ? `custom-radio-input checked` : `custom-radio-input`} id={`radio-selectfrom-1-` + thumball.id} value={SELECTFROM.ALL} name={`someRadio-4-` + thumball.id} type="radio" onChange={e => handleThumball(e, thumball.id, "selectfrom")} checked={thumball.selectfrom === SELECTFROM.ALL} />
                                                                        <label className="custom-radio-elem mb-0" htmlFor={`radio-selectfrom-1-` + thumball.id}></label>
                                                                        <label className="custom-radio-label2" htmlFor={`radio-selectfrom-1-` + thumball.id}>All available Thumballs</label>
                                                                    </div>
                                                                    <div className="custom-radio form-check-inline">
                                                                        <input className={thumball.selectfrom === SELECTFROM.MYCREATED ? `custom-radio-input checked` : `custom-radio-input`} value={SELECTFROM.MYCREATED} id={`radio-selectfrom-2-` + thumball.id} name={`someRadio-4-` + thumball.id} type="radio" onChange={e => handleThumball(e, thumball.id, "selectfrom")} checked={thumball.selectfrom === SELECTFROM.MYCREATED} />
                                                                        <label className="custom-radio-elem mb-0" htmlFor={`radio-selectfrom-2-` + thumball.id}></label>
                                                                        <label className="custom-radio-label2" htmlFor={`radio-selectfrom-2-` + thumball.id}>My created Thumballs</label>
                                                                    </div>
                                                                </div>

                                                                <div className="d-flex align-items-center">
                                                                    {thumball.selectfrom === SELECTFROM.ALL ?
                                                                        <>
                                                                            <div className="custom-radio form-check-inline">
                                                                                <select className="form-control form-control-bg" value={thumball.category} onChange={e => handleThumball(e, thumball.id, "category")}>
                                                                                    <option value="0" disabled defaultValue>Select Category</option>
                                                                                    {categories !== [] && categories.map(category => (
                                                                                        <option key={category.id} value={category.id}>{category.name}</option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            <div className="custom-radio form-check-inline">
                                                                                <select className="form-control form-control-bg" value={thumball.thumball} onChange={e => handleThumball(e, thumball.id, "thumball")}>
                                                                                    <option value="" disabled defaultValue>Select Thumball</option>
                                                                                    {allthumballs != [] && allthumballs.filter(x => Number(x.category) === thumball.category).map(item => (
                                                                                        <option key={item.id} value={item.id}>{item.title}</option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <div className="custom-radio form-check-inline">
                                                                            <select className="form-control form-control-bg" value={thumball.thumball} onChange={e => handleThumball(e, thumball.id, "thumball")}>
                                                                                <option value="" disabled defaultValue>Select Thumball</option>
                                                                                {mycreatedthumballs !== [] && mycreatedthumballs.map(item => (
                                                                                    <option key={item.id} value={item.id}>{item.title}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    }
                                                                </div>

                                                            </div>
                                                            {thumball.id !== getMaxIndex() &&
                                                                <div className="form-group m-0">
                                                                    <h3 className="font-12">Select a trigger to display next Thumball to user</h3>
                                                                    <div className="row">
                                                                        <div className="col-sm-6">
                                                                            <select className="form-control form-control-bg" id="exampleFormControlSelect1" value={thumball.trigger} onChange={e => handleThumball(e, thumball.id, "trigger")}>
                                                                                <option value="0">Thumball session completed</option>
                                                                                <option value="1">Successfully answered</option>
                                                                            </select>
                                                                        </div>
                                                                        {thumball.trigger === 1 &&
                                                                            <div className="col-sm-6">
                                                                                <select className="form-control form-control-bg" id="exampleFormControlSelect1" value={thumball.percent} onChange={e => handleThumball(e, thumball.id, "percent")}>
                                                                                    <option value="100">100% of questions</option>
                                                                                    <option value="90">90% of questions</option>
                                                                                    <option value="80">80% of questions</option>
                                                                                    <option value="70">70% of questions</option>
                                                                                    <option value="60">60% of questions</option>
                                                                                    <option value="50">50% of questions</option>
                                                                                </select>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="form-group my-4">
                                                <a href="/thumballs/all"><button type="button" className="btn btn__submit btn__cancel mr-4">Cancel</button></a>
                                                <button type="button" className="btn btn__submit" onClick={addThumbTrack}>Save</button>
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

const condition = authUser => !!authUser && (Number(authUser.user_type_id) === USERTYPE.CUSTOMER || Number(authUser.user_type_id) === USERTYPE.EDITOR);

export default compose(withFirebase, withAuthorization(condition))(BuildThumbTrack);