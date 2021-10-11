import React, { useState, useEffect } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';

import editicon_new from '../../../images/edit-icon-new.png';
import deleteicon from '../../../images/delete-icon.png';
import reporticon from '../../../images/report-icon.png';
import PerPageSelect from '../../../components/PerPageSelect';
import Pagination from '../../../components/Pagination';
import CopyrightBrand from '../../../components/CopyrightBrand';
import LoadingLayout from '../../../layouts/LoadingLayout';
import TopRight from '../../../components/TopRight';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';


const PromosList = (props) => {

    const [loading, setLoading] = useState(true);

    const [promos, setPromos] = useState([]);

    const [pagenumber, setPageNumber] = useState(0);
    const [perpage, setPerPage] = useState(5);

    const [sortasc, setSortASC] = useState(true);
    const [sorttype, setSortType] = useState("title");

    useEffect(() => {
        getPromos();
    }, []);

    const handlePerPage = e => {
        setPerPage(e.target.value);
        setPageNumber(0);
    }

    const sort = (type) => {
        switch (type) {
            case "code":
                if (type === sorttype) {
                    if (sortasc) {
                        setPromos(promos.sort((a, b) => b.code > a.code ? 1 : -1));

                    } else {
                        setPromos(promos.sort((a, b) => a.code > b.code ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setPromos(promos.sort((a, b) => a.code > b.code ? 1 : -1));
                    setSortASC(true);
                }
                break;
            case "type":
                if (type === sorttype) {
                    if (sortasc) {
                        setPromos(promos.sort((a, b) => b.promo_type > a.promo_type ? 1 : -1));

                    } else {
                        setPromos(promos.sort((a, b) => a.promo_type > b.promo_type ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setPromos(promos.sort((a, b) => a.promo_type > b.promo_type ? 1 : -1));
                    setSortASC(true);
                }
                break;
        }
        setSortType(type);
        setPageNumber(0);

    }

    const getPromos = () => {

        setLoading(true);

        var promos_ = [];

        props.firebase.promos().get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    promos_.push({ id: doc.id, ...doc.data() });
                });
                console.log("Promos Received-----", promos_);

                setPromos(promos_);
                setLoading(false);
            });
    }

    const getEligibleTiers = (tiers) => {

        let eligible = [];

        Object.keys(tiers).forEach(key => {
            if (tiers[key]) {
                eligible.push(key);
            }
        });

        return eligible.length === 4 ? "All" : eligible.join();

    }

    const getPromoTypeString = (type) => {

        switch (type) {
            case 0:
                return "Fixed Discount";
            case 1:
                return "% Off";
            case 2:
                return "Free Period";
        }

    }

    const deletePromo = (id) => {
        setLoading(true);
        props.firebase.promo(id)
            .delete().then(() => {
                console.log("Document successfully deleted!");
                getPromos();
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
    };

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="promos" page="all" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Promo List</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="card-panel">
                                <div className="d-flex justify-content-between align-items-center pb-3 border-new">
                                    <div className="Customers-title" style={{ textTransform: "uppercase" }}>Promo List</div>
                                    <div><a className="btn bg-col btn-new btn-fill" href="/promos/new"> Add Promo </a></div>
                                </div>

                                <div className="row mb-4 justify-content-between">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-5">
                                                <a href="#" className="btn btn-filter">Filter</a>
                                            </div>
                                            <div className="col-sm-7">
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-5">
                                        <PerPageSelect
                                            title="Promotions Per Page"
                                            perpage={perpage}
                                            handlePerPage={handlePerPage}
                                        />
                                    </div>
                                </div>
                                <table className="table table-2 table-3">
                                    <tbody>
                                        <tr>
                                            <th className="text-left cursor-pointer" onClick={() => sort("code")}>Code <i className="fa fa-sort" aria-hidden="true"></i></th>
                                            <th className="text-left cursor-pointer" onClick={() => sort("type")}>Promo Type <i className="fa fa-sort" aria-hidden="true"></i></th>
                                            <th>Promo<br />Amount</th>
                                            <th>Promo<br />Length</th>
                                            <th>Eligible<br />Tiers</th>
                                            <th>Usage/<br />Limit</th>
                                            <th>Created</th>
                                            <th>Expires</th>
                                            <th>Report</th>
                                            <th>Actions</th>
                                        </tr>
                                        {promos !== [] && promos.slice(pagenumber * perpage, (pagenumber + 1) * pagenumber > promos.length - 1 ? promos.length : (pagenumber + 1) * perpage).map(promo => (
                                            <tr key={promo.id}>
                                                <td>{promo.code}</td>
                                                <td>{getPromoTypeString(promo.promo_type)}</td>
                                                <td className="text-center">{promo.discount_amount}{promo.promo_type === 1 && "%"}{promo.promo_type === 0 && "$"}</td>
                                                <td className="text-center">{promo.duration}{promo.date_type === 0 ? "days" : "months"}</td>
                                                <td className="text-center">{getEligibleTiers(promo.promo_tiers)}</td>
                                                {/* <td className="text-center">{promo.usage}/{promo.limit}</td> */}
                                                <td className="text-center">0/{promo.limit_coupon}</td>
                                                <td className="text-center">{promo.created}</td>
                                                <td className="text-center">{promo.expiration !== "" ? promo.expiration : "Never"}</td>
                                                <td className="text-center">
                                                    <a href="#"><img src={reporticon} alt="report-icon" /></a>
                                                </td>
                                                <td className="text-center">
                                                    <a href={"/promos/edit/" + promo.id}><img src={editicon_new} alt="edit-icon-new" /></a>
                                                    <a className="cursor-pointer" onClick={() => deletePromo(promo.id)}><img src={deleteicon} alt="delete-icon" /></a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination
                                    items={promos}
                                    pagenumber={pagenumber}
                                    perpage={perpage}
                                    setPageNumber={setPageNumber}
                                />
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

export default compose(withFirebase, withAuthorization(condition))(PromosList);
