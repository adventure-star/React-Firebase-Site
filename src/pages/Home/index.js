import React, { useState, useEffect } from 'react'

import { compose } from 'recompose';
import { withAuthorization, withEmailVerification } from '../../services/Session';
import _ from 'lodash';
import { test } from '../../services/Apis/accountService'


import ball from '../../images/ball.png';
import user1 from '../../images/user-1.png';
import usercolor from '../../images/user-color.png';
import editor from '../../images/editor.png';
import editicon from '../../images/edit-icon.png';
import plus from '../../images/plus.png';

import LeftSideBar from '../../layouts/LeftSideBar';

import { withFirebase } from '../../services/Firebase';
import LoadingLayout from '../../layouts/LoadingLayout';
import CopyrightBrand from '../../components/CopyrightBrand';
import TopRight from '../../components/TopRight';
import { PRICING } from '../../constants/pricingtiers';
import { USERTYPE } from '../../constants/usertypes';

const Home = (props) => {

    const [loading, setLoading] = useState(true);

    const [partners, setPartners] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [editors, setEditors] = useState([]);

    const [usertype, setUserType] = useState(0);

    useEffect(() => {
        getCustomers();
        getPartners();
        getEditors();
        // test().then(test => console.log("Backend connected======", test)).catch(e => console.log('Connecting to backend failed. Error:', e.message));
        if (!localStorage.getItem("authUser")) {
            props.history.push("/signin");
        }

        var data = JSON.parse(localStorage.getItem("authUser"));
        if (data) {
            setUserType(Number(data.user_type_id));
        }

    }, []);

    const getPartners = () => {

        setLoading(true);

        var partners_ = [];

        props.firebase.partners().orderBy("created_at", "desc").get()
            .then(async (querySnapshot) => {

                console.log(querySnapshot.size);

                let index = 0;

                await querySnapshot.forEach(async (doc) => {
                    let customers = await getCustomersByPartnerId(doc.id);
                    if (customers) {
                        partners_.push({ id: doc.id, customers: customers, ...doc.data() });
                    }

                    index++;

                    if (index === querySnapshot.size) {

                        setPartners(_.cloneDeep(partners_));
                        console.log("partners_------", partners_);
                        setLoading(false);

                    }

                });

            })


    }

    const getCustomersByPartnerId = async (id) => {
        var customers_ = [];
        await props.firebase.customers().where("partner", "==", id).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    customers_.push(doc.data());
                });
            });

        return customers_;
    }

    const getCustomers = () => {

        setLoading(true);

        let customers_ = [];

        props.firebase.customers().orderBy("created_at", "desc").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    customers_.push({ id: doc.id, ...doc.data() });
                });
                console.log("Customers Received-----", customers_);

                return customers_;

            })
            .then(customers => {
                props.firebase.appusers().get()
                    .then((querySnapshot) => {
                        let users_ = [];
                        querySnapshot.forEach((doc) => {
                            users_.push({ id: doc.id, ...doc.data() });
                        });

                        let customers_modified = customers.map(item => {
                            let users = [];
                            users_.forEach(user => {
                                if (user.customer_id === item.id) {
                                    users.push(user);
                                }
                            });
                            return Object.assign({}, item, { users: users });
                        })

                        setCustomers(customers_modified);

                        setLoading(false);
                    });
            })

    }

    const getEditors = () => {

        setLoading(true);

        var item_ = [];

        props.firebase.editors().get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    item_.push({ id: doc.id, ...doc.data() });
                });
                console.log("Editors-----", item_);
                setEditors(item_);
                setLoading(false);
            });

    }

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="dashboard" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Dashboard</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="segment__wrapper">

                                    <div className="row overview-boxes">
                                        <div className="col-md-3">
                                            <div className="box-wraper">
                                                <div className="box thumballs">
                                                    <img src={ball} alt="ball" />
                                                    <p className="number">39</p>
                                                    <p>Thumballs</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="box-wraper">
                                                <div className="box partners">
                                                    <img src={user1} alt="user1" />
                                                    <p className="number">{partners.length}</p>
                                                    <p>Partners</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="box-wraper">
                                                <div className="box customer">
                                                    <img src={usercolor} alt="usercolor" />
                                                    <p className="number">{customers.length}</p>
                                                    <p>Customers</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="box-wraper">
                                                <div className="box editors">
                                                    <img src={editor} alt="editor" />
                                                    <p className="number">{editors.length}</p>
                                                    <p>Editors</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h4 className="segment__title mb-4">LATEST CUSTOMERS</h4>
                                    <table className="latest-customer-table">
                                        <thead>
                                            <tr>
                                                <th className="text-center">CLIENT NAME</th>
                                                <th className="text-center">ACCOUNT CONTACT</th>
                                                <th className="text-center">ACCOUNT TYPE</th>
                                                <th className="text-center"># OF USERS</th>
                                                <th className="text-center">STATUS</th>
                                                {usertype === USERTYPE.SUPERADMIN &&
                                                    <th className="text-center">EDIT</th>
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customers !== [] && customers.slice(0, customers.length > 5 ? 5 : customers.length).map(customer => (
                                                <tr key={customer.id}>
                                                    <td className="text-center">{customer.organization_name}</td>
                                                    <td className="text-center">{customer.contact_first_name + " " + customer.contact_last_name}</td>
                                                    <td className="text-center">
                                                        {
                                                            !!customer.pricing_tier ?
                                                                PRICING[Number(customer.pricing_tier) - 1].name
                                                                :
                                                                ""
                                                        }
                                                    </td>
                                                    <td className="text-center">{customer.users.length}</td>
                                                    <td className="text-center">
                                                        {customer.status === 1 &&
                                                            <span className="status active">Active</span>
                                                        }
                                                        {customer.status === 0 &&
                                                            <span className="status inactive">Inactive</span>
                                                        }
                                                    </td>
                                                    {usertype === USERTYPE.SUPERADMIN &&
                                                        <td className="text-center"><a href={"/customers/edit/" + customer.id}><img className="edit-icon" src={editicon} alt="edit" /></a></td>

                                                    }
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <h4 className="segment__title mb-4 mt-5">LATEST PARTNERS</h4>
                                    <table className="latest-customer-table">
                                        <thead>
                                            <tr>
                                                <th className="text-center">COMPANY</th>
                                                <th className="text-center">CONTACT</th>
                                                <th className="text-center"># OF CLIENTS</th>
                                                <th className="text-center">TOTAL REVENUE <br />GENERATED</th>
                                                <th className="text-center">REVENUE <br />TREND</th>
                                                {usertype === USERTYPE.SUPERADMIN &&
                                                    <th className="text-center">EDIT</th>
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {partners !== [] && partners.slice(0, partners.length > 5 ? 5 : partners.length).map(partner => (
                                                <tr key={partner.id}>
                                                    <td className="text-center">{partner.organization_name}</td>
                                                    <td className="text-center">{partner.contact_first_name + " " + partner.contact_last_name}</td>
                                                    <td className="text-center">{partner.customers.length}</td>
                                                    <td className="text-center">$10,000</td>
                                                    <td className="text-center">
                                                        <img src={plus} alt="plus" />
                                                    </td>
                                                    {usertype === USERTYPE.SUPERADMIN &&
                                                        <td className="text-center"><a href={"/partners/edit/" + partner.id}><img className="edit-icon" src={editicon} alt="edit" /></a></td>
                                                    }
                                                </tr>
                                            ))}
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

const condition = authUser => !!authUser;

export default compose(
    // withEmailVerification,
    withFirebase,
    withAuthorization(condition),
)(Home);