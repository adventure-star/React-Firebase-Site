import React, { useState, useEffect, useRef } from 'react'

import cloud from '../../../images/cloud.png';
import LeftSideBar from '../../../layouts/LeftSideBar';
import CopyrightBrand from '../../../components/CopyrightBrand';
import LoadingLayout from '../../../layouts/LoadingLayout';
import TopRight from '../../../components/TopRight';
import Pagination from '../../../components/Pagination';
import { compose } from 'recompose';
import { withFirebase } from '../../../services/Firebase';
import { withAuthorization } from '../../../services/Session';
import _ from 'lodash';

import LoadingImage from '../../../components/LoadingImage';
import LoadingAudio from '../../../components/LoadingAudio';
import LoadingVideo from '../../../components/LoadingVideo';

const ASSETTYPE = {
    IMAGE: 0,
    AUDIO: 1,
    VIDEO: 2
};

const ThumballAssetLibrary = (props) => {

    const [loading, setLoading] = useState(true);

    const [type, setType] = useState(ASSETTYPE.IMAGE);

    const [pagenumber, setPageNumber] = useState(0);
    const [perpage, setPerPage] = useState(8);
    const [sorttype, setSortType] = useState("name");

    const [images, setImages] = useState([]);
    const [audios, setAudios] = useState([]);
    const [videos, setVideos] = useState([]);

    const ref = useRef(null);

    useEffect(() => {
        getImages();
        getAudios();
        getVideos();
    }, []);

    useEffect(() => {
        setPageNumber(0);
        setPerPage(8);
    }, [type]);

    const handleFile = (e) => {

        setLoading(true);

        const file = e.target.files[0]

        var type = file.type.substring(0, 5);

        console.log(type);

        if (type === "image" || type === "video" || type === "audio") {
            props.firebase.doUpload(file, type)
                .on('state_changed', function progress(snapshot) {
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    console.log("percentage-----", percentage);

                }, function error(err) {
                    console.log("storageerror----", err);
                }, function complete() {
                    console.log("--completed--");
                    getImages();

                    if (type === "image") {
                        getImages();
                    }
                    if (type === "video") {
                        getVideos();
                    }
                    if (type === "audio") {
                        getAudios();
                    }

                });
        }

    }

    const getImages = async () => {

        let res = await props.firebase.getImageList();
        console.log("res:::", res)
        if (!res.items) return;

        var images_ = [];

        // res.prefixes.forEach((folderRef) => {
        //     console.log("folderRef-----", folderRef);
        //     // All the prefixes under listRef.
        //     // You may call listAll() recursively on them.
        // });

        const promises = res.items.map(async (itemRef) => {
            let url = await itemRef.getDownloadURL()
            if (url) {
                var maxindex = images_.length !== 0 ? Math.max.apply(Math, images_.map(function (o) { return o.index; })) : -1;
                images_.push(
                    {
                        index: maxindex + 1,
                        src: url,
                        name: itemRef.name,
                        extension: itemRef.name.split(".")[itemRef.name.split(".").length - 1],
                        author: "Super Admin"
                    }
                );
            }
        });

        Promise.all(promises).then(() => {

            setImages(_.cloneDeep(images_));
            setPerPage(8);
            setPageNumber(0);

            setLoading(false);
        });

    }

    const getAudios = async () => {

        let res = await props.firebase.getSoundList();
        console.log("res:::", res)
        if (!res.items) return;

        var audios_ = [];

        const promises = res.items.map(async (itemRef) => {
            let url = await itemRef.getDownloadURL()
            if (url) {
                var maxindex = audios_.length !== 0 ? Math.max.apply(Math, audios_.map(function (o) { return o.index; })) : -1;
                audios_.push(
                    {
                        index: maxindex + 1,
                        src: url,
                        name: itemRef.name,
                        extension: itemRef.name.split(".")[itemRef.name.split(".").length - 1],
                        author: "Super Admin"
                    }
                );
            }

        });

        Promise.all(promises).then(() => {

            console.log("audios_-----", audios_);

            setAudios(_.cloneDeep(audios_));
            setPerPage(8);
            setPageNumber(0);

            setLoading(false);
        });

    }

    const getVideos = async () => {

        let res = await props.firebase.getVideoList();
        console.log("res:::", res)
        if (!res.items) return;

        var videos_ = [];

        const promises = res.items.map(async (itemRef) => {
            let url = await itemRef.getDownloadURL()
            if (url) {
                var maxindex = videos_.length !== 0 ? Math.max.apply(Math, videos_.map(function (o) { return o.index; })) : -1;
                videos_.push(
                    {
                        index: maxindex + 1,
                        src: url,
                        name: itemRef.name,
                        extension: itemRef.name.split(".")[itemRef.name.split(".").length - 1],
                        author: "Super Admin"
                    }
                );
            }
        });

        Promise.all(promises).then(() => {

            console.log("videos_-----", videos_);

            setVideos(_.cloneDeep(videos_));
            setPerPage(8);
            setPageNumber(0);

            setLoading(false);
        });

    }

    const handlePerpage = e => {
        setPerPage(e.target.value);
        setPageNumber(0);
    }

    const openFileUpload = () => {
        console.log(ref);
        ref.current.click();
    }

    return (
        <LoadingLayout loading={loading}>
            <>
                <div className="dashboard__menu">
                    <LeftSideBar active="thumballs" page="asset-library" />
                </div>
                <div className="dashboard__content">
                    <div className="ml-0">
                        <div className="row">
                            <div className="col-12">
                                <div className="dashboard__header">
                                    <ul className="breadcumb">
                                        <li><a href="/">Dashboard</a></li>
                                        <li><i className="fa fas fa-chevron-right"></i></li>
                                        <li className="active">Asset Library</li>
                                    </ul>
                                    <TopRight setLoading={setLoading} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="card-panel">
                                    <div className="d-flex justify-content-between align-items-center pb-3 border-new">
                                        <div className="Customers-title">THUMBALL ASSETS</div>
                                    </div>

                                    <div className="row mb-4 justify-content-between">
                                        <div className="col-sm-6">
                                            <div className="filter-area d-flex justify-content-between align-items-center">
                                                <ul>
                                                    <li className={type === 0 ? `active` : ``} onClick={() => setType(0)}><a className="cursor-pointer">Images</a></li>
                                                    <li className={type === 1 ? `active` : ``} onClick={() => setType(1)}><a className="cursor-pointer">Sounds</a></li>
                                                    <li className={type === 2 ? `active` : ``} onClick={() => setType(2)}><a className="cursor-pointer">Videos</a></li>
                                                </ul>
                                                <a className="btn bg-blue" href="#">Filter <i className="fa fas fa-filter"></i></a>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 text-right">
                                            <button className="btn upload" onClick={openFileUpload}>Upload <img src={cloud} alt="cloud" /></button>
                                            <input
                                                ref={ref}
                                                type="file"
                                                accept="image/*, audio/*, video/*"
                                                style={{ display: "none" }}
                                                onChange={e => handleFile(e)}
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-4 justify-content-between">
                                        <div className="col-sm-6">
                                            <div className="sort-by">
                                                <label>Sort By</label>
                                                <select className="form-control">
                                                    <option>Name</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-sm-5">
                                            <ul className="d-flex new-className justify-content-between align-items-center">
                                                <li>Displaying</li>
                                                <li className="optn">
                                                    <select className="form-control" value={perpage} onChange={e => handlePerpage(e)}>
                                                        <option value={4}>4</option>
                                                        <option value={8}>8</option>
                                                        <option value={16}>16</option>
                                                    </select>
                                                </li>
                                                {type === ASSETTYPE.IMAGE &&
                                                    <li>of {images.length} Images</li>
                                                }
                                                {type === ASSETTYPE.AUDIO &&
                                                    <li>of {audios.length} Audios</li>
                                                }
                                                {type === ASSETTYPE.VIDEO &&
                                                    <li>of {videos.length} Videos</li>
                                                }
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="row pb-5">
                                        {type === ASSETTYPE.IMAGE && images.length !== 0 && images.slice(pagenumber * perpage, (pagenumber + 1) * pagenumber > images.length - 1 ? images.length : (pagenumber + 1) * perpage).map((image) => {
                                            return (
                                                <div key={image.index} className="col-md-3">
                                                    <div className="asset-lib">
                                                        <div className="asset-hdr">
                                                            <span className="super-adm">{image.author}</span>
                                                            <span className="tags">Published</span>
                                                        </div>
                                                        <div className="asset-pic">
                                                            <LoadingImage src={image.src} alt="" />
                                                        </div>
                                                        <div className="asset-txt text-center">
                                                            <h6>Supermarket Thumball</h6>
                                                            <p><strong>Author: </strong>Thumball</p>
                                                            <p><strong>Access: </strong>All</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {type === ASSETTYPE.IMAGE && audios.length !== 0 && audios.slice(pagenumber * perpage, (pagenumber + 1) * pagenumber > audios.length - 1 ? audios.length : (pagenumber + 1) * perpage).map((audio) => {
                                            return (
                                                <div key={audio.index} className="col-md-3">
                                                    <div className="asset-lib">
                                                        <div className="asset-hdr">
                                                            <span className="super-adm">{audio.author}</span>
                                                            <span className="tags">Published</span>
                                                        </div>
                                                        <div className="asset-pic">
                                                            <LoadingAudio src={audio.src} extension={audio.extension} />
                                                        </div>
                                                        <div className="asset-txt text-center">
                                                            <h6>Supermarket Thumball</h6>
                                                            <p><strong>Author: </strong>Thumball</p>
                                                            <p><strong>Access: </strong>All</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {type === ASSETTYPE.VIDEO && videos.length !== 0 && videos.slice(pagenumber * perpage, (pagenumber + 1) * pagenumber > videos.length - 1 ? videos.length : (pagenumber + 1) * perpage).map((video) => {
                                            return (
                                                <div key={video.index} className="col-md-3">
                                                    <div className="asset-lib">
                                                        <div className="asset-hdr">
                                                            <span className="super-adm">{video.author}</span>
                                                            <span className="tags">Published</span>
                                                        </div>
                                                        <div className="asset-pic">
                                                            <LoadingVideo src={video.src} extension={video.extension} />
                                                        </div>
                                                        <div className="asset-txt text-center">
                                                            <h6>Supermarket Thumball</h6>
                                                            <p><strong>Author: </strong>Thumball</p>
                                                            <p><strong>Access: </strong>All</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <Pagination
                                        items={type === ASSETTYPE.IMAGE ? images : (type === ASSETTYPE.AUDIO ? audios : videos)}
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
                </div>
            </>
        </LoadingLayout>
    )
}

const condition = authUser => !!authUser;

export default compose(withFirebase, withAuthorization(condition))(ThumballAssetLibrary);
