import React, { useState } from 'react'

import LeftSideBar from '../../layouts/LeftSideBar';
import CopyrightBrand from '../../components/CopyrightBrand';
import LoadingLayout from '../../layouts/LoadingLayout';
import TopRight from '../../components/TopRight';

const UpdateCard = () => {

    const [loading, setLoading] = useState(false);

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="accounting" page="card" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Update Credit Card</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="col-12 mb-5">
                                <form>
                                    <div className="content__wrapper">
                                        <div className="content__title">
                                            <h5>Update Credit Card</h5>
                                        </div>
                                        <div className="content__area">
                                            <div className="form__container form-row">
                                                <div className="form-group col-md-12 p-0">
                                                    <label htmlFor="validationTextarea">Card Number</label>
                                                    <input type="password" className="form-control" placeholder="**** **** **** **** " />
                                                </div>
                                                <div className="form-group col-md-4 pl-0">
                                                    <label htmlFor="validationTextarea">Expiry Month</label>
                                                    <input type="text" className="form-control" placeholder="MM" />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="validationTextarea">Expiry year</label>
                                                    <input type="text" className="form-control" placeholder="YYYY" />
                                                </div>
                                                <div className="form-group col-md-4 pr-0">
                                                    <label htmlFor="validationTextarea">Security Code</label>
                                                    <input type="text" className="form-control" placeholder="1111" />
                                                </div>
                                                <div className="text-left">
                                                    <button type="submit" className="btn btn__submit btn__cancel mr-4 mb-4">Cancel</button>
                                                    <button type="submit" className="btn btn__submit mb-4">Update</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-12 mt-5 pt-5">
                                <CopyrightBrand />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </LoadingLayout>
    )
}

export default UpdateCard;