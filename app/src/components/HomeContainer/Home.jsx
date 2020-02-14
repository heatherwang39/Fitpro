import { connect } from "react-redux";
import React from "react";
import { loginUser } from "../../actions/auth_actions"

const _Home = (props) => {
    return <div className="center">Home</div>
};

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({
    
})

export const Home = connect(mapStateToProps, mapDispatchToProps)(_Home);

export default Home;
