import React, { useState } from 'react'

const LoadingImage = (props) => {

    const [loading, setLoading] = useState(true);

    return (
        <div className="w-full text-center">
            {loading &&
                <p className="w-full py-5 text-center">
                    Loading...
                </p>
            }
            <img src={props.src} alt={props.alt} onLoad={() => setLoading(false)} className="mx-auto" style={{ display: loading ? "none" : "block" }} />
        </div>
    )
}

export default LoadingImage;