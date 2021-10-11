import React, { useState } from 'react'

import cancel from '../../../images/cancel.png';
import currentsubs from '../../../images/current-subs.png';
import LeftSideBar from '../../../layouts/LeftSideBar';
import CopyrightBrand from '../../../components/CopyrightBrand';
import LoadingLayout from '../../../layouts/LoadingLayout';
import TopRight from '../../../components/TopRight';

const SubscriptionCancel = () => {
    const [loading, setLoading] = useState(false);
    return (
        <LoadingLayout loading={loading}>
            <>
            <div className="dashboard__menu">
                <LeftSideBar active="accounting" page="subscription" />
            </div>
            <div className="dashboard__content">
                <div className="ml-0">
                    <div className="row">
                        <div className="col-12">
                            <div className="dashboard__header">
                                <ul className="breadcumb">
                                    <li><a href="/">Home</a></li>
                                    <li><i className="fa fas fa-chevron-right"></i></li>
                                    <li className="active">Subscription Cancellation</li>
                                </ul>
                                <TopRight setLoading={setLoading} />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="box__wrapper">
                                <div className="form__container">
                                    <div className="d-flex align-items-center">
                                        <img src={currentsubs} alt="currentsubs" />
                                        <div className="current-subs ml-3">
                                            <h5>Your Current Subscription</h5>
                                            <p>
                                                Your subscription will automatically renew on September 20, 2020 and you will be charged <strong>USD $49.00</strong>
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="box__wrapper">
                                <div className="form__container">
                                    <div className="current-subs border-new pb-3">
                                        <h5>What will happen after I cancel?</h5>
                                        <p>Between now and September 20, 2020:</p>
                                    </div>
                                    <ul className="cancel-points">
                                        <li>Your current subscription will still be valid.</li>
                                        <li>You can continue creating and assigning Thumballs.</li>
                                        <li>You can continue adding and managing users.</li>
                                        <li>There will not be any refunds.</li>
                                    </ul>

                                    <h6>After September 20, 2020:</h6>
                                    <ul className="cancel-points orng">
                                        <li>Your payment method will no longer be charged unless you resubscribe.</li>
                                        <li>You will be able to see a list of your created Thumballs.</li>
                                        <li>You will not be able to create new Thumballs, assign Thumballs to users, add or delete users or download Thumbtrack
                      analytic reports.</li>
                                        <li>If you resubscribe, you will be charged a new subscription price (whatever the latest is at the time).</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="box__wrapper">
                                <div className="form__container">
                                    <div className="current-subs border-new pb-3">
                                        <h5>Your Current Subscription</h5>
                                    </div>
                                    <div className="d-flex">
                                        <img src={cancel} alt="cancel" />
                                        <div className="reason-list ml-md-5 ml-3 w-100">
                                            <h5>Why are you cancelling your subscription?</h5>
                                            <ul>
                                                <li><input type="radio" id="test1" name="radio-group" />
                                                    <label htmlFor="test1">There's not enough new content being added.</label>
                                                </li>
                                                <li><input type="radio" id="test2" name="radio-group" />
                                                    <label htmlFor="test2">I can't afford the subscription fee.</label>
                                                </li>
                                                <li><input type="radio" id="test3" name="radio-group" />
                                                    <label htmlFor="test3">The system is complicated to use.</label>
                                                </li>
                                                <li><input type="radio" id="test4" name="radio-group" defaultChecked />
                                                    <label htmlFor="test4">Other (please specify)</label>
                                                </li>
                                            </ul>
                                            <textarea placeholder="Other (please specify)"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group my-4">
                                <button type="submit" className="btn btn__submit btn__cancel mr-4">Cancel my Subscription</button>
                                <button type="submit" className="btn btn__submit">Keep My Subscription</button>
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

export default SubscriptionCancel;