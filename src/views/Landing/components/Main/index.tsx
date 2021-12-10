import React from "react";
import { Link } from "@material-ui/core";
import "./main.scss";
import LogoImg from "../../../../assets/icons/starshipDAOBanner.gif";

function Main() {
    return (
        <div className="landing-main">
            <div className="landing-main-img-wrap">
                <img src={LogoImg} alt="" />
            </div>
            <div className="landing-main-btns-wrap">
                <Link href="http://app.localhost:3000/#/presale" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>Enter App to Join Presale</p>
                    </div>
                </Link>
                <Link href="https://docs.starshipdao.finance/" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>Documentation</p>
                    </div>
                </Link>
            </div>
            <div className="landing-main-title-wrap">
                <p>The First-Ever</p>
                <p>Multi-Chain Reserve Currency</p>
            </div>
            <div className="landing-main-help-text-wrap">
                <p>Giving you the Freedom to grow your Financial Wealth</p>
            </div>
        </div>
    );
}

export default Main;
