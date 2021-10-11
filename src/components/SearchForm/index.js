import React from 'react'

const SearchForm = () => {
    return (
        <div className="custom__form">
            <form className="">
                <input className="form-control" type="search" placeholder="Search here..." aria-label="Search" />
                <button className="btn__search" type="submit"><i className="fa fas fa-search"></i></button>
            </form>
        </div>
    )
}

export default SearchForm;