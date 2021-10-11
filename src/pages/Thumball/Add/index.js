import React, { useState, useEffect } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';
import { Collapse } from 'react-collapse';

import ifeel from '../../../images/ifeel.png';
import CopyrightBrand from '../../../components/CopyrightBrand';
import LoadingLayout from '../../../layouts/LoadingLayout';
import TopRight from '../../../components/TopRight';
import { USERTYPE } from '../../../constants/usertypes';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import { PRICING } from '../../../constants/pricingtiers';
import Moment from 'moment-timezone';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';

import './index.css'


const QUESTIONTYPE1 = [
    { id: 0, name: "Matching" },
    { id: 1, name: "True and False" },
];

const QUESTIONTYPE2 = [
    { id: 0, name: "Matching" },
    { id: 1, name: "True and False" },
    { id: 2, name: "Chronologic/Proper Order" },
    { id: 3, name: "Fill in the blank" },
    { id: 4, name: "Multiple Choice" }
];

const THUMBALLTYPE = {
    CLASSIC12: 0,
    CLASSIC32: 1,
    CHALLENGE12: 2,
    CHALLENGE32: 3
}

const PANELTYPE = {
    MATCHING: 0,
    TRUEANDFALSE: 1,
    CHRONO: 2,
    FILL: 3,
    MULTIPLE: 4
};

const CONTENTTYPE = {
    ORDER: "order",
    CORRECT: "correctness",
    BLANK: "blanknumber",
    CASE: "casesensitive",
    PROVIDE: "providedwithhint",
    HINTNUMBER: "hintnumber"
}

const ACCESS = {
    CREATEDFOR: "createdfor",
    LEVEL: "level"
}

const SAVETYPE = {
    PUBLISH: "published",
    DRAFT: "draft"
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
    }
};

Modal.setAppElement('#root')


const ThumballAdd = (props) => {

    let history = useHistory();

    const [loading, setLoading] = useState(false);

    const [usertype, setUserType] = useState(0);
    const [userid, setUserId] = useState("");
    const [fullname, setFullName] = useState("");

    const [pricingtier, setPricingTier] = useState(0);

    const getUserType = () => {
        setLoading(true);
        var data = JSON.parse(localStorage.getItem("authUser"));
        if (data) {
            setUserType(Number(data.user_type_id));

            if (Number(data.user_type_id) === USERTYPE.CUSTOMER) {
                props.firebase.customer(data.uid).get()
                    .then(doc => {
                        if (doc.exists) {
                            console.log("Customer-----", doc.data());
                            var res = doc.data();

                            setPricingTier(res.pricing_tier);

                            setLoading(false);
                        }
                    })
            }
            if (Number(data.user_type_id) === USERTYPE.EDITOR) {
                props.firebase.editor(data.uid).get()
                    .then(doc => {
                        if (doc.exists) {
                            console.log("Editor-----", doc.data());
                            var res = doc.data();
                            return res.id;
                        }
                    })
                    .then((id) => {
                        props.firebase.customer(id).get()
                            .then(doc => {
                                if (doc.exists) {
                                    console.log("Parent Customer-----", doc.data());
                                    var res = doc.data();
                                    setPricingTier(res.pricing_tier);
                                    setLoading(false);
                                }
                            });
                    })
                    .catch(err => {
                        console.log("error-----", err);
                    });
            }
            if (Number(data.user_type_id) === USERTYPE.SUPERADMIN || Number(data.user_type_id) === USERTYPE.PARTNER) {
                setLoading(false);
            }
        }
    }

    const demoCategory = () => {
        return [
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
        ]
    }

    const demoAge = () => {
        return [
            {
                id: 1,
                name: "Children(6~8)"
            },
            {
                id: 2,
                name: "Children(9~12)"
            },
            {
                id: 3,
                name: "Children(13~15)"
            }
        ]
    }

    const [classic12, setClassic12] = useState(new Array(12).fill(""));
    const [classic32, setClassic32] = useState(new Array(32).fill(""));

    const handleClassic12Change = (e, index_) => {
        setClassic12(classic12.map((item, index) => {
            return index === index_ ? e.target.value : item;
        }));
    }

    const handleClassic32Change = (e, index_) => {
        setClassic32(classic32.map((item, index) => {
            return index === index_ ? e.target.value : item;
        }));
    }

    const handleContentAnswers = (index_, itemindex_, paneltype, type, e) => {

        var answers_;

        setPanels(panels.map(panel => {
            if (panel.index === index_) {
                switch (paneltype) {
                    case PANELTYPE.MATCHING:
                        var matching_ = panel.content.answers.matching.map(el => {
                            if (el.index === itemindex_) {
                                return Object.assign({}, el, { [type]: e.target.value });
                            } else {
                                return el;
                            }
                        });
                        answers_ = Object.assign({}, panel.content.answers, { matching: matching_ });
                        break;
                    case PANELTYPE.CHRONO:
                        var chrono_ = panel.content.answers.chrono.map(el => {
                            if (el.index === itemindex_) {
                                return Object.assign({}, el, { answer: e.target.value });
                            } else {
                                return el;
                            }
                        });
                        answers_ = Object.assign({}, panel.content.answers, { chrono: chrono_ });
                        break;
                    case PANELTYPE.FILL:
                        var fill_ = panel.content.answers.fill.map(el => {
                            if (el.index === itemindex_) {
                                return Object.assign({}, el, { answer: e.target.value });
                            } else {
                                return el;
                            }
                        });
                        answers_ = Object.assign({}, panel.content.answers, { fill: fill_ });
                        break;
                    case PANELTYPE.MULTIPLE:
                        var multiple_ = panel.content.answers.multiple.map(el => {
                            if (el.index === itemindex_) {
                                if (type === "correct") {
                                    return Object.assign({}, el, { correct: 1 });
                                } else {
                                    return Object.assign({}, el, { [type]: e.target.value });
                                }
                            } else {
                                if (type === "correct") {
                                    return Object.assign({}, el, { correct: 0 });
                                } else {
                                    return el;
                                }
                            }
                        });
                        answers_ = Object.assign({}, panel.content.answers, { multiple: multiple_ });
                        break;
                }
                var content_ = Object.assign({}, panel.content, { answers: answers_ });
                return Object.assign({}, panel, { content: content_ });
            } else {
                return panel;
            }
        }));
    }

    const [step1, setStep1] = useState(false);
    const [step2, setStep2] = useState(false);
    const [step3, setStep3] = useState(true);
    const [step4, setStep4] = useState(false);

    // Step 1

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("This Thumball is designed to give grade school children a little extra help in the area of mathematics, specifically multiplication.");

    const handleDescription = e => {
        if (description.length < 250) {
            setDescription(e.target.value);
        }
    }

    const [newtagname, setNewTagName] = useState("");
    const [tagindex, setTagIndex] = useState(2);

    const [tags, setTags] = useState([
        {
            id: 1,
            name: "Math"
        },
        {
            id: 2,
            name: "Multiplication"
        }
    ]);

    const handleTag = e => {
        setNewTagName(e.target.value);
    }

    const keyupHandle = e => {
        if (e.keyCode === 13 && tags.length < 4) {
            setTags([...tags, { id: tagindex + 1, name: newtagname }]);
            setTagIndex(tagindex + 1);
            setNewTagName("");
        }
    }

    const removeTag = (id) => {
        setTags(tags.filter(tag => tag.id !== id));
    }

    const [thumballtype, setThumballType] = useState(THUMBALLTYPE.CLASSIC12);

    const [category, setCategory] = useState(1);
    const [age, setAge] = useState(0);

    const [categorylist, setCategoryList] = useState([]);
    const [agelist, setAgeList] = useState([]);

    const [access, setAccess] = useState({ createdfor: "public", level: "free" });

    const handleAccess = (type, e) => {
        setAccess(Object.assign({}, access, { [type]: e.target.value }));
    }

    // Step 2

    const [primarycolor, setPrimaryColor] = useState(0);
    const [secondarycolor, setSecondaryColor] = useState(0);

    // Step 3

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [singletype, setSingleType] = useState(false);
    const [encourage, setEncourage] = useState(true);
    const [encouragemessage, setEncourageMessage] = useState("");

    const [often, setOften] = useState(0);
    const [panelthatis, setPanelThatIs] = useState(0);


    const [panels, setPanels] = useState([]);


    useEffect(() => {
        setCategoryList(demoCategory());
        setAgeList(demoAge());
        setColors(demoColor());
        getUserType();
        getUserId();
    }, []);

    const [questiontype, setQuestionType] = useState(0);

    const handlePanel = (index_, type, e) => {
        setPanels(panels.map(panel => {
            if (panel.index === index_) {
                switch (type) {
                    case "open":
                        return Object.assign({}, panel, { open: panel.open === 1 ? 0 : 1 });
                    case "title":
                    case "info":
                        return Object.assign({}, panel, { [type]: e.target.value });
                    case "type":
                        return Object.assign({}, panel, { type: Number(e.target.value) });
                }
            } else {
                return panel;
            }
        }));
    }

    const handleContent = (index_, type, e) => {
        setPanels(panels.map(panel => {
            if (panel.index === index_) {
                var content_;
                switch (type) {
                    case CONTENTTYPE.CASE:
                    case CONTENTTYPE.PROVIDE:
                    case CONTENTTYPE.CORRECT:
                        content_ = Object.assign({}, panel.content, { [type]: Number(e.target.value) });
                        break;
                    case CONTENTTYPE.HINTNUMBER:
                    case CONTENTTYPE.ORDER:
                    case CONTENTTYPE.BLANK:
                        content_ = Object.assign({}, panel.content, { [type]: e.target.value });
                        break;
                }
                return Object.assign({}, panel, { content: content_ });
            } else {
                return panel;
            }
        }));
    }

    const addAnswerField = (index_, paneltype) => {
        setPanels(panels.map(panel => {
            if (panel.index === index_) {
                var maxindex;
                var answers_
                switch (paneltype) {
                    case 0:
                        maxindex = panel.content.answers.matching.length !== 0 ? Math.max.apply(Math, panel.content.answers.matching.map(function (o) { return o.index; })) : -1;
                        answers_ = Object.assign({}, panel.content.answers, { matching: [...panel.content.answers.matching, { index: maxindex + 1, choice: "", match: "" }] });
                        break;
                    case 2:
                        maxindex = panel.content.answers.chrono.length !== 0 ? Math.max.apply(Math, panel.content.answers.chrono.map(function (o) { return o.index; })) : -1;
                        answers_ = Object.assign({}, panel.content.answers, { chrono: [...panel.content.answers.chrono, { index: maxindex + 1, answer: "" }] });
                        break;
                    case 3:
                        maxindex = panel.content.answers.fill.length !== 0 ? Math.max.apply(Math, panel.content.answers.fill.map(function (o) { return o.index; })) : -1;
                        answers_ = Object.assign({}, panel.content.answers, { fill: [...panel.content.answers.fill, { index: maxindex + 1, answer: "" }] });
                        break;
                    case 4:
                        maxindex = panel.content.answers.multiple.length !== 0 ? Math.max.apply(Math, panel.content.answers.multiple.map(function (o) { return o.index; })) : -1;
                        answers_ = Object.assign({}, panel.content.answers, { multiple: [...panel.content.answers.multiple, { index: maxindex + 1, answer: "", hint: "", correct: 0 }] });
                        break;
                }
                var content_ = Object.assign({}, panel.content, { answers: answers_ });
                return Object.assign({}, panel, { content: content_ });
            } else {
                return panel;
            }
        }));
    }

    const getQuestionName = (value) => {
        switch (value) {
            case 0:
                return "Matching";
            case 1:
                return "True and False";
            case 2:
                return "Chronologic/Proper Order";
            case 3:
                return "Fill in the blank";
            case 4:
                return "Multiple Choice";
        }
    }

    const demoColor = () => {
        return [
            {
                id: 1,
                color: "black",
                label: "black",
                value: 0
            },
            {
                id: 2,
                color: "gold",
                label: "gold",
                value: 1
            },
            {
                id: 3,
                color: "grey",
                label: "grey",
                value: 2
            },
            {
                id: 4,
                color: "green",
                label: "green",
                value: 3
            },
            {
                id: 5,
                color: "orange",
                label: "orange",
                value: 4
            },
            {
                id: 6,
                color: "purple",
                label: "purple",
                value: 5
            },
            {
                id: 7,
                color: "red",
                label: "red",
                value: 6
            },
        ]
    }

    const [colors, setColors] = useState([]);

    const addPanel = () => {

        var maxindex = panels.length !== 0 ? Math.max.apply(Math, panels.map(function (o) { return o.index; })) : -1;

        setPanels([...panels, {
            index: maxindex + 1,
            type: 1,
            title: "",
            info: "",
            open: 1,
            content: {
                order: "asentered",
                correctness: 1,
                blanknumber: 0,
                casesensitive: 1,
                providedwithhint: 1,
                hintnumber: 3,
                answers: {
                    matching: [
                        { index: 0, choice: "", match: "" }
                    ],
                    chrono: [
                        { index: 0, answer: "" }
                    ],
                    fill: [
                        { index: 0, answer: "" }
                    ],
                    multiple: [
                        { index: 0, answer: "", hint: "", correct: 1 }
                    ]
                }
            }
        },])
    }

    const getUserId = () => {
        var data = JSON.parse(localStorage.getItem("authUser"));
        if (data) {
            setUserType(Number(data.user_type_id));
            setFullName(data.first_name + " " + data.last_name);
            setUserId(data.uid);
        }
    }

    const addThumball = (type) => {

        setLoading(true);

        let date = Moment.tz(new Date(), "Europe/Paris").format();

        var ref = props.firebase.thumballs().doc();

        ref.set({
            title: title,
            type: thumballtype,
            category: category,
            age_group: age,
            tags: tags,
            description: description,
            access: access,
            author_id: userid,
            author: fullname,
            usertype: usertype,
            color_1: primarycolor,
            color_2: secondarycolor,
            questiontype: singletype ? questiontype : "",
            encourage: encourage ? encouragemessage : "",
            often: often,
            panelthatis: panelthatis,
            status: type,
            panel: thumballtype === THUMBALLTYPE.CLASSIC12 ? classic12 : (thumballtype === THUMBALLTYPE.CLASSIC32 ? classic32 : panels),
            date_created: Moment(date).format("x"),
            date_modified: Moment(date).format("x")
        })
            .then(() => {
                console.log("-----Thumball Created-----");
                setLoading(false);
                history.push("/thumballs/all");

            })
            .catch(error => {
                console.log("=====error", error);
                setLoading(false);
            });
    }

    const afterOpenModal = () => {

    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="thumballs" page="new" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Create Thumball</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="col-12">
                                <h3 className="thumb-hdr">Let's Create A Thumball!</h3>

                                <div className="accordion" id="accordion2">
                                    <div className="accordion-group create-thumb">
                                        <div className="accordion-heading">
                                            <div className="accordion-toggle d-flex justify-content-between pr-4" onClick={() => setStep1(!step1)}>
                                                step one
                                            <div>&#9662;</div>
                                            </div>
                                        </div>
                                        <Collapse isOpened={step1}>
                                            <div id="collapseOne" className="accordion-body collapse show">
                                                <div className="accordion-inner">
                                                    <div className="form__container">
                                                        <form>
                                                            <div className="row">
                                                                <div className="col">
                                                                    <label>Please Give Your Thumball A Name</label>
                                                                    <input type="text" className="form-control" placeholder="Multiplication is Fun!" value={title} onChange={e => setTitle(e.target.value)} />
                                                                </div>
                                                                <div className="col">
                                                                    <label>What Type Of Thumball Will This Be? <i className="fa fas fa-question-circle"></i></label>
                                                                    <select className="form-control form-control-gra" id="exampleFormControlSelect1" value={thumballtype} onChange={e => setThumballType(Number(e.target.value))}>
                                                                        <option value={THUMBALLTYPE.CLASSIC12}>Thumball Classic | Catch 12!</option>
                                                                        <option value={THUMBALLTYPE.CLASSIC32}>Thumball Classic | Catch 32!</option>
                                                                        <option value={THUMBALLTYPE.CHALLENGE12}>Thumball Challenge/Quiz – 12 Panel</option>
                                                                        <option value={THUMBALLTYPE.CHALLENGE32}>Thumball Challenge/Quiz – 32 Panel</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <label>Category</label>
                                                                            <select className="form-control form-control-gra" value={category} onChange={e => setCategory(Number(e.target.value))}>
                                                                                <option value="" disabled defaultValue>Select Category</option>
                                                                                {categorylist !== [] && categorylist.map(item => (
                                                                                    <option key={item.id} value={item.id}>{item.cat_name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className="col">
                                                                            <label>Age</label>
                                                                            <select className="form-control form-control-gra" value={age} onChange={e => setAge(e.target.value)}>
                                                                                <option value="" disabled defaultValue>Select Age</option>
                                                                                {agelist !== [] && agelist.map(item => (
                                                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className="w-40">
                                                                        <label>Select Tags (Up to 4)</label>
                                                                        <input type="text" className="form-control select2" placeholder="Type Tag Here..." value={newtagname} onChange={handleTag} onKeyUp={keyupHandle} />
                                                                    </div>
                                                                    <div className="srch-tags">
                                                                        {tags !== [] && tags.map(tag => (
                                                                            <span key={tag.id}>{tag.name} <strong onClick={() => removeTag(tag.id)} style={{ cursor: "pointer" }}>&times;</strong></span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col">
                                                                    <label>Description</label>
                                                                    <textarea placeholder="Description" className="form-control create-txt" value={description} onChange={handleDescription}></textarea>
                                                                    <div style={{ textAlign: "right" }}>{description.length}/250 CHARACTERS</div>
                                                                </div>
                                                                <div className="col">
                                                                    <label>audience <i className="fa fas fa-question-circle"></i></label>
                                                                    <div className="audience-box">
                                                                        <div className="created-for">
                                                                            <label>created for</label>
                                                                            <div className="d-flex flex-column">
                                                                                <div className="custom-radio form-check-inline m-0 mb-3">
                                                                                    <input className={access.createdfor === "public" ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-32" name="someRadio-createdfor" type="radio" value="public" onChange={e => handleAccess(ACCESS.CREATEDFOR, e)} />
                                                                                    <label className="custom-radio-elem mb-0" htmlFor="someRadio-32"></label>
                                                                                    <label className="custom-radio-label2" htmlFor="someRadio-32">Public</label>
                                                                                </div>
                                                                                <div className="custom-radio form-check-inline m-0">
                                                                                    <input className={access.createdfor !== "public" ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-33" name="someRadio-createdfor" type="radio" value="private" onChange={e => handleAccess(ACCESS.CREATEDFOR, e)} />
                                                                                    <label className="custom-radio-elem mb-0" htmlFor="someRadio-33"></label>
                                                                                    <label className="custom-radio-label2" htmlFor="someRadio-33">Private</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {access.createdfor === "public" &&
                                                                            <div className="access-lvl">
                                                                                <label>access level</label>
                                                                                <div className="d-flex flex-column">
                                                                                    <div className="custom-radio form-check-inline m-0 mb-3">
                                                                                        <input className={access.level === "free" ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-34" name="someRadio-accesslevel" type="radio" value="free" onChange={e => handleAccess(ACCESS.LEVEL, e)} />
                                                                                        <label className="custom-radio-elem mb-0" htmlFor="someRadio-34"></label>
                                                                                        <label className="custom-radio-label2" htmlFor="someRadio-34">Free</label>
                                                                                    </div>
                                                                                    <div className="custom-radio form-check-inline m-0">
                                                                                        <input className={access.level !== "free" ? `custom-radio-input checked` : `custom-radio-input`} id="someRadio-35" name="someRadio-accesslevel" type="radio" value="paid" onChange={e => handleAccess(ACCESS.LEVEL, e)} />
                                                                                        <label className="custom-radio-elem mb-0" htmlFor="someRadio-35"></label>
                                                                                        <label className="custom-radio-label2" htmlFor="someRadio-35">Paid Subscribers</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>

                                                </div>
                                            </div>
                                        </Collapse>
                                    </div>
                                    <div className="accordion-group create-thumb">
                                        <div className="accordion-heading">
                                            <div className="accordion-toggle d-flex justify-content-between pr-4" onClick={() => setStep2(!step2)}>
                                                <p style={{ marginBottom: 0 }}>Step Two - Select your thumball’s colors <i className="fa fas fa-question-circle"></i></p>
                                                <div>&#9662;</div>
                                            </div>
                                        </div>
                                        <Collapse isOpened={step2}>
                                            <div id="collapseTwo" className="accordion-body collapse show">
                                                <div className="accordion-inner">
                                                    <div className="form__container">
                                                        <div className="choose-color">
                                                            <label>Primary Color</label>
                                                            <ul>
                                                                {colors !== [] && colors.map(color => (
                                                                    <li key={color.id}><a onClick={() => setPrimaryColor(color.value)} className={primarycolor === color.value ? `cursor-pointer box-highlight` : `cursor-pointer`}><span className={"hex " + color.color}></span> <h6>{color.label}</h6></a></li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div className="choose-color">
                                                            <label>Secondary color</label>
                                                            <ul>
                                                                {colors !== [] && colors.map(color => (
                                                                    <li key={color.id}><a onClick={() => setSecondaryColor(color.value)} className={secondarycolor === color.value ? `cursor-pointer box-highlight` : `cursor-pointer`}><span className={"hex " + color.color}></span> <h6>{color.label}</h6></a></li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </Collapse>
                                    </div>

                                    <div className="accordion-group create-thumb">
                                        <div className="accordion-heading">
                                            <div className="accordion-toggle d-flex justify-content-between pr-4" onClick={() => setStep3(!step3)}>
                                                Step 3 - Fill in your Thumball’s panels
                                            <div>&#9662;</div>
                                            </div>
                                        </div>
                                        <Collapse isOpened={step3}>
                                            <div id="collapseThree" className="accordion-body collapse show">
                                                <div className="accordion-inner">
                                                    {(thumballtype === THUMBALLTYPE.CLASSIC12 || thumballtype === THUMBALLTYPE.CLASSIC32) &&
                                                        <div className="d-flex align-items-start">
                                                            <div className="ifeel">
                                                                <img src={ifeel} alt="ifeel" />
                                                            </div>

                                                            <div className="thumball-panel">
                                                                <ul>
                                                                    {thumballtype === THUMBALLTYPE.CLASSIC12 && classic12.map((item, index) => (
                                                                        <li key={index}>
                                                                            <input type="text" value={item} onChange={e => handleClassic12Change(e, index)} />
                                                                        </li>
                                                                    ))}
                                                                    {thumballtype === THUMBALLTYPE.CLASSIC32 && classic32.map((item, index) => (
                                                                        <li key={index}>
                                                                            <input type="text" value={item} onChange={e => handleClassic32Change(e, index)} />
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    }
                                                    {(thumballtype === THUMBALLTYPE.CHALLENGE12 || thumballtype === THUMBALLTYPE.CHALLENGE32) &&
                                                        <div className="form__container">
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col mb-6">
                                                                        <label>Will the question types be?</label>
                                                                        <div className="custom-radio form-check-inline m-0 mr-5">
                                                                            <input className={!singletype ? "custom-radio-input checked" : "custom-radio-input"} id="someRadio-312" type="radio" onChange={() => { if (panels.length === 0) { setSingleType(false) } }} checked={!singletype} />
                                                                            <label className="custom-radio-elem mb-0" htmlFor="someRadio-312"></label>
                                                                            <label className="custom-radio-label2" htmlFor="someRadio-312">A Variety</label>
                                                                        </div>
                                                                        <div className="custom-radio form-check-inline m-0">
                                                                            <input className={singletype ? "custom-radio-input checked" : "custom-radio-input"} id="someRadio-313" type="radio" onChange={() => { if (panels.length === 0) { setSingleType(true) } }} checked={singletype} />
                                                                            <label className="custom-radio-elem mb-0" htmlFor="someRadio-313"></label>
                                                                            <label className="custom-radio-label2" htmlFor="someRadio-313">A Single Question Type</label>
                                                                        </div>
                                                                    </div>
                                                                    {singletype &&
                                                                        <div className="col mb-6" id="ques1">
                                                                            <label>Select the type of question that will be used</label>
                                                                            <select className="form-control form-control-gra" id="exampleFormControlSelect1" value={questiontype} onChange={e => { if (panels.length === 0) { setQuestionType(e.target.value) } }}>
                                                                                {((usertype === USERTYPE.CUSTOMER || usertype === USERTYPE.EDITOR) && pricingtier === 1 ? QUESTIONTYPE1 : QUESTIONTYPE2).map(item => (
                                                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    }
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col">
                                                                        <p className="py-3">(PLEASE NOTE, AFTER THIS OPTION HAS BEEN SELECTED IT WILL BE LOCKED AND CANNOT BE CHANGED.)</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row mt-4">
                                                                    <div className="col">
                                                                        <label>Provide encouragement/reinforcement to the user?</label>
                                                                        <div className="d-flex align-items-center">
                                                                            <a className="clickhere cursor-pointer" onClick={() => setModalIsOpen(true)} >Click here for a sample.</a>
                                                                            <div className="ml-5">
                                                                                <div className="custom-radio form-check-inline m-0 mr-5">
                                                                                    <input className={encourage ? `custom-radio-input checked` : `custom-radio-input`} value="1" id="someRadio-322" name="radio-encourage" type="radio" onChange={e => setEncourage(true)} />
                                                                                    <label className="custom-radio-elem mb-0" htmlFor="someRadio-322"></label>
                                                                                    <label className="custom-radio-label2" htmlFor="someRadio-322">Yes</label>
                                                                                </div>
                                                                                <div className="custom-radio form-check-inline m-0">
                                                                                    <input className={!encourage ? `custom-radio-input checked` : `custom-radio-input`} value="0" id="someRadio-323" name="radio-encourage" type="radio" onChange={e => setEncourage(false)} />
                                                                                    <label className="custom-radio-elem mb-0" htmlFor="someRadio-323"></label>
                                                                                    <label className="custom-radio-label2" htmlFor="someRadio-323">No</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        {encourage &&
                                                                            <input type="text" className="form-control" placeholder="Reinforcement Message" value={encouragemessage} onChange={e => setEncourageMessage(e.target.value)} />
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="row mt-3">
                                                                    <div className="col">
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label>How often? Every </label>
                                                                                <select className="form-control" value={often} onChange={e => setOften(e.target.value)}>
                                                                                    <option value={0}>Select Date</option>
                                                                                    <option value={1}>First</option>
                                                                                    <option value={2}>Second</option>
                                                                                    <option value={3}>Third</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="col">
                                                                                <label>panel that is</label>
                                                                                <select className="form-control" value={panelthatis} onChange={e => setPanelThatIs(e.target.value)}>
                                                                                    <option value={0}>Select Panel</option>
                                                                                    <option value={1}>Answered Correctly</option>
                                                                                    <option value={2}>Answered Correctly</option>
                                                                                    <option value={3}>Answered Correctly</option>
                                                                                    <option value={4}>Answered Correctly</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col">

                                                                        {panels !== [] && panels.map(panel => (

                                                                            <div key={panel.index} className="panel d-block">
                                                                                <div className="w-full cursor-pointer" onClick={(e) => handlePanel(panel.index, "open", e)}>
                                                                                    <h5>Panel {panel.index + 1}
                                                                                        {!panel.open &&
                                                                                            <span className="panel-minimize-questiontype">question type: {getQuestionName(panel.type)}</span>
                                                                                        }
                                                                                    </h5>
                                                                                    {!panel.open &&
                                                                                        <div id="collapse12" className="accordion-body collapse show">
                                                                                            <div className="accordion-inner">
                                                                                                <div className="d-flex align-items-start justify-content-between mr-3">
                                                                                                    <p><strong>Question:</strong>{panel.title}</p>
                                                                                                    <button type="button" className="btn btn__submit preview">Preview</button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    }
                                                                                </div>

                                                                                <Collapse isOpened={panel.open === 1}>
                                                                                    <div className="row">
                                                                                        <div className="col-6">
                                                                                            <label>Select type of question</label>
                                                                                            <select className="form-control" id="exampleFormControlSelect1" value={panel.type} onChange={e => handlePanel(panel.index, "type", e)}>
                                                                                                {((usertype === USERTYPE.CUSTOMER || usertype === USERTYPE.EDITOR) && pricingtier === 1 ? QUESTIONTYPE1 : QUESTIONTYPE2).map(item => (
                                                                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                                                                ))}
                                                                                            </select>
                                                                                        </div>
                                                                                        {(panel.type === PANELTYPE.TRUEANDFALSE || panel.type === PANELTYPE.MULTIPLE) &&
                                                                                            <div className="col-6">
                                                                                                <label>Can the order of the answers be:</label>
                                                                                                <div className="d-flex align-items-center justify-content-between">
                                                                                                    <div className="custom-radio form-check-inline m-0">
                                                                                                        <input className={panel.content.order === "random" ? `custom-radio-input checked` : `custom-radio-input`} id={`someRadio-333-` + panel.index} value="random" name={`radio-order-type-` + panel.index} type="radio" onChange={(e) => handleContent(panel.index, CONTENTTYPE.ORDER, e)} checked={panel.content.order === "random"} />
                                                                                                        <label className="custom-radio-elem mb-0" htmlFor={`someRadio-333-` + panel.index}></label>
                                                                                                        <label className="custom-radio-label2" htmlFor={`someRadio-333-` + panel.index}>Random</label>
                                                                                                    </div>
                                                                                                    <div className="custom-radio form-check-inline m-0">
                                                                                                        <input className={panel.content.order === "asentered" ? `custom-radio-input checked` : `custom-radio-input`} id={`someRadio-343-` + panel.index} value="asentered" name={`radio-order-type-` + panel.index} type="radio" onChange={(e) => handleContent(panel.index, CONTENTTYPE.ORDER, e)} checked={panel.content.order !== "random"} />
                                                                                                        <label className="custom-radio-elem mb-0" htmlFor={`someRadio-343-` + panel.index}></label>
                                                                                                        <label className="custom-radio-label2" htmlFor={`someRadio-343-` + panel.index}>Specific order as entered</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                        {panel.type !== PANELTYPE.MULTIPLE &&
                                                                                            <div className="col-12">
                                                                                                <label>Enter question</label>
                                                                                                <input type="text" className="form-control boldplace" onChange={(e) => handlePanel(panel.index, "title", e)} value={panel.title} placeholder="Enter question" />
                                                                                            </div>
                                                                                        }
                                                                                        {panel.type === PANELTYPE.MATCHING &&
                                                                                            <div className="col-12">
                                                                                                <div className="ans-hdr chrono-hdr ">
                                                                                                    <h6></h6>
                                                                                                    <h6>Enter the Choice/Match pairs.</h6>
                                                                                                </div>
                                                                                                <div className="ans-hint">
                                                                                                    <ol className="ans-flds" style={{ listStyle: "none" }}>
                                                                                                        {panel.content.answers.matching !== [] && panel.content.answers.matching.map(item => (
                                                                                                            <li key={item.index} className="ans-fld">
                                                                                                                <div className="row d-flex justify-content-start align-items-center">
                                                                                                                    <div className="col-md-2 col-sm-12 text-center">
                                                                                                                        {(item.index + 1) + "."}
                                                                                                                    </div>
                                                                                                                    <div className="col-md-5 col-sm-12">
                                                                                                                        <input type="text" className="form-control m-0" onChange={(e) => handleContentAnswers(panel.index, item.index, panel.type, "choice", e)} placeholder={`Enter Choice #` + (item.index + 1)} value={item.choice} />
                                                                                                                    </div>
                                                                                                                    <div className="col-md-5 col-sm-12">
                                                                                                                        <input type="text" className="form-control m-0" onChange={(e) => handleContentAnswers(panel.index, item.index, panel.type, "match", e)} placeholder={`Enter Match #` + (item.index + 1)} value={item.match} />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </li>
                                                                                                        ))
                                                                                                        }
                                                                                                    </ol>
                                                                                                    <div className="add-btn">
                                                                                                        <button type="button" className="btn btn__submit addpanel" onClick={() => addAnswerField(panel.index, panel.type)}>Add Choice/Match</button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                        {panel.type === PANELTYPE.TRUEANDFALSE &&
                                                                                            <div className="col-6 mt-3 mb-5">
                                                                                                <label>Is the answer to the above question?</label>
                                                                                                <div className="d-flex align-items-center">
                                                                                                    <div className="custom-radio form-check-inline m-0 mr-5">
                                                                                                        <input className={panel.content.correctness === 1 ? `custom-radio-input checked` : `custom-radio-input`} id={`someRadio-398-` + panel.index} name={`radio-answer-` + panel.index} value={1} type="radio" onChange={(e) => handleContent(panel.index, CONTENTTYPE.CORRECT, e)} checked={panel.content.correctness === 1} />
                                                                                                        <label className="custom-radio-elem mb-0" htmlFor={`someRadio-398-` + panel.index}></label>
                                                                                                        <label className="custom-radio-label2" htmlFor={`someRadio-398-` + panel.index}>True</label>
                                                                                                    </div>
                                                                                                    <div className="custom-radio form-check-inline m-0">
                                                                                                        <input className={panel.content.correctness === 0 ? `custom-radio-input checked` : `custom-radio-input`} id={`someRadio-399-` + panel.index} name={`radio-answer-` + panel.index} value={0} type="radio" onChange={(e) => handleContent(panel.index, CONTENTTYPE.CORRECT, e)} checked={panel.content.correctness !== 1} />
                                                                                                        <label className="custom-radio-elem mb-0" htmlFor={`someRadio-399-` + panel.index}></label>
                                                                                                        <label className="custom-radio-label2" htmlFor={`someRadio-399-` + panel.index}>False</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                        {panel.type === PANELTYPE.CHRONO &&
                                                                                            <div className="col-12">
                                                                                                <div className="ans-hdr chrono-hdr ">
                                                                                                    <h6></h6>
                                                                                                    <h6>Put the answers/items in correct order. We’ll randomize the order when the question is presented to the user.</h6>
                                                                                                </div>
                                                                                                <div className="ans-hint">
                                                                                                    <ol className="ans-flds list-order">
                                                                                                        {panel.content.answers.chrono !== [] && panel.content.answers.chrono.map(item => (
                                                                                                            <li key={item.index} className="ans-fld">
                                                                                                                <p>
                                                                                                                    <input type="text" className="form-control m-0" onChange={(e) => handleContentAnswers(panel.index, item.index, panel.type, "answer", e)} placeholder="Add your answer here..." value={item.answer} />
                                                                                                                </p>
                                                                                                            </li>
                                                                                                        ))
                                                                                                        }
                                                                                                    </ol>
                                                                                                    <div className="add-btn">
                                                                                                        <button type="button" className="btn btn__submit addpanel" onClick={() => addAnswerField(panel.index, panel.type)}>Add Item</button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                        {panel.type === PANELTYPE.FILL &&
                                                                                            <>
                                                                                                <div className="col-12">
                                                                                                    <div className="ans-hdr chrono-hdr ">
                                                                                                        <h6>Sr No.</h6>
                                                                                                        <h6>Enter the [Blank] Answers</h6>
                                                                                                    </div>
                                                                                                    <div className="ans-hint">
                                                                                                        <ol className="ans-flds list-order">
                                                                                                            {panel.content.answers.fill !== [] && panel.content.answers.fill.map(item => (
                                                                                                                <li key={item.index} className="ans-fld">
                                                                                                                    <p>
                                                                                                                        <input type="text" className="form-control m-0" onChange={(e) => handleContentAnswers(panel.index, item.index, panel.type, "answer", e)} value={item.answer} placeholder={"Enter [Blank #" + (item.index + 1) + "] Answer"} />
                                                                                                                    </p>
                                                                                                                </li>
                                                                                                            ))
                                                                                                            }
                                                                                                        </ol>
                                                                                                        <div className="add-btn">
                                                                                                            <button type="button" className="btn btn__submit addpanel" onClick={() => addAnswerField(panel.index, panel.type)}>Add Blank Space</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="col mb-5">
                                                                                                    <label>Are the answers case sensitive?</label>
                                                                                                    <div className="d-flex align-items-center">
                                                                                                        <div className="custom-radio form-check-inline m-0 mr-5">
                                                                                                            <input className={panel.content.casesensitive === 1 ? `custom-radio-input checked` : `custom-radio-input`} value={1} id={`someRadio-378-` + panel.index} name="radio-case" type="radio" onChange={(e) => handleContent(panel.index, CONTENTTYPE.CASE, e)} checked={panel.content.casesensitive === 1} />
                                                                                                            <label className="custom-radio-elem mb-0" htmlFor={`someRadio-378-` + panel.index}></label>
                                                                                                            <label className="custom-radio-label2" htmlFor={`someRadio-378-` + panel.index}>Yes</label>
                                                                                                        </div>
                                                                                                        <div className="custom-radio form-check-inline m-0">
                                                                                                            <input className={panel.content.casesensitive === 0 ? `custom-radio-input checked` : `custom-radio-input`} value={0} id={`someRadio-379-` + panel.index} name="radio-case" type="radio" onChange={(e) => handleContent(panel.index, CONTENTTYPE.CASE, e)} checked={panel.content.casesensitive !== 1} />
                                                                                                            <label className="custom-radio-elem mb-0" htmlFor={`someRadio-379-` + panel.index}></label>
                                                                                                            <label className="custom-radio-label2" htmlFor={`someRadio-379-` + panel.index}>No</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        }
                                                                                        {panel.type === PANELTYPE.MULTIPLE &&
                                                                                            <>
                                                                                                <div className="col-6">
                                                                                                    <label>Should the user be provided with hints if they select a wrong answer? </label>
                                                                                                    <div className="d-flex align-items-center">
                                                                                                        <div className="custom-radio form-check-inline m-0 mr-5">
                                                                                                            <input className="custom-radio-input" id={`someRadio-344-` + panel.index} name={`radio-hint-` + panel.index} value={1} type="radio" onChange={(e) => handleContent(panel.index, CONTENTTYPE.PROVIDE, e)} checked={panel.content.providedwithhint === 1} />
                                                                                                            <label className="custom-radio-elem mb-0" htmlFor={`someRadio-344-` + panel.index}></label>
                                                                                                            <label className="custom-radio-label2" htmlFor={`someRadio-344-` + panel.index}>Yes</label>
                                                                                                        </div>
                                                                                                        <div className="custom-radio form-check-inline m-0">
                                                                                                            <input className="custom-radio-input" id={`someRadio-345-` + panel.index} name={`radio-hint-` + panel.index} value={0} type="radio" onChange={(e) => handleContent(panel.index, CONTENTTYPE.PROVIDE, e)} checked={panel.content.providedwithhint !== 1} />
                                                                                                            <label className="custom-radio-elem mb-0" htmlFor={`someRadio-345-` + panel.index}></label>
                                                                                                            <label className="custom-radio-label2" htmlFor={`someRadio-345-` + panel.index}>No</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6">
                                                                                                    <label>How many hints should they be given </label>
                                                                                                    <select className="form-control" id="exampleFormControlSelect1" value={panel.content.hintnumber} onChange={(e) => handleContent(panel.index, CONTENTTYPE.HINTNUMBER, e)}>
                                                                                                        <option value={null}>Until they get the correct answer</option>
                                                                                                        <option value="1">1</option>
                                                                                                        <option value="2">2</option>
                                                                                                        <option value="3">3</option>
                                                                                                        <option value="4">4</option>
                                                                                                        <option value="5">5</option>
                                                                                                    </select>
                                                                                                </div>
                                                                                                <div className="col-12">
                                                                                                    <label>Enter question</label>
                                                                                                    <input type="text" className="form-control" value={panel.title} onChange={(e) => handlePanel(panel.index, "title", e)} placeholder="How long will food stored constantly at 0º F remain safe?" />
                                                                                                </div>
                                                                                                <div className="col-12">
                                                                                                    <div className="ans-hdr">
                                                                                                        <h6>Answer</h6>
                                                                                                        <h6 className="max-wd">CorrectAnswer</h6>
                                                                                                        <h6>Hint</h6>
                                                                                                    </div>
                                                                                                    <div className="ans-hint">
                                                                                                        <div className="ans-flds">
                                                                                                            {panel.content.answers.multiple !== [] && panel.content.answers.multiple.map(item => (
                                                                                                                <div key={item.index} className="ans-fld d-flex align-items-center justify-content-between">
                                                                                                                    <input type="text" className="form-control m-0" value={item.answer} onChange={(e) => handleContentAnswers(panel.index, item.index, panel.type, "answer", e)} />
                                                                                                                    <div className="custom-radio form-check-inline m-0 mx-5">
                                                                                                                        <input className={item.correct === 1 ? "custom-radio-input checked" : "custom-radio-input"} id={"someRadio-multiple-" + panel.index + item.index} name={"radio-answer-field-hine-" + panel.index} value={panel.index + "" + item.index} type="radio" onChange={(e) => handleContentAnswers(panel.index, item.index, panel.type, "correct", e)} checked={item.correct === 1} />
                                                                                                                        <label className="custom-radio-elem mb-0" htmlFor={"someRadio-multiple-" + panel.index + item.index}></label>
                                                                                                                    </div>
                                                                                                                    <input type="text" className="form-control m-0" value={item.hint} placeholder="Add hint here..." onChange={(e) => handleContentAnswers(panel.index, item.index, panel.type, "hint", e)} />
                                                                                                                </div>
                                                                                                            ))
                                                                                                            }
                                                                                                        </div>
                                                                                                        <div className="add-btn">
                                                                                                            <button type="button" className="btn btn__submit addpanel" onClick={() => addAnswerField(panel.index, panel.type)}>Add Answer</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        }

                                                                                        <div className="col-12">
                                                                                            <label>Want to share additional information after the question has been answered?  Enter it here. ..</label>
                                                                                            <input type="text" className="form-control boldplace" onChange={(e) => handlePanel(panel.index, "info", e)} value={panel.info} placeholder="Food will be safe indefinitely at 0º F though the quality will decrease the longer it is in the freezer." />
                                                                                        </div>
                                                                                    </div>
                                                                                </Collapse>
                                                                            </div>
                                                                        ))}
                                                                        <div className="text-right">
                                                                            <button type="button" className="btn btn__submit addpanel" onClick={addPanel} >Add Panel</button>
                                                                        </div>

                                                                    </div>
                                                                </div>

                                                            </form>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </Collapse>
                                    </div>

                                    <div className="accordion-group create-thumb">
                                        <div className="accordion-heading">
                                            <div className="accordion-toggle d-flex justify-content-between pr-4" onClick={() => setStep4(!step4)}>
                                                Step 4 - Publish your Thumball
                                            <div>&#9662;</div>
                                            </div>
                                        </div>
                                        <Collapse isOpened={step4}>
                                            <div id="collapseFour" className="accordion-body collapse show">
                                                <div className="accordion-inner">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <a href="/thumballs/all"><button type="submit" className="btn btn__submit btn__cancel mr-4">Cancel</button></a>
                                                        <div className="form-group my-4">
                                                            <button className="btn btn__submit preview mr-4" onClick={() => addThumball(SAVETYPE.DRAFT)}>Save Draft</button>
                                                            <button className="btn btn__submit gren" onClick={() => addThumball(SAVETYPE.PUBLISH)}>Publish</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Collapse>
                                    </div>
                                </div>
                                <Modal
                                    isOpen={modalIsOpen}
                                    onAfterOpen={afterOpenModal}
                                    onRequestClose={closeModal}
                                    style={customStyles}
                                    contentLabel="Example Modal"
                                >
                                    <div className="text-primary px-4 py-5 encourage-text">Great Job! All of your studying has paid off!</div>
                                </Modal>

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
const condition = authUser => !!authUser && !(Number(authUser.user_type_id) === USERTYPE.EDITOR && !authUser.capability.thumball);

export default compose(withFirebase, withAuthorization(condition))(ThumballAdd);