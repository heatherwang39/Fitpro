/*
 * Navigation component
 * Included on all pages
 */

import { Link } from "react-router-dom";
import React from "react";


export const Navigation = () => (
    <div className="header">
        <Link to="/">
            FitPro
        </Link>
    </div>
);

export default Navigation;
