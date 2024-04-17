import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"

function Track() {
    const history = useHistory()
    useEffect(() => {
        loadWeb3().then(r => {});
        loadBlockchaindata().then(r => {});
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState();
    const [MedStage, setMedStage] = useState();
    const [ID, setID] = useState();
    const [RMS, setRMS] = useState();
    const [MAN, setMAN] = useState();
    const [DIS, setDIS] = useState();
    const [RET, setRET] = useState();
    const [TrackTillSold, showTrackTillSold] = useState(false);
    const [TrackTillRetail, showTrackTillRetail] = useState(false);
    const [TrackTillDistribution, showTrackTillDistribution] = useState(false);
    const [TrackTillManufacture, showTrackTillManufacture] = useState(false);
    const [TrackTillRMS, showTrackTillRMS] = useState(false);
    const [TrackTillOrdered, showTrackTillOrdered] = useState(false);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (error) {
                console.error('User denied account access');
            }
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    };

    const loadBlockchaindata = async () => {
        setloader(true);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setCurrentaccount(account);
        const networkId = await web3.eth.net.getId();
        const networkData = SupplyChainABI.networks[networkId];
        if (networkData) {
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
            setSupplyChain(supplychain);
            var i;
            const medCtr = await supplychain.methods.medicineCtr().call();
            const med = {};
            const medStage = [];
            for (i = 0; i < medCtr; i++) {
                med[i + 1] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
            }
            setMED(med);
            setMedStage(medStage);
            const rmsCtr = await supplychain.methods.rmsCtr().call();
            const rms = {};
            for (i = 0; i < rmsCtr; i++) {
                rms[i + 1] = await supplychain.methods.RMS(i + 1).call();
            }
            setRMS(rms);
            const manCtr = await supplychain.methods.manCtr().call();
            const man = {};
            for (i = 0; i < manCtr; i++) {
                man[i + 1] = await supplychain.methods.MAN(i + 1).call();
            }
            setMAN(man);
            const disCtr = await supplychain.methods.disCtr().call();
            const dis = {};
            for (i = 0; i < disCtr; i++) {
                dis[i + 1] = await supplychain.methods.DIS(i + 1).call();
            }
            setDIS(dis);
            const retCtr = await supplychain.methods.retCtr().call();
            const ret = {};
            for (i = 0; i < retCtr; i++) {
                ret[i + 1] = await supplychain.methods.RET(i + 1).call();
            }
            setRET(ret);
            setloader(false);
        }
        else {
            window.alert('The smart contract is not deployed to current network')
        }
    }
    if (loader) {
        return (
            <div>
                <h1 className="wait">Loading...</h1>
            </div>
        )
    }
    if (TrackTillSold) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Product:</u></b></h3>
                    <span><b>Product ID: </b>{MED[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {MED[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{MED[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{MedStage[ID]}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Product by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Location: </b>{RMS[MED[ID].RMSid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Manufactured by:</u></h4>
                        <p><b>Manufacturer ID: </b>{MAN[MED[ID].MANid].id}</p>
                        <p><b>Name:</b> {MAN[MED[ID].MANid].name}</p>
                        <p><b>Place: </b>{MAN[MED[ID].MANid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Distributed by:</u></h4>
                        <p><b>Distributor ID: </b>{DIS[MED[ID].DISid].id}</p>
                        <p><b>Name:</b> {DIS[MED[ID].DISid].name}</p>
                        <p><b>Place: </b>{DIS[MED[ID].DISid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Bought by:</u></h4>
                        <p><b>Buyer ID: </b>{RET[MED[ID].RETid].id}</p>
                        <p><b>Name:</b> {RET[MED[ID].RETid].name}</p>
                        <p><b>Place: </b>{RET[MED[ID].RETid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Sold</u></h4>
                    </article>
                </section>
                <button onClick={() => {
                    showTrackTillSold(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillRetail) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Product:</u></b></h3>
                    <span><b>Product ID: </b>{MED[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {MED[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{MED[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{MedStage[ID]}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Manufactured by:</u></h4>
                        <p><b>Manufacturer ID: </b>{MAN[MED[ID].MANid].id}</p>
                        <p><b>Name:</b> {MAN[MED[ID].MANid].name}</p>
                        <p><b>Place: </b>{MAN[MED[ID].MANid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Distributed by:</u></h4>
                        <p><b>Distributor ID: </b>{DIS[MED[ID].DISid].id}</p>
                        <p><b>Name:</b> {DIS[MED[ID].DISid].name}</p>
                        <p><b>Place: </b>{DIS[MED[ID].DISid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Retailed by:</u></h4>
                        <p><b>Retailer ID: </b>{RET[MED[ID].RETid].id}</p>
                        <p><b>Name:</b> {RET[MED[ID].RETid].name}</p>
                        <p><b>Place: </b>{RET[MED[ID].RETid].place}</p>
                    </article>
                </section>
                <button onClick={() => {
                    showTrackTillRetail(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillDistribution) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Product:</u></b></h3>
                    <span><b>Product ID: </b>{MED[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {MED[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{MED[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{MedStage[ID]}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Product Sold by:</u></h4>
                        <p><b>Seller ID: </b>{RMS[MED[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Sold by:</u></h4>
                        <p><b>Seller ID: </b>{MAN[MED[ID].MANid].id}</p>
                        <p><b>Name:</b> {MAN[MED[ID].MANid].name}</p>
                        <p><b>Place: </b>{MAN[MED[ID].MANid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Sold by:</u></h4>
                        <p><b>Seller ID: </b>{DIS[MED[ID].DISid].id}</p>
                        <p><b>Name:</b> {DIS[MED[ID].DISid].name}</p>
                        <p><b>Place: </b>{DIS[MED[ID].DISid].place}</p>
                    </article>
                </section>
                <button onClick={() => {
                    showTrackTillDistribution(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillManufacture) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Product:</u></b></h3>
                    <span><b>Product ID: </b>{MED[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {MED[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{MED[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{MedStage[ID]}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Manufactured by:</u></h4>
                        <p><b>Manufacturer ID: </b>{MAN[MED[ID].MANid].id}</p>
                        <p><b>Name:</b> {MAN[MED[ID].MANid].name}</p>
                        <p><b>Place: </b>{MAN[MED[ID].MANid].place}</p>
                    </article>
                </section>
                <button onClick={() => {
                    showTrackTillManufacture(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillRMS) {
        return (
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Product:</u></b></h3>
                    <span><b>Product ID: </b>{MED[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {MED[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{MED[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{MedStage[ID]}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Soldby:</u></h4>
                        <p><b>Seller ID: </b>{RMS[MED[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                    </article>
                </section>
                <button onClick={() => {
                    showTrackTillRMS(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
        )
    }
    if (TrackTillOrdered) {
        return (
            <div className="container mx-auto">
            <div className="row justify-content-center">
                <div className="col-md-6 mt-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-4"><u>Product Details</u></h5>
                            <p className="card-text"><b>Product ID:</b> {MED[ID].id}</p>
                            <p className="card-text"><b>Name:</b> {MED[ID].name}</p>
                            <p className="card-text"><b>Description:</b> {MED[ID].description}</p>
                            <p className="card-text"><b>Current Stage:</b> {MedStage[ID]}</p>
                        </div>
                    </div>
                </div>
        
                <div className="col-md-6 mt-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-4"><u>Sold By</u></h5>
                            <p className="card-text"><b>Seller ID:</b> {RMS[MED[ID].RMSid].id}</p>
                            <p className="card-text"><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                            <p className="card-text"><b>Place:</b> {RMS[MED[ID].RMSid].place}</p>
                        </div>
                    </div>
                </div>
            </div>
        
            <div className="row justify-content-center mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                        
                            <div className="d-flex justify-content-between mt-3">
                                <button onClick={() => showTrackTillOrdered(false)} className="btn btn-outline-success btn-sm">Track Another Item</button>
                                <button onClick={() => history.push('/')} className="btn btn-outline-danger btn-sm">HOME</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        )
    }
    const handlerChangeID = (event) => {
        setID(event.target.value);
    }
    const redirect_to_home = () => {
        history.push('/')
    }
    const handlerSubmit = async (event) => {
        event.preventDefault();
        var ctr = await SupplyChain.methods.medicineCtr().call();
        if (!((ID > 0) && (ID <= ctr)))
            alert("Invalid Product ID!!!");
        else {
            
            if (MED[ID].stage === 5)
                showTrackTillSold(true);
           
            else if (MED[ID].stage === 4)
                showTrackTillRetail(true);
           
            else if (MED[ID].stage === 3)
                showTrackTillDistribution(true);
           
            else if (MED[ID].stage === 2)
                showTrackTillManufacture(true);
           
            else if (MED[ID].stage === 1)
                showTrackTillRMS(true);
            else
                showTrackTillOrdered(true);

        }
    }

    return (
        <div className="container">
        <div className="row align-items-center mb-4">
            <div className="col">
                <span className="fs-6"><b>Current Account Address:</b> {currentaccount}</span>
            </div>
            <div className="col-auto">
                <button onClick={redirect_to_home} className="btn btn-outline-danger btn-sm"> HOME</button>
            </div>
        </div>
        <div className="row mb-4">
            <div className="col">
                <h5 className="mb-3"><b>Product Details</b></h5>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Product ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Current Processing Stage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(MED).map(function (key) {
                                return (
                                    <tr key={key}>
                                        <td>{MED[key].id}</td>
                                        <td>{MED[key].name}</td>
                                        <td>{MED[key].description}</td>
                                        <td>{MedStage[key]}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div className="row">
        <div className="col">
    <div className="card">
        <div className="card-body">
            <h5 className="card-title mb-3"><b>Track Order</b></h5>
            <form onSubmit={handlerSubmit}>
                <div className="input-group">
                    <input className="form-control form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                    <button type="submit" className="btn btn-success btn-sm">Track</button>
                </div>
            </form>
        </div>
    </div>
</div>

        </div>
    </div>
    
    
    )
}

export default Track
