import React from 'react'
import profile from '../../images/profile.png';
import SignOut from '../SignOut';


const TopRight = (props) => {
    return (
        <div className="d-flex align-items-center justify-content-between">
            <div className="custom__form-2">
                <form className="">
                    <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn__search" type="submit"><i className="fa fas fa-search"></i></button>
                </form>
            </div>
            <a href="#" className="notification"><i className="fa far fa-bell"></i></a>
            <a href="#" className="profile"><img src={profile} alt="profile" /></a>
            <SignOut onClick={() => props.setLoading(true)} />
        </div>
    )
}

export default TopRight;