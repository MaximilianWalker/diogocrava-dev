// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import PropTypes from "prop-types";
import Window from "@/components/system/common/window";
import Code from "@/components/common/code";
import Mask from "@/components/3d-models/mask";
import './profile.css';

const Row = ({ className, style, name, value }) => (
    <div className={`profile__row ${className ?? ''}`} style={style}>
        <p className="profile__name">{name}</p>
        <p className="profile__value">{value}</p>
    </div>
);

const Profile = forwardRef(({ className, ...props }, ref) => {
    const [data, setData] = useState();
    return (
        <Window
            ref={ref}
            id="profile"
            className={`profile ${className ?? ''}`}
            name="Profile"
            defaultOpen
            draggable
            resizable
            {...props}
        >
            <h1>Diogo Crava</h1>
            <h3>Software Developer</h3>
            <div className="profile__avatar">
                <Mask />
            </div>
            <div className="profile__data">
                <Row name="Role:" value="Full Stack" />
                <Row name="Experience:" value="5 Years" />
                <Row name="Education:" value="BSc Computer Engineering" />
            </div>
        </Window>
    );
});

Profile.propTypes = {

};

export default Profile;