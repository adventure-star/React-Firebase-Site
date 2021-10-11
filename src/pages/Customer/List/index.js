import React, { useState, useEffect } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import LoadingLayout from '../../../layouts/LoadingLayout';
import Pagination from '../../../components/Pagination';
import PerPageSelect from '../../../components/PerPageSelect';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';

import { organizationtypes } from '../../../constants/organizationtypes'
import { USERTYPE } from '../../../constants/usertypes';
import { PRICING } from '../../../constants/pricingtiers';

const CustomersList = (props) => {

    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customers_show, setCustomersShow] = useState([]);

    const [pagenumber, setPageNumber] = useState(0);
    const [perpage, setPerPage] = useState(5);

    const [sortasc, setSortASC] = useState(true);
    const [sorttype, setSortType] = useState("client");

    const [search1, setSearch1] = useState("0");
    const [searchtext, setSearchText] = useState("");
    const [packagetier, setPackageTier] = useState("");
    const [organizationtype, setOrganizationType] = useState("");

    const SEARCHTYPE = {
        TEXT: 0,
        PRICINGTIER: 1,
        ORGANIZATIONTYPE: 2
    };


    useEffect(() => {
        getCustomers();
    }, []);


    useEffect(() => {
        setCustomerShowBySearchText();
    }, [searchtext]);

    useEffect(() => {
        setCusomterShowByOrganizationType();
    }, [organizationtype]);

    useEffect(() => {
        setCustomerShowByPricingTier();
    }, [packagetier]);

    useEffect(() => {

        switch (Number(search1)) {
            case SEARCHTYPE.TEXT:
                setCustomerShowBySearchText();
                break;
            case SEARCHTYPE.PRICINGTIER:
                setCustomerShowByPricingTier();
                break;
            case SEARCHTYPE.ORGANIZATIONTYPE:
                setCusomterShowByOrganizationType();
                break;
        }

    }, [search1]);

    const setCustomerShowBySearchText = () => {
        setCustomersShow(customers.filter(x =>
            x.contact_first_name.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1 ||
            x.contact_last_name.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1 ||
            x.package_tier.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1 ||
            x.organization_name.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1));
    }

    const setCusomterShowByOrganizationType = () => {
        setCustomersShow(customers.filter(x => x.organization_type_main === organizationtype));
    }

    const setCustomerShowByPricingTier = () => {
        setCustomersShow(customers);
    }

    const getCustomers = () => {

        setLoading(true);

        var data = JSON.parse(localStorage.getItem("authUser"));

        if (data) {

            let usertype = Number(data.user_type_id);

            console.log("usertype-----", usertype);

            var customers_ = [];

            if (usertype === USERTYPE.SUPERADMIN) {
                props.firebase.customers().get()
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
                                setCustomersShow(customers_modified);

                                setLoading(false);
                            });
                    })
            } else {
                props.firebase.customers().where("partner", "==", data.uid).get()
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
                                setCustomersShow(customers_modified);

                                setLoading(false);
                            });
                    })
            }
        }

    }

    const handlePerPage = e => {
        setPerPage(e.target.value);
        setPageNumber(0);
    }

    const sort = (type) => {
        console.log("sort-----", type);
        switch (type) {
            case "client":
                if (type === sorttype) {
                    if (sortasc) {
                        setCustomers(customers_show.sort((a, b) => b.organization_name > a.organization_name ? 1 : -1));

                    } else {
                        setCustomers(customers_show.sort((a, b) => a.organization_name > b.organization_name ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setCustomers(customers_show.sort((a, b) => a.organization_name > b.organization_name ? 1 : -1));
                    setSortASC(true);
                }
                break;
            case "contact":
                if (type === sorttype) {
                    if (sortasc) {
                        setCustomers(customers_show.sort((a, b) => b.id > a.id ? 1 : -1));

                    } else {
                        setCustomers(customers_show.sort((a, b) => a.id > b.id ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setCustomers(customers_show.sort((a, b) => a.id > b.id ? 1 : -1));
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
                    <LeftSideBar active="customers" page="all" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Customers</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="card-panel">
                                <div className="d-flex justify-content-between align-items-center pb-3 border-new">
                                    <div className="Customers-title">Customers</div>
                                    <div><a href="/customers/new" className="btn bg-col btn-new btn-fill"> Add Customer </a></div>
                                </div>

                                <div className="row mb-4 justify-content-between">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-7">
                                                <div className="grip">
                                                    <select className="form-control" value={search1} onChange={e => setSearch1(e.target.value)}>
                                                        <option value={0}>Search All</option>
                                                        <option value={1}>Package Tier</option>
                                                        <option value={2}>Organization Type</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-5">
                                                <div className="grip2">
                                                    {search1 === "0" &&
                                                        <input type="search" className="input-box2 form-control" placeholder="Search" value={searchtext} onChange={e => setSearchText(e.target.value)} />
                                                    }
                                                    {search1 === "1" &&
                                                        <select className="input-box2 form-control" value={packagetier} onChange={e => setPackageTier(e.target.value)} >
                                                            <option>Professional</option>
                                                            <option>Classroom</option>
                                                            <option>Team</option>
                                                            <option>Enterprise</option>
                                                        </select>
                                                    }
                                                    {search1 === "2" &&
                                                        <select className="input-box2 form-control" value={organizationtype} onChange={e => setOrganizationType(e.target.value)}>
                                                            {organizationtypes.filter(obj => { return obj.parent === 0 }).map(item => (
                                                                <option key={item.id} value={item.id}>{item.type}</option>
                                                            ))}
                                                        </select>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-5">
                                        <PerPageSelect
                                            title="Customers Per Page"
                                            perpage={perpage}
                                            handlePerPage={handlePerPage}
                                        />
                                    </div>

                                </div>

                                <table className="table table-2">
                                    <tbody>
                                        <tr>
                                            <th className="text-left cursor-pointer" onClick={() => sort("client")}>Client Name <i className="fa fa-sort" aria-hidden="true"></i></th>
                                            <th className="text-left cursor-pointer" onClick={() => sort("contact")}>Account Contact <i className="fa fa-sort" aria-hidden="true"></i></th>
                                            <th>Account Type</th>
                                            <th># of Users</th>
                                            <th>Status</th>
                                            <th>Edit</th>
                                        </tr>
                                        {customers_show !== [] && customers_show.slice(pagenumber * perpage, (pagenumber + 1) * pagenumber > customers_show.length - 1 ? customers_show.length : (pagenumber + 1) * perpage).map(customer => (
                                            <tr key={customer.id}>
                                                <td>
                                                    <div className="flag">
                                                        {customer.organization_name}
                                                    </div>
                                                </td>
                                                <td>{customer.contact_first_name + " " + customer.contact_last_name}</td>
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
                                                        <a className="btn btn-info btn-new btn-fill btn-round bg-blue" href="#">Active</a>
                                                    }
                                                    {customer.status === 0 &&
                                                        <a className="btn btn-info btn-new btn-fill btn-round bg-blue inactive" href="#">Inactive</a>
                                                    }
                                                </td>
                                                <td className="text-center">
                                                    <a className="btn btn-info btn-new btn-fill btn-round bg-yellow" href={"/customers/edit/" + customer.id}>Edit</a>
                                                </td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                </table>
                                <Pagination
                                    items={customers_show}
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

const condition = authUser => !!authUser && (Number(authUser.user_type_id) === USERTYPE.SUPERADMIN || Number(authUser.user_type_id) === USERTYPE.PARTNER);

export default compose(withFirebase, withAuthorization(condition))(CustomersList);