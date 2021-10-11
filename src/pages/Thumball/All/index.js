import React, { useState, useEffect } from 'react'
import LeftSideBar from '../../../layouts/LeftSideBar';

import PerPageSelect from '../../../components/PerPageSelect';
import Pagination from '../../../components/Pagination';
import CopyrightBrand from '../../../components/CopyrightBrand';
import LoadingLayout from '../../../layouts/LoadingLayout';
import TopRight from '../../../components/TopRight';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';

const THUMBALLTYPE = {
    CLASSIC: 0,
    CHALLENGE: 1
}

const ThumballsList = (props) => {

    const [loading, setLoading] = useState(true);

    const [thumballs, setThumballs] = useState([]);

    const [pagenumber, setPageNumber] = useState(0);
    const [perpage, setPerPage] = useState(5);

    const [sortasc, setSortASC] = useState(true);
    const [sorttype, setSortType] = useState("title");

    useEffect(() => {
        getThumballs();
    }, []);

    const getThumballs = () => {

        let thumballs_ = [];

        props.firebase.thumballs().get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    thumballs_.push({ id: doc.id, ...doc.data() });
                });
                console.log("Thumballs Received-----", thumballs_);

                setThumballs(thumballs_);
                setLoading(false);
            });

    }

    const handlePerPage = e => {
        setPerPage(e.target.value);
        setPageNumber(0);
    }

    const sort = (type) => {
        switch (type) {
            case "title":
                if (type === sorttype) {
                    if (sortasc) {
                        setThumballs(thumballs.sort((a, b) => b.title > a.title ? 1 : -1));

                    } else {
                        setThumballs(thumballs.sort((a, b) => a.title > b.title ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setThumballs(thumballs.sort((a, b) => a.title > b.title ? 1 : -1));
                    setSortASC(true);
                }
                break;
            case "creator":
                if (type === sorttype) {
                    if (sortasc) {
                        setThumballs(thumballs.sort((a, b) => b.creator > a.creator ? 1 : -1));

                    } else {
                        setThumballs(thumballs.sort((a, b) => a.creator > b.creator ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setThumballs(thumballs.sort((a, b) => a.creator > b.creator ? 1 : -1));
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
                    <LeftSideBar active="thumballs" page="all" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Thumballs</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="card-panel">
                                <div className="d-flex justify-content-between align-items-center pb-3 border-new">
                                    <div className="Customers-title">Thumballs</div>
                                    <div><a href="/thumballs/new" className="btn bg-col btn-new btn-fill"> Add Thumball </a></div>
                                </div>

                                <div className="row mb-4 justify-content-between">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-5">
                                                <div className="grip2">
                                                    <input type="" className="input-box2" placeholder="Search" name="" />
                                                </div>
                                            </div>
                                            <div className="col-sm-7">
                                                <div className="gripd">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-5">
                                        <PerPageSelect
                                            title="Thumballs Per Page"
                                            perpage={perpage}
                                            handlePerPage={handlePerPage}
                                        />
                                    </div>

                                </div>

                                <table className="table table-2 table-3">
                                    <tbody>
                                        <tr>
                                            <th className="text-left cursor-pointer" onClick={() => sort("title")}>Title <i className="fa fa-sort" aria-hidden="true"></i></th>
                                            <th className="text-left cursor-pointer" onClick={() => sort("creator")}>Creator <i className="fa fa- qsort" aria-hidden="true"></i></th>
                                            <th>Type</th>
                                            <th># of Panels</th>
                                            <th>Status</th>
                                            <th>Price</th>
                                            <th>Edit</th>
                                        </tr>
                                        {thumballs !== [] && thumballs.slice(pagenumber * perpage, (pagenumber + 1) * pagenumber > thumballs.length - 1 ? thumballs.length : (pagenumber + 1) * perpage).map(thumball => (
                                            <tr key={thumball.id}>
                                                <td>
                                                    <div className="flag">
                                                        {thumball.title}
                                                    </div>
                                                </td>
                                                <td className="text-center">{thumball.author}</td>
                                                <td className="text-center">{thumball.type === THUMBALLTYPE.CHALLENGE ? "Challenge" : "Classic"}</td>
                                                <td className="text-center">{thumball.panel.length}</td>
                                                <td className="text-center">{thumball.status}</td>
                                                <td className="text-center">{thumball.price}</td>
                                                <td className="text-center">
                                                    <a className="btn btn-info btn-new btn-fill btn-round bg-yellow" href={"/thumballs/edit/" + thumball.id}>Edit</a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <Pagination
                                    items={thumballs}
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

export default compose(withFirebase, withAuthorization(condition))(ThumballsList);