import React, { useState, useEffect } from 'react'
import Moment from 'moment';

import LeftSideBar from '../../../layouts/LeftSideBar';
import CopyrightBrand from '../../../components/CopyrightBrand';
import LoadingLayout from '../../../layouts/LoadingLayout';
import TopRight from '../../../components/TopRight';
import { useHistory } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import { PRICING } from '../../../constants/pricingtiers';


const PromoAdd = (props) => {

    let history = useHistory();

    const [loading, setLoading] = useState(false);

    const [activate, setActivate] = useState(true);
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [promotype, setPromoType] = useState(0);
    const [discountamount, setDiscountAmount] = useState(0);
    const [duration, setDuration] = useState(14);
    const [datetype, setDateType] = useState(0);
    const [expirationdate, setExpirationDate] = useState("");
    const [limitpercoupon, setLimitPerCoupon] = useState("");
    const [limitpercustomer, setLimitPerCustomer] = useState("");
    const [promotiers, setPromoTiers] = useState({ Professional: true, Classroom: true, Team: true, Enterprise: true });

    const handleTiers = e => {

        setPromoTiers(Object.assign({}, promotiers, { [e.target.name]: !promotiers[e.target.name] }));

    }

    const addPromo = () => {

        setLoading(true);

        var ref = props.firebase.promos().doc();

        ref.set({
            code: code,
            description: description,
            promo_type: promotype,
            discount_amount: discountamount,
            duration: duration,
            date_type: datetype,
            expiration: expirationdate,
            limit_coupon: limitpercoupon,
            limit_customer: limitpercustomer,
            promo_tiers: promotiers,
            created: Moment(new Date()).format("YYYY-MM-DD"),
            activate: activate ? 1 : 0
        })
            .then(() => {
                console.log("-----Created-----");
                setLoading(false);
                history.push("/promos/all");

            })
            .catch(error => {
                console.log("=====error", error);
                setLoading(false);
            });
    }

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="promos" page="new" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Create New Promo</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="card-panel">
                                <div className="create-promo-form">
                                    <div className="field-group">
                                        <label htmlFor="code">Code</label>
                                        <input type="text" id="code" placeholder="Add Code" value={code} onChange={e => setCode(e.target.value)} />
                                    </div>

                                    <div className="field-group">
                                        <label htmlFor="description">Description (Optional) </label>
                                        <textarea type="text" id="description" placeholder="Add description here..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
                                    </div>

                                    <div className="form-section">
                                        <div className="inline-inputs">
                                            <div className="field-group">
                                                <label htmlFor="prommo-type">Promo Type</label>
                                                <select name="prommo-type" id="prommo-type" value={promotype} onChange={e => setPromoType(Number(e.target.value))}>
                                                    <option value="0">Fixed Discount</option>
                                                    <option value="1">% Off</option>
                                                    <option value="2">Free Period</option>
                                                </select>
                                            </div>
                                            <div className="field-group">
                                                <label htmlFor="discount-amount">Discount Amount</label>
                                                <div className="inline-inputs">
                                                    {promotype === 0 && <span className="currency">$</span>}
                                                    {promotype === 1 && <span className="currency">%</span>}
                                                    {promotype === 2 && <span className="currency">$</span>}
                                                    <input type="number" value={discountamount} onChange={e => setDiscountAmount(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="field-group">
                                                <label htmlFor="duration">Duration</label>
                                                <input type="number" value={duration} onChange={e => setDuration(e.target.value)} />
                                            </div>
                                            <div className="field-group">
                                                <label htmlFor="days-month">Days/Months</label>
                                                <select name="days-month" id="days-month" value={datetype} onChange={e => setDateType(e.target.value)}>
                                                    <option value="0">Days</option>
                                                    <option value="1">Months</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="inline-inputs">
                                            <div className="field-group">
                                                <label htmlFor="prommo-experation">Promo code expiration</label>
                                                <input type="date" id="prommo-experation" name="prommo-experation" value={expirationdate} onChange={e => setExpirationDate(e.target.value)} />
                                            </div>
                                            <div className="field-group">
                                                <label htmlFor="usage-limimt-per-coupon">Usage limit per coupon</label>
                                                <input type="number" id="usage-limimt-per-coupon" name="usage-limimt-per-coupon" placeholder="Uses Per Coupon" value={limitpercoupon} onChange={e => setLimitPerCoupon(e.target.value)} />
                                            </div>
                                            <div className="field-group">
                                                <label htmlFor="usage-limimt-per-customer">Usage limit per customer</label>
                                                <input type="number" id="usage-limimt-per-customer" name="usage-limimt-per-customer" placeholder="Uses Per customer" value={limitpercustomer} onChange={e => setLimitPerCustomer(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section field-group">
                                        <p className="label">Promo available on the following Pricing tiers</p>
                                        <div className="pricing-tires">
                                            {PRICING.map(item => (
                                                <label key={item.id} className="container"><span className="label">{item.name}</span>
                                                    <input type="checkbox" name={item.name} onChange={handleTiers} checked={promotiers[item.name]} />
                                                    <span className="checkmark"></span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pricing-tires mt-5">
                                        <label className="container"><span className="label">Can only be used on new account activation </span>
                                            <input type="checkbox" checked={activate} onChange={() => setActivate(!activate)} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>

                                    <div className="form-field mt-5">
                                        <div className="inline-buttons">
                                            <a href="/promos/all"><button className="btn btn-cancel">Cancel</button></a>
                                            <button className="btn btn-save" onClick={addPromo}> Save</button>
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

const condition = authUser => !!authUser;

export default compose(withFirebase, withAuthorization(condition))(PromoAdd);
