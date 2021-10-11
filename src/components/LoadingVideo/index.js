import React, { useState } from 'react'

const LoadingVideo = (props) => {

    const [loading, setLoading] = useState(true);

    return (
        <div>
            {loading &&
                <p className="w-full py-5 text-center">
                    Loading...
            </p>
            }
            <video controls controlsList="nodownload" onLoadedData={() => setLoading(false)} style={{ display: loading ? "none" : "block" }}>
                <source src={props.src} type={"video/" + props.extension}  />
            </video>
        </div>
    )
}

export default LoadingVideo;