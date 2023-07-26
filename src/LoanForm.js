import React, { useState } from "react";
import { cpf as cpfValidator, cnpj as cnpjValidator } from "cpf-cnpj-validator";
import axios from "axios";

const LoanForm = () => {
  const [personType, setPersonType] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [name, setName] = useState("");
  const [amountDue, setAmountDue] = useState(0);
  const [requestedValue, setRequestedValue] = useState("");
  const [validCPF, setValidCPF] = useState(true);
  const [validCNPJ, setValidCNPJ] = useState(true);
  const [formError, setFormError] = useState("");

  const handlePersonTypeChange = (event) => {
    const selectedPersonType = event.target.value;
    setPersonType(selectedPersonType);
    if (selectedPersonType !== personType) {
      setCpf("");
      setCnpj("");
      setValidCPF(true);
      setValidCNPJ(true);
    }
  };

  const handleCpfChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    setCpf(numericValue);
  };

  const handleCnpjChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    setCnpj(numericValue);
  };

  const handleNameChange = (event) => {
    const inputValue = event.target.value;
    const regex = /^[\p{L}\s]+$/u;
    if (regex.test(inputValue) || inputValue === "") {
      setName(inputValue);
    }
  };

  const handleRequestedValueChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    const requestedValue = parseInt(numericValue, 10);

    if (requestedValue > 50000) {
      setRequestedValue("50000");
    } else {
      setRequestedValue(requestedValue.toString());
    }
  };

  const handleCpfBlur = () => {
    if (cpf.length === 11) {
      const isValidCpf = cpfValidator.isValid(cpf);
      setValidCPF(isValidCpf);
    } else {
      setValidCPF(false);
    }
  };

  const handleCnpjBlur = () => {
    if (cnpj.length === 14) {
      const isValidCnpj = cnpjValidator.isValid(cnpj);
      setValidCNPJ(isValidCnpj);
    } else {
      setValidCNPJ(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validCPF && validCNPJ) {
      try {
        const response = await axios.post("/api/loan", {
          personType,
          cpf,
          cnpj,
          name,
          amountDue,
          requestedValue,
        });

        // Displays the loan approval or denial message
        alert(response.data.message);
      } catch (error) {
        // In case of an error in the API call, displays the error message
        if (error.response) {
          console.log("Status da resposta:", error.response.status);
          console.log("Dados da resposta:", error.response.data);
        }
        alert(
          "Erro ao processar a solicitação de empréstimo. Recarregue a página e tente novamente."
        );
      }
    } else {
      setFormError("Por favor, verifique os números do documento.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formError && <div className="error">{formError}</div>}

      <label>
        Nome:
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Digite o nome"
          pattern=".{3,100}"
          title="Nome deve conter de 3 a 100 caracteres"
          minLength={3}
          maxLength={100}
          required
        />
      </label>

      <label>
        Tipo de pessoa:
        <select value={personType} onChange={handlePersonTypeChange} required>
          <option value="">Selecione</option>
          <option value="PF">Pessoa Física</option>
          <option value="PJ">Pessoa Jurídica</option>
        </select>
      </label>

      {personType === "PF" && (
        <label>
          CPF:
          <input
            type="text"
            value={cpf}
            onChange={handleCpfChange}
            onBlur={handleCpfBlur}
            className={validCPF ? "" : "invalid-field"}
            placeholder="Digite o CPF"
            minLength={11}
            maxLength={11}
            pattern="[0-9]{11}"
            title="CPF deve conter exatamente 11 dígitos"
          />
        </label>
      )}

      {personType === "PJ" && (
        <label>
          CNPJ:
          <input
            type="text"
            value={cnpj}
            onChange={handleCnpjChange}
            onBlur={handleCnpjBlur}
            className={validCNPJ ? "" : "invalid-field"}
            placeholder="Digite o CNPJ"
            minLength={14}
            maxLength={14}
            pattern="[0-9]{14}"
            title="CNPJ deve conter exatamente 14 dígitos"
          />
        </label>
      )}

      <label htmlFor="amountDue">
        Valor devido atual:
        <input type="text" value={amountDue} readOnly disabled />
      </label>

      <label>
        Valor solicitado:
        <input
          type="text"
          value={requestedValue}
          onChange={handleRequestedValueChange}
          onKeyUp={(event) => {
            const numericValue = event.target.value.replace(/\D/g, "");
            setRequestedValue(numericValue);
          }}
          placeholder="Informe o valor solicitado"
          maxLength={5}
          required
        />
      </label>

      <button type="submit">Enviar</button>
    </form>
  );
};

export default LoanForm;
