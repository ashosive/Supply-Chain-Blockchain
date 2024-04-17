// design changes done. only content remaining
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";

function AddMed() {
    const history = useHistory();

    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, []);

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setLoader] = useState(true);
    const [supplyChain, setSupplyChain] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [medName, setMedName] = useState("");
    const [medDes, setMedDes] = useState("");

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
            window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
        }
    };

    const loadBlockchaindata = async () => {
        setLoader(true);
        try {
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            setCurrentaccount(account);
            const networkId = await web3.eth.net.getId();
            const networkData = SupplyChainABI.networks[networkId];
            if (networkData) {
                const supplyChainInstance = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
                setSupplyChain(supplyChainInstance);
                const medCtr = await supplyChainInstance.methods.medicineCtr().call();
                const meds = [];
                for (let i = 0; i < medCtr; i++) {
                    const med = await supplyChainInstance.methods.MedicineStock(i + 1).call();
                    meds.push(med);
                }
                setMedicines(meds);
                setLoader(false);
            } else {
                window.alert('The smart contract is not deployed to the current network');
            }
        } catch (error) {
            console.error('Error loading blockchain data:', error);
            setLoader(false);
        }
    };

    const redirect_to_home = () => {
        history.push('/');
    };

    const handleNameChange = (event) => {
        setMedName(event.target.value);
    };

    const handleDesChange = (event) => {
        setMedDes(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await supplyChain.methods.addMedicine(medName, medDes).send({ from: currentaccount, gas: 6721975 });
            await loadBlockchaindata();
        } catch (error) {
            console.error('Error submitting product order:', error);
            alert("An error occurred while adding the product order!");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 text-center mb-4">
                    <h1 className="display-4">Add  Order</h1>
                    <p className="lead">Order new products</p>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Product Name" value={medName} onChange={handleNameChange} required />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Product Description" value={medDes} onChange={handleDesChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Order</button>
                    </form>
                </div>
            </div>
            <div className="row justify-content-center mt-5">
                <div className="col-md-8">
                    <h3>Ordered Products</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map((med, index) => (
                                <tr key={index}>
                                    <td>{med.id}</td>
                                    <td>{med.name}</td>
                                    <td>{med.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AddMed;
