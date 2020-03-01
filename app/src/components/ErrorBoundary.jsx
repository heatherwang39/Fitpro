import React from "react";
import PropTypes from "prop-types";
import ErrorComponent from "./ErrorComponent";


class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;
        if (hasError) {
            return <ErrorComponent />;
        }
        return children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.element.isRequired,
};

export default ErrorBoundary;
