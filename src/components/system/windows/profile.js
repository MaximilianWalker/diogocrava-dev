// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import PropTypes from "prop-types";
import Window from "@/components/system/common/window";
import Code from "@/components/common/code";
import './profile.css';
import Mask from "@/components/3d-models/mask";

const Row = ({ className, style, name, value }) => (
    <div className={`profile__row ${className}`} style={style}>
        <p className="profile__name">{name}</p>
        <p className="profile__value">{value}</p>
    </div>
);

const Profile = forwardRef(({ className, language, code, ...props }, ref) => {
    const [data, setData] = useState();
    return (
        <Window
            ref={ref}
            id="profile"
            className={`profile ${className}`}
            name="Profile"
            {...props}
        >
            <Row name="Name" value="Diogo Crava" />
            <div className="profile__container">
                <div className="profile__mask">
                    <Mask />
                </div>
                <div className="profile__rows">
                    <Row name="Job" value="Software Engineer - Fullstack Developer" />
                    <Row name="Name" value="Diogo Crava" />
                    <Row name="Name" value="Diogo Crava" />
                    <Row name="Name" value="Diogo Crava" />
                </div>
            </div>
        </Window>
    );
});

Profile.propTypes = {

};

export default Profile;