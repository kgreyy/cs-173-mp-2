import { useState, useEffect } from "react";

// Components
import Navbar from "./components/Navbar";
import { ContractInfo, AmountForm, ClaimForm } from './components/Contents';


const App = () => {
  const [data, setData] = useState(null);
  const [account, setAccount] = useState(null);

  const updateData = (newData) => {
    setData(newData);
  };

  const updateAccount = (newAccount) => {
    setAccount(newAccount);
  }

  const getRole = () => {
    return account==data.owner ? "Owner": account==data.counterparty ? "Counterparty" : account==data.admin ? "Admin" : "No role in contract"
  }

  return (
    <div className="h-100">
      <Navbar updateAccount={updateAccount}/>
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <ContractInfo updateData={updateData} />
      <div className="d-flex flex-column justify-content-center align-items-center">
      {data ? 
        ((data.balanceOwner==0 && account==data.owner) || (data.balanceCounterparty==0 && account==data.counterparty))
              ? (<div><h4>You are the {getRole()}. You have not deposited any funds yet.</h4><AmountForm /></div>)
              : ((data.balanceOwner!=0 && account==data.owner) || (data.balanceCounterparty!=0 && account==data.counterparty) || data.admin)
                ? (<div>
                  {account==data.admin ? '':<h4>Funds have been deposited. Claim them!</h4>}
                  <ClaimForm data={data} account={account}/>
                  </div>
                  )
                : ''
                : ''
      }
      
      </div>
      </div>
    </div>
  );
};

export default App;
