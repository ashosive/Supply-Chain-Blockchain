import React from 'react';
import { useHistory } from "react-router-dom";

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
        <div className="container-fluid" style={{ backgroundColor: '#D1FAE5', minHeight: '100vh' }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 text-center mb-4">
                        <h1 className="display-4 text-gray-800">Welcome to FarmChain</h1>
                        <p className="lead text-gray-800">Your solution for managing agricultural supply chains</p>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-8 text-center">
                        <h5 className="mb-4 text-gray-800">Get Started</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title text-gray-800">Register</h5>
                                        <p className="card-text text-gray-800">Register suppliers, manufacturers, distributors, and retailers.</p>
                                        <button onClick={redirect_to_roles} className="btn btn-primary btn-sm">Register</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title text-gray-800">Order Supplies</h5>
                                        <p className="card-text text-gray-800">Place orders for agricultural supplies.</p>
                                        <button onClick={redirect_to_addmed} className="btn btn-primary btn-sm">Order Supplies</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title text-gray-800">Manage Supply Chain</h5>
                                        <p className="card-text text-gray-800">Monitor and manage the agricultural supply chain.</p>
                                        <button onClick={redirect_to_supply} className="btn btn-primary btn-sm">Manage Supply Chain</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title text-gray-800">Track Products</h5>
                                        <p className="card-text text-gray-800">Track the movement of products in the supply chain.</p>
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
