import React, { useState, useEffect } from 'react'
import { Collapse } from 'react-collapse';

import logo2 from '../../images/logo-2.png';
import dashboard from '../../images/dashboard.png';
import thumballs from '../../images/thumballs.png';
import customers from '../../images/customers.png';
import chat from '../../images/chat.png';
import notification from '../../images/notification.png';
import accounting from '../../images/accounting.png';
import badge from '../../images/badge.png';

import arrow from '../../images/arrow.png';
import { USERTYPE } from '../../constants/usertypes';

const LeftSideBar = (props) => {

    const [usertype, setUserType] = useState(0);
    const [capability, setCapability] = useState({});

    useEffect(() => {

        var data = JSON.parse(localStorage.getItem("authUser"));
        if (data) {
            setUserType(Number(data.user_type_id));
            setCapability(data.capability);
        }

    }, []);

    const [partneritems, setPartnerItems] = useState(props.active === "partners");
    const [messageitems, setMessageItems] = useState(props.active === "messages");
    const [analyticsitems, setAnalyticsItems] = useState(props.active === "analytics");
    const [customeritems, setCustomerItems] = useState(props.active === "customers");
    const [editoritems, setEditorItems] = useState(props.active === "editors");
    const [useritems, setUserItems] = useState(props.active === "users");
    const [groupitems, setGroupItems] = useState(props.active === "groups");
    const [thumballitems, setThumballItems] = useState(props.active === "thumballs");
    // const [promoitems, setPromoItems] = useState(props.active === "promos");
    const [notificationitems, setNotificationItems] = useState(props.active === "notifications");
    const [accountingitems, setAccountingItems] = useState(props.active === "accounting");

    const submenuItems = {
        thumball: {
            all: [
                { path: "/thumballs/all", name: "View Thumballs", key: "all" },
                { path: "/thumballs/new", name: "Add New Thumball", key: "new" },
                { path: "/thumballs/asset-library", name: "Asset Library", key: "asset-library" },
            ],
            assign: [
                { path: "/thumballs/assign", name: "Assign A Thumball", key: "assign" },
                { path: "/thumballs/build-thumbtrack", name: "Build A Thumbtrack", key: "thumbtrack" },
            ]
        },
        partner: [
            { path: "/partners/all", name: "View Partners", key: "all" },
            { path: "/partners/new", name: "Add New Partner", key: "new" },
        ],
        customer: [
            { path: "/customers/all", name: "View Customers", key: "all" },
            { path: "/customers/new", name: "Add New Customer", key: "new" },
        ],
        editor: [
            { path: "/editors/all", name: "View Editors", key: "all" },
            { path: "/editors/new", name: "Add New Editor", key: "new" },
        ],
        user: [
            { path: "/users/all", name: "View Users", key: "all" },
            { path: "/users/new", name: "Add New User", key: "new" },
        ],
        // promo: [
        //     { path: "/promos/all", name: "View Promos", key: "all" },
        //     { path: "/promos/new", name: "Add New Promo", key: "new" },
        // ],
        group: [
            { path: "/groups/all", name: "View Groups", key: "all" },
            { path: "/groups/new", name: "Add New Group", key: "new" },
        ],
        analytics: [
            { path: "/analytics/individual", name: "Analytics Individual", key: "analytics" },
        ],
        message: [
            { path: "/messages/all", name: "Messages", key: "all" },
            { path: "/messages/new", name: "Compose Message", key: "new" },
        ],
        notification: [
            { path: "/notifications/new", name: "Add New Notifications", key: "all" },
            { path: "/notifications/add-segment", name: "Add New Segment", key: "segment" },
        ],
        account: [
            { path: "/my-account", name: "My Account", key: "account" },
            { path: "/subscription/cancel", name: "Subscription Cancel", key: "subscription" },
            { path: "/update-card", name: "Update Card", key: "card" },
        ],
    }

    return (
        <>
            <div className="logo__wrapper">
                <a href="/"><img src={logo2} alt="logo2" /></a>
            </div>
            <div className="menu__wrapper">
                <ul>
                    <li>
                        <a href="/" className={props.active === "dashboard" ? "active" : ""}><img src={dashboard} alt="dashboard" />Dashboard</a>
                    </li>
                    <li className="dropdown">
                        <a onClick={() => { setThumballItems(!thumballitems) }} className={thumballitems ? `active` : ``}>
                            <img src={thumballs} alt="thumballs" />
                            Thumballs
                            <img className={thumballitems ? `arrow rotate-180deg` : `arrow`} src={arrow} alt="arrow" />
                        </a>
                        <Collapse isOpened={thumballitems}>
                            <div className="submenu" id="thumball">
                                {!(usertype === USERTYPE.EDITOR && !capability.thumball) ?
                                    submenuItems.thumball.all.map((item, index) => (
                                        <a href={item.path} key={index} className={(props.page === item.key && props.active === "thumballs") ? "active" : ""}>{item.name}</a>
                                    ))
                                    :
                                    submenuItems.thumball.all.splice(0, 1).map((item, index) => (
                                        <a href={item.path} key={index} className={(props.page === item.key && props.active === "thumballs") ? "active" : ""}>{item.name}</a>
                                    ))
                                }
                                {(usertype === USERTYPE.CUSTOMER || usertype === USERTYPE.EDITOR) && submenuItems.thumball.assign.map((item, index) => (
                                    <a href={item.path} key={index} className={(props.page === item.key && props.active === "thumballs") ? "active" : ""}>{item.name}</a>
                                ))}
                            </div>
                        </Collapse>
                    </li>
                    {usertype === USERTYPE.SUPERADMIN &&
                        <li className="dropdown">
                            <a onClick={() => { setPartnerItems(!partneritems) }} className={partneritems ? "active" : ""}>
                                <img src={customers} alt="customers" />
                        Partners
                        <img className={partneritems ? `arrow rotate-180deg` : `arrow`} src={arrow} alt="arrow" />
                            </a>
                            <Collapse isOpened={partneritems}>
                                <div className="submenu" id="partner">
                                    {submenuItems.partner.map((item, index) => {
                                        return (
                                            <a href={item.path} key={index} className={(props.page === item.key && props.active === "partners") ? "active" : ""}>{item.name}</a>
                                        )
                                    })}
                                </div>
                            </Collapse>
                        </li>
                    }
                    {(usertype === USERTYPE.SUPERADMIN || usertype === USERTYPE.PARTNER) &&
                        <li className="dropdown">
                            <a onClick={() => { setCustomerItems(!customeritems) }} className={customeritems ? "active" : ""}>
                                <img src={customers} alt="chat" />
                        Customers
                        <img className={customeritems ? `arrow rotate-180deg` : `arrow`} src={arrow} alt="arrow" />
                            </a>
                            <Collapse isOpened={customeritems}>
                                <div className="submenu" id="customer">
                                    {submenuItems.customer.map((item, index) => {
                                        return (
                                            <a href={item.path} key={index} className={(props.page === item.key && props.active === "customers") ? "active" : ""}>{item.name}</a>
                                        )
                                    })}
                                </div>
                            </Collapse>
                        </li>
                    }
                    {usertype === USERTYPE.CUSTOMER &&
                        <li className="dropdown">
                            <a onClick={() => { setEditorItems(!editoritems) }} className={editoritems ? "active" : ""}>
                                <img src={customers} alt="chat" />
                        Editors
                        <img className={editoritems ? `arrow rotate-180deg` : `arrow`} src={arrow} alt="arrow" />
                            </a>
                            <Collapse isOpened={editoritems}>
                                <div className="submenu" id="customer">
                                    {submenuItems.editor.map((item, index) => {
                                        return (
                                            <a href={item.path} key={index} className={(props.page === item.key && props.active === "editors") ? "active" : ""}>{item.name}</a>
                                        )
                                    })}
                                </div>
                            </Collapse>
                        </li>
                    }
                    {(usertype === USERTYPE.CUSTOMER || usertype === USERTYPE.EDITOR) &&
                        <>
                            <li className="dropdown">
                                <a onClick={() => { setGroupItems(!groupitems) }} className={groupitems ? "active" : ""}>
                                    <img src={customers} alt="chat" />
                                    Groups
                            <img className={groupitems ? `arrow rotate-180deg` : `arrow`} src={arrow} alt="arrow" />
                                </a>
                                <Collapse isOpened={groupitems}>
                                    <div className="submenu" id="groups">
                                        {!(usertype === USERTYPE.EDITOR && !capability.group) ?
                                            submenuItems.group.map((item, index) => (
                                                <a href={item.path} key={index} className={(props.page === item.key && props.active === "groups") ? "active" : ""}>{item.name}</a>
                                            ))
                                            :
                                            submenuItems.group.splice(0, 1).map((item, index) => (
                                                <a href={item.path} key={index} className={(props.page === item.key && props.active === "groups") ? "active" : ""}>{item.name}</a>
                                            ))
                                        }
                                    </div>
                                </Collapse>
                            </li>
                            {!(usertype === USERTYPE.EDITOR && !capability.user) &&
                                <li className="dropdown">
                                    <a onClick={() => { setUserItems(!useritems) }} className={useritems ? "active" : ""}>
                                        <img src={customers} alt="chat" />
                                    Users
                            <img className={useritems ? `arrow rotate-180deg` : `arrow`} src={arrow} alt="arrow" />
                                    </a>
                                    <Collapse isOpened={useritems}>
                                        <div className="submenu" id="customer">
                                            {!(usertype === USERTYPE.EDITOR && !capability.user) ?
                                                submenuItems.user.map((item, index) => (
                                                    <a href={item.path} key={index} className={(props.page === item.key && props.active === "users") ? "active" : ""}>{item.name}</a>
                                                ))
                                                :
                                                submenuItems.user.splice(0, 1).map((item, index) => (
                                                    <a href={item.path} key={index} className={(props.page === item.key && props.active === "users") ? "active" : ""}>{item.name}</a>
                                                ))
                                            }
                                        </div>
                                    </Collapse>
                                </li>
                            }
                        </>
                    }
                    {/* <li className="dropdown">
                        <a onClick={() => { setPromoItems(!promoitems) }} className={promoitems ? "active" : ""}>
                            <img src={badge} alt="chat" />
                            Promos
                            <img className={promoitems ? `arrow rotate-180deg` : `arrow`} src={arrow} alt="arrow" />
                        </a>
                        <Collapse isOpened={promoitems}>
                            <div className="submenu" id="customer">
                                {submenuItems.promo.map((item, index) => {
                                    return (
                                        <a href={item.path} key={index} className={(props.page === item.key && props.active === "promos") ? "active" : ""}>{item.name}</a>
                                    )
                                })}
                            </div>
                        </Collapse>
                    </li> */}
                    {(usertype === USERTYPE.CUSTOMER || usertype === USERTYPE.EDITOR) &&
                        <li className="dropdown">
                            <a onClick={() => { setAnalyticsItems(!analyticsitems) }} className={analyticsitems ? "active" : ""}>
                                <img src={chat} alt="chat" />
                         Analytics
                         <img className={analyticsitems ? `arrow rotate-180deg` : `arrow`} src={arrow} alt="arrow" />
                            </a>
                            <Collapse isOpened={analyticsitems}>
                                <div className="submenu" id="demo">
                                    {submenuItems.analytics.map((item, index) => {
                                        return (
                                            <a href={item.path} key={index} className={(props.page === item.key && props.active === "analytics") ? "active" : ""}>{item.name}</a>
                                        )
                                    })}
                                </div>
                            </Collapse>
                        </li>
                    }
                    {!(usertype === USERTYPE.EDITOR && !capability.message) &&
                        <li className="dropdown">
                            <a onClick={() => { setMessageItems(!messageitems) }} className={messageitems ? "active" : ""}>
                                <img src={chat} alt="chat" />
                          Messages
                          <img className={messageitems ? `arrow rotate-180deg` : `arrow`} src={arrow} alt="arrow" />
                            </a>
                            <Collapse isOpened={messageitems}>
                                <div className="submenu" id="demo">
                                    {submenuItems.message.map((item, index) => {
                                        return (
                                            <a href={item.path} key={index} className={(props.page === item.key && props.active === "messages") ? "active" : ""}>{item.name}</a>
                                        )
                                    })}
                                </div>
                            </Collapse>
                        </li>
                    }
                    {!(usertype === USERTYPE.EDITOR && !capability.notification) &&
                        <li className="dropdown">
                            <a onClick={() => { setNotificationItems(!notificationitems) }} className={notificationitems ? "active" : ""}>
                                <img src={notification} alt="notifications" />
                        Notifications
                        <img className={notificationitems ? `arrow rotate-180deg` : `arrow`} src={arrow} alt="arrow" />
                            </a>
                            <Collapse isOpened={notificationitems}>
                                <div className="submenu" id="demo">
                                    {submenuItems.notification.map((item, index) => {
                                        return (
                                            <a href={item.path} key={index} className={(props.page === item.key && props.active === "notifications") ? "active" : ""}>{item.name}</a>
                                        )
                                    })}
                                </div>
                            </Collapse>
                        </li>
                    }
                    {usertype === USERTYPE.SUPERADMIN &&
                        <li className="dropdown">
                            <a onClick={() => { setAccountingItems(!accountingitems) }} className={accountingitems ? "active" : ""}>
                                <img src={accounting} alt="notifications" />
                          Accounting
                          <img className={accountingitems ? `arrow rotate-180deg` : `arrow`} src={arrow} alt="arrow" />
                            </a>
                            <Collapse isOpened={accountingitems}>
                                <div className="submenu" id="demo">
                                    {submenuItems.account.map((item, index) => {
                                        return (
                                            <a href={item.path} key={index} className={(props.page === item.key && props.active === "accounting") ? "active" : ""}>{item.name}</a>
                                        )
                                    })}
                                </div>
                            </Collapse>
                        </li>
                    }
                </ul>
                <a href="#" className="admin__link"><img src={accounting} alt="accounting" />Account Admin</a>
            </div>
        </>
    )
}

export default LeftSideBar;