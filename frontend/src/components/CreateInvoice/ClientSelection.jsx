import "../../styles/clientSelection.scss";
import { useEffect, useRef } from "react";

const ClientSelection = ({ selectedClient, handleClientSelect, clients }) => {
  const selectRef = useRef();
  useEffect(() => {
    if (selectedClient === null) {
      selectRef.current.value = ""; // reset the select value
    }
  }, [selectedClient]);

  return (
    <div>
      <select
        className="client-option"
        ref={selectRef}
        value={selectedClient || ""}
        onChange={(e) => handleClientSelect(parseInt(e.target.value))}
      >
        <option disabled value="">
          Select a client
        </option>


        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      {selectedClient === null && (
        <div>
          <div className="select-client-msg">
          <p>Ready to generate an invoice?</p>
          <p>Choose a client to get started by clicking the "Select a client" drop-down menu above!</p>
          </div>

        </div>
      )}
    </div>
  );
};

export default ClientSelection;
