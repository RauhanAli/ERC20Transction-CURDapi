import './App.css'
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import Web3Modal from 'web3modal'
import axios from 'axios'
import { BigNumber } from 'ethers';
import {
  Token
}from './config'
import token from './artifacts/contracts/Token.sol/MyToken.json'
import Web3 from "web3/dist/web3.min.js";
var web3, account,sender, delacc,delbalance= null;
const StartPayment = async ({ setError, setTxs, ether, addr }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    console.log(ethers.utils.getAddress(addr)); 
    const web3Modal = new Web3Modal()
      var provider = await web3Modal.connect();
		web3 = new Web3(provider); 
		await provider.send('eth_requestAccounts'); 
		 var accounts = await web3.eth.getAccounts(); 
		account = accounts[0]; 
        console.log(account)
        let contract = new web3.eth.Contract(token.abi,Token)
     console.log(contract)
        const tx = await contract.methods.transfer(addr,ether).send({from:account,
          to: addr})
    console.log({ ether, addr });
    delacc = addr
    delbalance = ether
    console.log("tx", tx);
    setTxs([tx]);
    let senderBalance = await contract.methods.balanceOf(account).call()
    senderBalance = web3.utils.toWei(senderBalance, 'ether')
    console.log(senderBalance);
          //reciever
        axios.post('http://localhost:5000/transaction', {
          address: addr,
          balance: ether
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

          //sender
          axios.post('http://localhost:5000/transaction', {
            address: account,
            balance: senderBalance
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
       
          
  } catch (err) {
    setError(err.message);
  }
};

export default function App() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);
  const [display, setDisplay] = useState([]);
  const [del, setDelete] = useState([]);
  const [getAddress, setAddress] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    await StartPayment({
      setError,
      setTxs,
      ether: data.get("ether"),
      addr: data.get("addr")
    });
  };
  async function Show(){

    axios.get('http://localhost:5000/transaction')
    .then(function (response) {
      console.log(response);
      setDisplay(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });

  }

   async function handleSearch(e){
    e.preventDefault();
    const search = new FormData(e.target);
    console.log(search.get('search'))
    const adr = search.get('search')
    axios.post('http://localhost:5000/transaction/address', {
      address: adr
    })
    .then(function (response) {
      console.log(response.data);
      console.log(response.data.address);
      console.log(response.data.balance);
    })
    .catch(function (error) {
      console.log(error);
    });
   }

  async function Delete(addr,bal){
    axios.post('http://localhost:5000/transaction/delete', {
          address: addr,
          balance: bal
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
  }
  return (
    <div>
    <form className="m-4" onSubmit={handleSubmit}>
      <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Send ERC20 payment
          </h1>
          <div className="">
            <div className="my-3">
              <input
                type="text"
                name="addr"
                className="input input-bordered block w-full focus:ring focus:outline-none"
                placeholder="Recipient Address"
              />
            </div>
            <div className="my-3">
              <input
                name="ether"
                type="text"
                className="input input-bordered block w-full focus:ring focus:outline-none"
                placeholder="Amount in APIT Token"
              />
            </div>
          </div>
        </main>
        <footer className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Pay now
          </button>
          <ErrorMessage message={error} />
          <TxList txs={txs} />
        </footer>
      </div>
    </form>
    <div>
      <form onSubmit={handleSearch}>
    <input  type="text"
                name="search"
                className="input input-bordered block w-full focus:ring focus:outline-none"
                placeholder="Address to Show Transaction" 
                >
                </input>
                <button class="button1" type="submit" >Submit</button>
                </form>

      <h1>Transaction Table</h1>
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Balance</th>
            <th>Actions</th>
            <button class="button1 pl-20" onClick={Show}>Show All Transactions</button>
          </tr>
        </thead>
        <tbody>
          {
            display.map((value, key) => {
              return (
                <tr key={key}>
                  <td>{value.address}</td>
                  <td>{value.balance}</td>
                  <td><button onClick={e => Delete(value.address,value.balance)}>Delete</button></td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    
      </div>

    </div>
  );
}
