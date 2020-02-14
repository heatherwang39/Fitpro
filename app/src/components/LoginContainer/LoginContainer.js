import { connect } from "react-redux";
import React from "react";
import { loginUser } from "../../actions/auth_actions"

const LoginContainer = (props) => {
    return (
        <div className="login-container">
        </div>
    )
};

const mapStateToProps = state => ({
    user: state.auth_reducer
});

const mapDispatchToProps = dispatch => ({
    loginUser: user => dispatch(loginUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);