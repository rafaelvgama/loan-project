import React from "react";
import LoanForm from "./LoanForm";
import axios from "axios";

function App() {
  return (
    <div className="App">
      <h1>
        Solicite seu Empréstimo<span>:</span>
      </h1>
      <LoanForm />
    </div>
  );
}

export default App;
