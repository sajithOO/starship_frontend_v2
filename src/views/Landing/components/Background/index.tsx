import React from "react";
import "./background.scss";
import BlobsTop from "../../../../assets/icons/galaxy.gif";

function Background() {
    return (
        <div className="landing-background">
            <div className="landing-background-blobs-top">
                <img alt="" src={BlobsTop} />
            </div>
        </div>
    );
}

export default Background;
