import React, { useState, useEffect } from 'react'

import plus from '../../../images/plus.png';
import LeftSideBar from '../../../layouts/LeftSideBar';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import LoadingLayout from '../../../layouts/LoadingLayout';
import PerPageSelect from '../../../components/PerPageSelect';
import Pagination from '../../../components/Pagination';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import _ from 'lodash';
import { USERTYPE } from '../../../constants/usertypes';

const PartnersList = (props) => {

    const [loading, setLoading] = useState(true);

    const [partners, setPartners] = useState([]);
    const [partners_show, setPartnersShow] = useState([]);

    const [pagenumber, setPageNumber] = useState(0);
    const [perpage, setPerPage] = useState(5);

    const [sortasc, setSortASC] = useState(true);
    const [sorttype, setSortType] = useState("company");
    const [searchtext, setSearchText] = useState("");

    useEffect(() => {
        getPartners();
    }, []);

    useEffect(() => {

        setPartnersShow(partners.filter(x =>
            x.contact_first_name.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1 ||
            x.contact_last_name.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1 ||
            x.country.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1 ||
            x.organization_name.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1));

    }, [searchtext]);

    const getPartners = () => {

        setLoading(true);

        var partners_ = [];

        props.firebase.partners().get()
            .then(async (querySnapshot) => {

                console.log(querySnapshot.size);

                let index = 0;

                if(querySnapshot.size === 0) {
                    setLoading(false);
                }

                await querySnapshot.forEach(async (doc) => {
                    let customers = await getCustomersByPartnerId(doc.id);
                    if (customers) {
                        partners_.push({ id: doc.id, customers: customers, ...doc.data() });
                    }

                    index++;

                    if (index === querySnapshot.size) {

                        setPartners(_.cloneDeep(partners_));
                        setPartnersShow(_.cloneDeep(partners_));
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

    const handlePerPage = e => {
        setPerPage(e.target.value);
        setPageNumber(0);
    }

    const sort = (type) => {
        switch (type) {
            case "company":
                if (type === sorttype) {
                    if (sortasc) {
                        setPartners(partners_show.sort((a, b) => b.organization_name > a.organization_name ? 1 : -1));

                    } else {
                        setPartners(partners_show.sort((a, b) => a.organization_name > b.organization_name ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setPartners(partners_show.sort((a, b) => a.organization_name > b.organization_name ? 1 : -1));
                    setSortASC(true);
                }
                break;
            case "contact":
                if (type === sorttype) {
                    if (sortasc) {
                        setPartners(partners_show.sort((a, b) => b.id > a.id ? 1 : -1));

                    } else {
                        setPartners(partners_show.sort((a, b) => a.id > b.id ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setPartners(partners_show.sort((a, b) => a.id > b.id ? 1 : -1));
                    setSortASC(true);
                }
                break;
        }
        setSortType(type);
        setPageNumber(0);

    }
    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="partners" page="all" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Partners</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="card-panel">
                                <div className="d-flex justify-content-between align-items-center pb-3 border-new">
                                    <div className="Customers-title">Partners List</div>
                                    <div><a className="btn bg-col btn-new btn-fill" href="/partners/new"> Add Partner </a></div>
                                </div>

                                <div className="row mb-4 justify-content-between">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-7">
                                                <div className="grip2">
                                                    <input type="text" className="input-box2" placeholder="Search" value={searchtext} onChange={e => setSearchText(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-5">
                                        <PerPageSelect
                                            title="Partners Per Page"
                                            perpage={perpage}
                                            handlePerPage={handlePerPage}
                                        />
                                    </div>

                                </div>
                                <table className="table table-2 table-3">
                                    <tbody>
                                        <tr>
                                            <th className="text-left cursor-pointer" onClick={() => sort("company")}>Company <i className="fa fa-sort" aria-hidden="true"></i></th>
                                            <th className="text-left cursor-pointer" onClick={() => sort("contact")}>Contact <i className="fa fa-sort" aria-hidden="true"></i></th>
                                            <th># of clients</th>
                                            <th>Total Revenue <br />Generated</th>
                                            <th>Revenue Trend</th>
                                            <th>Edit</th>
                                        </tr>
                                        {partners_show !== [] && partners_show.slice(pagenumber * perpage, (pagenumber + 1) * pagenumber > partners_show.length - 1 ? partners_show.length : (pagenumber + 1) * perpage).map(partner => (
                                            <tr key={partner.id}>
                                                <td>
                                                    <div className="flag">
                                                        {partner.organization_name}
                                                    </div>
                                                </td>
                                                <td>{partner.contact_first_name + " " + partner.contact_last_name}</td>
                                                <td className="text-center">{partner.customers.length}</td>
                                                <td className="text-center">$10,000</td>
                                                <td className="text-center">
                                                    <img src={plus} alt="plus" />
                                                </td>
                                                <td className="text-center">
                                                    <a className="btn btn-info btn-new btn-fill btn-round bg-yellow" href={"/partners/edit/" + partner.id}>
                                                        Edit
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination
                                    items={partners_show}
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

const condition = authUser => !!authUser && Number(authUser.user_type_id) === USERTYPE.SUPERADMIN;

export default compose(withFirebase, withAuthorization(condition))(PartnersList);