import { connect } from "react-redux";
import React from "react";

const _Home = () => (
    <div style={{ textAlign: "center" }}>Home</div>
);

const mapStateToProps = (state, ownProps) => ownProps;

export const Home = connect(mapStateToProps)(_Home);

export default Home;
