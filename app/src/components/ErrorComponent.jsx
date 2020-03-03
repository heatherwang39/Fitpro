import React from "react";
import Img from "react-image";
import errorGIF from "../../static/images/error.gif";

const ErrorComponent = () => (
    <div>
        <Img src={errorGIF} />
        <div>There was a rendering error.</div>
    </div>
);


export default ErrorComponent;
