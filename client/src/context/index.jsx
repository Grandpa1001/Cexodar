import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ethers} from 'ethers';
import Web3Modal from 'web3modal';
import {useNavigate} from 'react-router-dom';
import { ABI, ADDRESS } from '../contract';
import { createEventListeners } from './createEventListeners';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [provider, setProvider] = useState('');
    const [contract, setContract] = useState('');
    const [showAlert, setShowAlert] = useState({status: false, type: 'info', message: ''});
    const [battleName, setBattleName] = useState('');

    const navigate = useNavigate();

    //* Set the wallet addres
    const updateCurrentWalletAddress = async () => {
        const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts' });
        if(accounts) setWalletAddress(accounts[0]);
        console.log(accounts);
}

useEffect(()=> {updateCurrentWalletAddress();

    window.ethereum.on('accountsChanged', updateCurrentWalletAddress);
}, []);

 //*Set the smart contract the provider to the state
useEffect(()=> {
    const setSmartContractAndProvider = async () =>{
        const web3Modal = new Web3Modal();
        await timeout(1000);
        const connection = await web3Modal.connect();
        const newProvider = new ethers.providers.Web3Provider (connection);
        const signer = newProvider.getSigner();
        const newContract = new ethers.Contract(ADDRESS, ABI, signer);

        setProvider(newProvider);
        setContract(newContract);
    }
    setSmartContractAndProvider();
}, []);


useEffect(() => {
    if(contract) {
        createEventListeners({
            navigate, contract, provider, walletAddress, setShowAlert,
        });
    }
}, [contract])

useEffect(()=> {
    if(showAlert?.status){
        const timer = setTimeout(() => {
            setShowAlert({ status: false, type: 'info', message: '' })
        }, [5000])
    
        return () => clearTimeout(timer);
    }
}, [showAlert]);


    return (
        <GlobalContext.Provider value={{
            contract, walletAddress,
            showAlert, setShowAlert,
            battleName, setBattleName,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

// function wait for/delay for comunication
function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

export const useGlobalContext = () => useContext (GlobalContext);