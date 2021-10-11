import React from 'react'

const Pagination = (props) => {

    const previous = () => {
        props.setPageNumber(props.pagenumber !== 0 ? props.pagenumber - 1 : 0);
    }

    const next = () => {
        props.setPageNumber((props.pagenumber + 1) * props.perpage > props.items.length ? props.pagenumber : props.pagenumber + 1);
    }

    return (
        <nav className="text-right">
            <ul className="pagination pagination-lg page">
                <li className="page-item cursor-pointer">
                    <a className="page-link" onClick={previous}>
                        <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                    </a>
                </li>
                {props.items !== [] &&
                    [...Array(Math.ceil(props.items.length / props.perpage))].map((e, index) => <li key={index} className="page-item cursor-pointer"><a className={props.pagenumber === index ? `page-link active` : `page-link`} onClick={() => props.setPageNumber(index)}>{index + 1}</a></li>)
                }
                <li className="page-item cursor-pointer">
                    <a className="page-link" onClick={next}>
                        <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination;