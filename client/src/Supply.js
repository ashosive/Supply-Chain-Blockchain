// only content changes remaining designing done



import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"

function Supply() {
    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [rmSupplierAccount, setRmSupplierAccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState();
    const [MedStage, setMedStage] = useState();
    const [ID, setID] = useState();


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
        console.log(accounts);
        const account = accounts[0];
        const rmAccount = account[1];
        setCurrentaccount(account);
        setRmSupplierAccount(rmAccount);
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
                med[i] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i] = await supplychain.methods.showStage(i + 1).call();
            }
            setMED(med);
            setMedStage(medStage);
            setloader(false);
        }
        else {
            window.alert('The smart contract is not deployed to current network')
        }
    }
    if (loader) {
        return (
            <div className="container">
                <h1 className="wait text-center mt-5">Loading...</h1>
            </div>
        )

    }
    const redirect_to_home = () => {
        history.push('/')
    }
    const handlerChangeID = (event) => {
        setID(event.target.value);
    }

    const handlerSubmitRMSsupply = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.RMSsupply(ID).send({ from: currentaccount,gas: 6000000 });
            if (reciept) {
                await loadBlockchaindata();
            }
        }
        catch (err) {
            
           
            alert("An error occurred!!!")
        }
    }
    const handlerSubmitManufacturing = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.Manufacturing(ID).send({ from: currentaccount });
            if (reciept) {
                await loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occurred!!!")
        }
    }
    const handlerSubmitDistribute = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.Distribute(ID).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occurred!!!")
        }
    }
    const handlerSubmitRetail = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.Retail(ID).send({ from: currentaccount });
            if (reciept) {
                await loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occurred!!!")
        }
    }
    const handlerSubmitSold = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.sold(ID).send({ from: currentaccount });
            if (reciept) {
                await loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occurred!!!")
        }
    }
    return (
        <div className="container">
      
        
    <div className="row align-items-center">
        <div className="col">
            <span><b>Current Account Address:</b> {currentaccount}</span>
        </div>
        <div className="col-auto">
            <button onClick={redirect_to_home} className="btn btn-outline-danger btn-sm">HOME</button>
        </div>
   
</div>

        <div className="row mt-3">
            <div className="col">
                <table className="table table-sm table-dark">
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
                                    <td>
                                        {
                                            MedStage[key]
                                        }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
       
<div className="row mt-3">
    <div className="col">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><b>Step 1: Farmers</b> </h5>
                <form onSubmit={handlerSubmitRMSsupply}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                        <button type="submit" className="btn btn-outline-success">Enter</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

        
<div className="row mt-3">
    <div className="col">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><b>Step 2: Processing</b> </h5>
                <form onSubmit={handlerSubmitManufacturing}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                        <button type="submit" className="btn btn-outline-success">Enter</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div className="row mt-3">
    <div className="col">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><b>Step 3: Distribution</b></h5>
                <form onSubmit={handlerSubmitDistribute}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                        <button type="submit" className="btn btn-outline-success">Enter</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div className="row mt-3">
    <div className="col">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><b>Step 4: Buyers</b> </h5>
                <form onSubmit={handlerSubmitRetail}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                        <button type="submit" className="btn btn-outline-success">Enter</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div className="row mt-3">
    <div className="col">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title"><b>Step 5: Mark as sold</b> </h5>
                <form onSubmit={handlerSubmitSold}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                        <button type="submit" className="btn btn-outline-success">Enter</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

    </div>
        
        )
        
    
}

export default Supply

