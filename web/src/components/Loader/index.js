import React from "react";

const Loader = ({ show }) => {
    const date = new Date();
    return (
        <div
            id="overlay"
            className={show ? "show-spinner" : "hide-spinner"}
        >
            <div className="spinner" />
            <br />
    Loading...
        </div>
    );
};

export default Loader;