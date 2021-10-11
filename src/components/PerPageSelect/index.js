import React from 'react'

const PerPageSelect = (props) => {
    return (
        <ul className="d-flex new-class justify-content-between align-items-center">
            <li>Displaying</li>
            <li className="optn">
                <select className="form-control" value={props.perpage} onChange={e => props.handlePerPage(e)}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </li>
            <li>{props.title}</li>
        </ul>
    )
}

export default PerPageSelect;