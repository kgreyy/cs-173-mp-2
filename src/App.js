import { useState, useEffect } from "react";

// Components
import Navbar from "./components/Navbar";
import { ContractInfo, AmountForm, ClaimForm } from './components/Contents';


const App = () => {

  useEffect(() => {

  }, []);

  return (
    <div className="h-100">
      <Navbar />
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <ContractInfo />
      <div className="d-flex flex-column justify-content-center align-items-center">
      <AmountForm />
      <ClaimForm />
      </div>
      </div>
    </div>
  );
};

export default App;
