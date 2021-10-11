import React, { useState, useEffect } from 'react'

import invoice from '../../images/invoice.png';
import card from '../../images/card.png';
import LeftSideBar from '../../layouts/LeftSideBar';
import CopyrightBrand from '../../components/CopyrightBrand';
import LoadingLayout from '../../layouts/LoadingLayout';
import TopRight from '../../components/TopRight';

const MyAccount = () => {

    const [loading, setLoading] = useState(false);

    const [billings, setBillings] = useState([]);

    useEffect(() => {
        setBillings(demoBillings());
    }, []);

    const demoBillings = () => {
        return (
            [
                {
                    id: 1,
                    date: "8/20/2020",
                    totalamount: "$49"
                },
                {
                    id: 2,
                    date: "8/20/2020",
                    totalamount: "$49"
                },
                {
                    id: 3,
                    date: "8/20/2020",
                    totalamount: "$49"
                }
            ]
        )
    }
    return (
        <LoadingLayout loading={loading}>
            <>
            <div className="dashboard__menu">
                <LeftSideBar active="accounting" page="account" />
            </div>
            <div className="dashboard__content">
                <div className="ml-0">
                    <div className="row">
                        <div className="col-12">
                            <div className="dashboard__header">
                                <ul className="breadcumb">
                                    <li><a href="/">Home</a></li>
                                    <li><i className="fa fas fa-chevron-right"></i></li>
                                    <li className="active">My Account</li>
                                </ul>
                                <TopRight setLoading={setLoading} />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="content__wrapper">
                                <div className="content__title">
                                    <h5 className="text-uppercase">Contact Information</h5>
                                    <a href="#" className="edit__icon"><i className="fa fas fa-edit"></i></a>
                                </div>
                                <div className="content__area">
                                    <div className="contact__info">
                                        <p>Jane Doe</p>
                                        <p>janedoe@jacksonlocal.ohio.edu</p>
                                        <p>330-555-5555</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="content__wrapper">
                                <div className="content__title">
                                    <h5 className="text-uppercase">Current Plan</h5>
                                    <a href="#" className="edit__icon"><i className="fa fas fa-edit"></i></a>
                                </div>
                                <div className="content__area">
                                    <div className="contact__info">
                                        <p>classNameroom – $49 Monthly Plan</p>
                                        <p>Next billing date is 9/20/2020 </p>
                                        <p className="plan">Switch to annual plan - save 20%! <span>$470/year ($39/mo.)</span></p>
                                        <button type="submit" className="btn btn__submit mb-4 mr-4">Switch to Annual Plan</button>
                                        <button type="submit" className="btn btn__submit btn__cancel mb-4 mr-4">Cancel subscription</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="content__wrapper">
                                <div className="content__title">
                                    <h5 className="text-uppercase">Payment Method</h5>
                                    <a href="/update-card"><button className="btn btn__submit">Update Payment Method</button></a>
                                </div>
                                <div className="content__area">
                                    <div className="contact__info">
                                        <img src={card} alt="card" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card-panel">
                                <div className="d-flex justify-content-between align-items-center pb-3 border-new">
                                    <div className="Customers-title text-uppercase">Billing History</div>
                                </div>
                                <table className="table table-2 table-3">
                                    <tbody>
                                        <tr>
                                            <th style={{ width: "20%" }}>Date</th>
                                            <th style={{ width: "60%" }}>Total Amount</th>
                                            <th style={{ width: "20%" }}>Invoice</th>
                                        </tr>
                                        {billings !== [] && billings.map(billing => (
                                            <tr key={billing.id}>
                                                <td className="text-center">
                                                    <div className="date__flag">
                                                        {billing.date}
                                                    </div>
                                                </td>
                                                <td className="text-center"><strong>{billing.totalamount}</strong></td>
                                                <td className="text-center"><a href="#"><img src={invoice} alt="invoice" /></a></td>
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

export default MyAccount;