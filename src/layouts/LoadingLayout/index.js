import React from 'react'
import LoadingOverlay from 'react-loading-overlay';
import { BeatLoader } from 'react-spinners';

const LoadingLayout = (props) => {
    return (
        <LoadingOverlay
            active={props.loading}
            spinner={<BeatLoader color={"white"} size={20} />}
            className="w-full h-full"
            styles={{
                overlay: (base) => ({
                    ...base,
                    background: '#745fd1'
                }),
            }}
        >
            <section className="dashboard__wrapper d-flex">
                {props.loading ?
                    <div style={{ widows: "100%", height: "100vh" }}></div>
                    :
                    <>
                        {props.children}
                    </>
                }
            </section>
        </LoadingOverlay>
    )
}

export default LoadingLayout;