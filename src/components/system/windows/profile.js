// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, forwardRef } from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff } from "react-feather";
import Window from "@/components/system/common/window";
import Mask from "@/components/3d-models/mask";
import FadeContainer from "@/components/common/fade-container";

import './profile.css';

const Row = ({ className, style, icon: Icon, name, value }) => (
    <div className={`profile__row ${className ?? ''}`} style={style}>
        {Icon && <Icon />}
        <p className="profile__name">{name}</p>
        <p className="profile__value">{value}</p>
    </div>
);

const Profile = forwardRef(({ className, ...props }, ref) => {
    const [data, setData] = useState();
    const [show, setShow] = useState(false);

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
            <FadeContainer
                className="profile__button-container"
                sides={['top']}
                width={20}
                style={{ paddingTop: '20px' }}
            >
                <button className="profile__button" onClick={() => setShow(!show)}>
                    {show ? <EyeOff /> : <Eye />}
                </button>
            </FadeContainer>
        </Window>
    );
});

Profile.propTypes = {

};

export default Profile;