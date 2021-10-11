import React, { useState, useEffect } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import { compose } from 'recompose';
import LoadingLayout from '../../../layouts/LoadingLayout';
import { useHistory } from 'react-router-dom';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import Moment from 'moment-timezone';


import { countries } from '../../../constants/countries'
import { states } from '../../../constants/states'
import { generate } from 'generate-password';
import { organizationtypes } from '../../../constants/organizationtypes'
import { updateAccount } from '../../../services/Apis/accountService';
import { USERTYPE } from '../../../constants/usertypes';



const CustomerEdit = (props) => {

    let history = useHistory();

    const [loading, setLoading] = useState(true);

    const [organization, setOrganization] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [customertype, setCustomertype] = useState("");

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [mobile, setMobile] = useState("");
    const [officephone, setOfficePhone] = useState("");

    const [belongpartner, setBelongPartner] = useState(true);

    const [partner, setPartner] = useState("");

    const [note, setNote] = useState("");

    const [partnerlist, setPartnerList] = useState([]);

    const [accounttype, setAccounttype] = useState("");
    const [childtype, setChildtype] = useState("");
    const [typelist, setTypeList] = useState(organizationtypes);

    const [usertype, setUserType] = useState(0);


    const getUserById = id => {
        setLoading(true);
        props.firebase.user(id).get()
            .then(doc => {
                if (doc.exists) {
                    var res = doc.data();
                    setEmail(res.email);
                    setLoading(false);
                }
            })
    }

    const getCustomerById = id => {

        props.firebase.customer(id).get()
            .then(doc => {
                if (doc.exists) {
                    console.log("Customer-----", doc.data());
                    var res = doc.data();

                    setOrganization(res.organization_name);
                    setAddress1(res.address_1);
                    setAddress2(res.address_2);
                    setCountry(res.country);
                    setCity(res.city);
                    setState(res.state);
                    setZipcode(res.postal_code);
                    setFirstname(res.contact_first_name);
                    setLastname(res.contact_last_name);
                    setMobile(res.mobile_phone);
                    setOfficePhone(res.office_phone);
                    setNote(res.note);
                    setBelongPartner(res.partner !== "" ? true : false);
                    setPartner(res.partner);
                    setAccounttype(res.organization_type_main);
                    setChildtype(res.organization_type_child);

                    setLoading(false);
                }
            })
    }


    const getPartners = () => {

        var partners_ = [];

        props.firebase.partners().get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    partners_.push({ id: doc.id, ...doc.data() });
                });
                console.log("Partners Received-----", partners_);
                setPartnerList(partners_);
                setLoading(false);
            });
    }

    const update = () => {

        let date = Moment.tz(new Date(), "Europe/Paris").format();

        setLoading(true);

        updateAccount({ uid: props.match.params.id, email: email, password: password })
            .then(res => {
                return props.firebase.user(props.match.params.id).update({
                    user_type_id: USERTYPE.CUSTOMER.toString(),
                    first_name: firstname,
                    last_name: lastname,
                    email: email,
                    modified_at: Moment(date).format("x")
                });
            })
            .then(() => {
                return props.firebase.customer(props.match.params.id).update({
                    organization_name: organization,
                    contact_first_name: firstname,
                    contact_last_name: lastname,
                    address_1: address1,
                    address_2: address2,
                    country: country,
                    city: city,
                    state: state,
                    postal_code: zipcode,
                    partner: belongpartner ? partner : "",
                    mobile_phone: mobile,
                    office_phone: officephone,
                    note: note,
                    organization_type_main: accounttype,
                    organization_type_child: childtype,
                    modified_at: Moment(date).format("x")
                });
            })
            .then(() => {
                console.log("-----Updated-----");
                setLoading(false);
                history.push("/customers/all");

            })
            .catch(error => {
                console.log("=====error", error);
                setLoading(false);
            });

    }

    useEffect(() => {
        getUserById(props.match.params.id)
        getCustomerById(props.match.params.id);
        getPartners();
        getUserType();
    }, []);

    const generatePassword = () => {
        setPassword(generate({
            length: 15,
            numbers: true,
            symbols: true
        }));
    }

    const handleAccountType = e => {
        setAccounttype(e.target.value);
        setChildtype("");
    }

    const getUserType = () => {
        var data = JSON.parse(localStorage.getItem("authUser"));
        if (data) {
            setUserType(Number(data.user_type_id));
        }
    }

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="customers" page="new" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Edit Customer</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="box__wrapper">
                                    <div className="form__container">
                                        <div>
                                            <div className="form-group">
                                                <label htmlFor="organization">Organization’s Name</label>
                                                <input type="text" className="form-control" placeholder="Add Organization Name" value={organization} onChange={e => setOrganization(e.target.value)} />
                                            </div>
                                            <h5>Mailing Address</h5>
                                            <div className="form-group">
                                                <label htmlFor="addr1">Address 1</label>
                                                <input type="text" className="form-control" placeholder="Add Address" value={address1} onChange={e => setAddress1(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="addr2">Address 2</label>
                                                <input type="text" className="form-control" placeholder="Add Address" value={address2} onChange={e => setAddress2(e.target.value)} />
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="exampleFormControlSelect1">Country</label>
                                                        <select className="form-control" id="exampleFormControlSelect1" value={country} onChange={e => setCountry(e.target.value)}>
                                                            <option value="" disabled defaultValue>Select Your Country</option>
                                                            {countries.map((item, index) => (
                                                                <option key={index} value={item}>{item}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="city">City</label>
                                                        <input type="text" className="form-control" placeholder="Add City" value={city} onChange={e => setCity(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="exampleFormControlSelect1">State</label>
                                                        <select className="form-control" id="exampleFormControlSelect1" value={state} onChange={e => setState(e.target.value)}>
                                                            <option value="" disabled defaultValue>Select Your State</option>
                                                            {states.map((item, index) => (
                                                                <option key={index} value={item}>{item}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="zipcode">Zip Code</label>
                                                        <input type="text" className="form-control" placeholder="Add Zipcode" value={zipcode} onChange={e => setZipcode(e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <h5>Admin Information</h5>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="firstname">First Name</label>
                                                        <input type="text" className="form-control" placeholder="Add First Name" value={firstname} onChange={e => setFirstname(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="lastname">Last Name</label>
                                                        <input type="text" className="form-control" placeholder="Add Last Name" value={lastname} onChange={e => setLastname(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="email">Email</label>
                                                        <input type="text" className="form-control" placeholder="Add Email" value={email} onChange={e => setEmail(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="field-group">
                                                                <label htmlFor="password">Password</label>
                                                                <input type="text" id="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 align-bottom">
                                                            <div className="field-group">
                                                                <button type="button" className="btn generate-pasword" onClick={generatePassword}>Generate Secure Password</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="form-group">
                                                                <label htmlFor="mobile">Mobile</label>
                                                                <input type="text" className="form-control" placeholder="Add Mobile" value={mobile} onChange={e => setMobile(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="form-group">
                                                                <label htmlFor="officephone">Office Phone</label>
                                                                <input type="text" className="form-control" placeholder="Add Office Phone" value={officephone} onChange={e => setOfficePhone(e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <p>Select Type of Account</p>
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="form-group">
                                                                <select className="form-control" id="exampleFormControlSelect1" value={accounttype} onChange={e => handleAccountType(e)}>
                                                                    <option value="" disabled defaultValue>Select One</option>
                                                                    {typelist !== [] && typelist.filter(obj => { return obj.parent === 0 }).map(item => (
                                                                        <option key={item.id} value={item.id}>{item.type}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="form-group">
                                                                <select className="form-control" value={childtype} onChange={e => setChildtype(e.target.value)}>
                                                                    <option value="" disabled defaultValue>Select One</option>
                                                                    {typelist !== [] && typelist.filter(obj => { return obj.parent === Number(accounttype) }).map(item => (
                                                                        <option key={item.id} value={item.id}>{item.type}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {usertype === USERTYPE.SUPERADMIN &&
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <label htmlFor="belongpartner pl-3">Does this customer belong to a Partner?</label>
                                                                <div className="form-group">
                                                                    <div className="custom-radio form-check-inline mr-5">
                                                                        <input className={belongpartner ? "custom-radio-input checked" : "custom-radio-input"} id="someRadio-1" name="radio-partner" type="radio" onChange={() => setBelongPartner(true)} />
                                                                        <label className="custom-radio-elem" htmlFor="someRadio-1"></label>
                                                                        <label className="custom-radio-label" htmlFor="someRadio-1">Yes</label>
                                                                    </div>
                                                                    <div className="custom-radio form-check-inline">
                                                                        <input className={!belongpartner ? "custom-radio-input checked" : "custom-radio-input"} id="someRadio-2" name="radio-partner" type="radio" onChange={() => setBelongPartner(false)} />
                                                                        <label className="custom-radio-elem" htmlFor="someRadio-2"></label>
                                                                        <label className="custom-radio-label" htmlFor="someRadio-2">No</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {belongpartner &&
                                                                <div className="col-6">
                                                                    <div className="form-group">
                                                                        <label htmlFor="exampleFormControlSelect1">Please select the Parnter</label>
                                                                        <select className="form-control" id="exampleFormControlSelect1" value={partner} onChange={e => setPartner(e.target.value)}>
                                                                            <option value="" disabled defaultValue>Select Partner</option>
                                                                            {partnerlist !== [] && partnerlist.map(partner => (
                                                                                <option key={partner.id} value={partner.id}>{partner.contact_first_name + partner.contact_last_name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                }

                                                <div className="col-12">
                                                    <div className="form-group add-cust">
                                                        <label htmlFor="exampleFormControlSelect1">Account Notes</label>
                                                        <textarea className="form-control" placeholder="Add account notes here..." value={note} onChange={e => setNote(e.target.value)}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <button type="button" className="btn btn__submit mr-4" onClick={update}>Submit</button>
                                            <a href="/customers/all"><button className="btn btn__submit btn__cancel">Cancel</button></a>
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

const condition = authUser => !!authUser && (Number(authUser.user_type_id) === USERTYPE.SUPERADMIN || Number(authUser.user_type_id) === USERTYPE.PARTNER);

export default compose(withFirebase, withAuthorization(condition))(CustomerEdit);