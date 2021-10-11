import React, { useState, useEffect } from 'react'

import LeftSideBar from '../../../layouts/LeftSideBar';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import LoadingLayout from '../../../layouts/LoadingLayout';
import PerPageSelect from '../../../components/PerPageSelect';
import Pagination from '../../../components/Pagination';
import CopyrightBrand from '../../../components/CopyrightBrand';
import TopRight from '../../../components/TopRight';
import { USERTYPE } from '../../../constants/usertypes';

const EditorsList = (props) => {

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [list_show, setListShow] = useState([]);

    const [pagenumber, setPageNumber] = useState(0);
    const [perpage, setPerPage] = useState(5);

    const [sortasc, setSortASC] = useState(true);
    const [sorttype, setSortType] = useState("company");
    const [searchtext, setSearchText] = useState("");

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {

        setListShow(list.filter(x =>
            x.contact_first_name.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1 ||
            x.contact_last_name.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1));

    }, [searchtext]);

    const getList = () => {

        let customerid = "";

        var data = JSON.parse(localStorage.getItem("authUser"));
        if (data) {
            customerid = data.uid;
        }

        var list_ = [];

        props.firebase.editors().where("customer_id", "==", customerid).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    list_.push({ id: doc.id, ...doc.data() });
                });
                console.log("Received-----", list_);

                return list_;

            })
            .then(list => {

                let users_ = [];

                props.firebase.appusers().get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            users_.push({ id: doc.id, ...doc.data() });
                        });

                        return users_;

                    })
                    .then(users => {

                        let list_modified = list.map(item => {
                            let editorusers_ = [];
                            users.forEach(user => {
                                if (user.editor_id === item.id) {
                                    editorusers_.push(user);
                                }
                            });
                            return Object.assign({}, item, { users: editorusers_ });
                        });

                        console.log("list_modified-----", list_modified);

                        setList(list_modified);
                        setListShow(list_modified);
                        setLoading(false);

                    })

            });

    }

    const handlePerPage = e => {
        setPerPage(e.target.value);
        setPageNumber(0);
    }

    const sort = (type) => {
        switch (type) {
            case "client":
                if (type === sorttype) {
                    if (sortasc) {
                        setList(list_show.sort((a, b) => b.id > a.id ? 1 : -1));

                    } else {
                        setList(list_show.sort((a, b) => a.id > b.id ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setList(list_show.sort((a, b) => a.id > b.id ? 1 : -1));
                    setSortASC(true);
                }
                break;
            case "contact":
                if (type === sorttype) {
                    if (sortasc) {
                        setList(list_show.sort((a, b) => b.contact_first_name > a.contact_first_name ? 1 : -1));

                    } else {
                        setList(list_show.sort((a, b) => a.contact_first_name > b.contact_first_name ? 1 : -1));

                    }
                    setSortASC(!sortasc);
                } else {
                    setList(list_show.sort((a, b) => a.contact_first_name > b.contact_first_name ? 1 : -1));
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
                    <LeftSideBar active="editors" page="all" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Home</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Editors</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="card-panel">
                                <div className="d-flex justify-content-between align-items-center pb-3 border-new">
                                    <div className="Customers-title">Editors</div>
                                    <div><a href="/editors/new" className="btn bg-col btn-new btn-fill"> Add Editor </a></div>
                                </div>

                                <div className="row mb-4 justify-content-between">
                                    <div className="col-sm-6">
                                        <div className="row">
                                            <div className="col-sm-7">
                                                <div className="grip2">
                                                    <input type="search" className="input-box2 form-control" placeholder="Search" value={searchtext} onChange={e => setSearchText(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-5">
                                        <PerPageSelect
                                            title="Editors Per Page"
                                            perpage={perpage}
                                            handlePerPage={handlePerPage}
                                        />
                                    </div>

                                </div>

                                <table className="table table-2">
                                    <tbody>
                                        <tr>
                                            <th className="text-left cursor-pointer" onClick={() => sort("contact")}>Name<i className="fa fa-sort" aria-hidden="true"></i></th>
                                            <th># of Users</th>
                                            <th>Status</th>
                                            <th>Edit</th>
                                        </tr>
                                        {list_show !== null && list_show.slice(pagenumber * perpage, (pagenumber + 1) * pagenumber > list_show.length - 1 ? list_show.length : (pagenumber + 1) * perpage).map(item => (
                                            <tr key={item.id}>
                                                <td>{item.contact_first_name + " " + item.contact_last_name}</td>
                                                <td className="text-center">{item.users.length}</td>
                                                <td className="text-center">
                                                    {item.status === 1 &&
                                                        <a className="btn btn-info btn-new btn-fill btn-round bg-blue" href="#">Active</a>
                                                    }
                                                    {item.status === 0 &&
                                                        <a className="btn btn-info btn-new btn-fill btn-round bg-blue inactive" href="#">Inactive</a>
                                                    }
                                                </td>
                                                <td className="text-center">
                                                    <a className="btn btn-info btn-new btn-fill btn-round bg-yellow" href={"/editors/edit/" + item.id}>Edit</a>
                                                </td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                </table>

                                <Pagination
                                    items={list_show}
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

const condition = authUser => !!authUser && Number(authUser.user_type_id) === USERTYPE.CUSTOMER;

export default compose(withFirebase, withAuthorization(condition))(EditorsList);