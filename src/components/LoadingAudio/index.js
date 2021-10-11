import React, { useState } from 'react'

const LoadingAudio = (props) => {

    const [loading, setLoading] = useState(true);

    return (
        <div className={loading ? `` : `py-5`}>
            {loading &&
                <p className="w-full py-5 text-center">
                    Loading...
            </p>
            }
            <audio controls controlsList="nodownload" onLoadedData={() => setLoading(false)} style={{ display: loading ? "none" : "block" }}>
                <source src={props.src} type={"audio/" + props.extension}  />
            </audio>
        </div>
    )
}

export default LoadingAudio;