import React from 'react';
import { useHistory } from "react-router-dom";
import "./home.css";


function Home() {
const history = useHistory();

const redirect_to_roles = () => {
history.push('/roles');
};

const redirect_to_addmed = () => {
history.push('/addmed');
};

const redirect_to_supply = () => {
history.push('/supply');
};

const redirect_to_track = () => {
history.push('/track');
};

return (
<div className="container-fluid" style={{ background: 'linear-gradient(to bottom, #88b235, #53831f)', minHeight: '100vh' }}>
<div className="container py-5">
<div className="row justify-content-center">
<div className="col-md-8 text-center mb-4">
<h1 className="display-4 text-dark farmhead">Welcome to FarmChain</h1>
<p className="lead text-dark">Your solution for managing agricultural supply chains</p>
</div>
</div>
<div className="row justify-content-center">
<div className="col-md-8 text-center">
<h5 className="mb-4 text-dark">Get Started</h5>
<div className="row">
<div className="col-md-6">
<div className="card custom-card mb-4">
<div className="card-body">
<h5 className="card-title">Register</h5>
<p className="card-text">Register suppliers, manufacturers, distributors, and retailers.</p>
<button onClick={redirect_to_roles} className="btn btn-primary btn-sm">Register</button>
</div>
</div>
</div>
<div className="col-md-6">
<div className="card custom-card mb-4">
<div className="card-body">
<h5 className="card-title">Order Supplies</h5>
<p className="card-text">Place orders for agricultural supplies.</p>
<button onClick={redirect_to_addmed} className="btn btn-primary btn-sm">Order Supplies</button>
</div>
</div>
</div>
</div>
<div className="row">
<div className="col-md-6">
<div className="card custom-card mb-4">
<div className="card-body">
<h5 className="card-title">Manage Supply Chain</h5>
<p className="card-text">Monitor and manage the agricultural supply chain.</p>
<button onClick={redirect_to_supply} className="btn btn-primary btn-sm">Manage Supply Chain</button>
</div>
</div>
</div>
<div className="col-md-6">
<div className="card custom-card mb-4">
<div className="card-body">
<h5 className="card-title">Track Products</h5>
<p className="card-text">Track the movement of products in the supply chain.</p>
<button onClick={redirect_to_track} className="btn btn-primary btn-sm">Track Products</button>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
);
}

export default Home;