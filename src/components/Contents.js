import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { char2Bytes } from '@taquito/utils';
import { addBalanceOwnerOperation, addBalanceCounterpartyOperation, claimOwnerOperation, claimCounterpartyOperation } from '../utils/operation';
import { contract_address } from '../utils/tezos';

export function ContractInfo() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
      axios.get('https://api.ghostnet.tzkt.io/v1/contracts/' + contract_address +'/storage')
        .then(response => setData(response.data))
        .catch(error => console.log(error));
    }, []);
    
    return (
      <div>
        {data ? (
          <div>
            <p>Epoch: {data.epoch}</p>
            <p>Owner: {data.owner}</p>
            <p>From Owner: {data.fromOwner}</p>
            <p>Balance Owner: {data.balanceOwner}</p>
            <p>Counterparty: {data.counterparty}</p>
            <p>Hashed Secret: {data.hashedSecret}</p>
            <p>From Counterparty: {data.fromCounterparty}</p>
            <p>Balance Counterparty: {data.balanceCounterparty}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }

export function AmountForm() {
  const [number, setNumber] = useState('');
  const [isOwner, setIsOwner] = useState(false); // new state for checkbox
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Amount submitted:', number);
    console.log('Is Owner:', isOwner); // log the checkbox value
    if(isOwner){
      await addBalanceOwnerOperation(number);
    }
    else{
      await addBalanceCounterpartyOperation(number);
    }
  };
  
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="numberInput">Enter a Number:</label>
          <input
            type="number"
            className="form-control"
            id="numberInput"
            placeholder="Enter an amount"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isOwnerCheckbox"
            checked={isOwner}
            onChange={(e) => setIsOwner(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isOwnerCheckbox">
            Send as Owner
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export function ClaimForm() {
  const handleOwnerClick = async() => {
    // Handle claim as owner button click
    console.log('Claim as owner button clicked');
    await claimOwnerOperation();
  };

  const handleCounterpartyClick = async() => {
    // Handle claim as counterparty button click
    console.log('Claim as counterparty button clicked');
    await claimCounterpartyOperation(char2Bytes("\"3D"));
  };

  return (
    <div className="container">
      <button onClick={handleOwnerClick} className="btn btn-primary mr-2">Claim as owner</button>
      <button onClick={handleCounterpartyClick} className="btn btn-primary">Claim as counterparty</button>
    </div>
  );
}