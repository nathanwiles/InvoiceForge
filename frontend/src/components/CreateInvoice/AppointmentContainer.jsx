import { useState, useEffect } from "react";
import ClientSelection from "./ClientSelection";
import UninvoicedAppointments from "./UninvoicedAppointments";
import InvoiceGenerator from "./InvoiceGenerator";
import requests from "../../api/requests";
import { UseReviewAppointmentsContext } from "../ReviewAppointments/Context/UseReviewAppointmentsContext";
import { InvoiceModalProvider } from "../../contextProviders/useInvoiceModalContext";


const AppointmentsContainer = ({ user }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [checkedAppointments, setCheckedAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [reviewedAppointments, setReviewedAppointments] = useState([]);
  const [clientRate, setClientRate] = useState(null);
  const [clientObj, setClientObj] = useState({});
  const { state: reviewModalState } = UseReviewAppointmentsContext();


  useEffect(() => {
    if (selectedClient) {
      requests.get.client(selectedClient).allData.then((data) => {
        setReviewedAppointments(data.reviewed);
        setClientRate(data.client.clientRateCents || null);
        setClientObj(data.client);
      });
    }
    if (!selectedClient) {
      setReviewedAppointments([]);
      setClientRate(null);
      setClientObj({});
    }
  }, [selectedClient, reviewModalState.unreviewed]);

  useEffect(() => {
    requests.get.user(user.id).clients.then((clients) => {
      setClients(clients);
    });
  }, []);

  const handleAppointmentCheck = (id) => {
    setCheckedAppointments((checkedAppointments) =>
      checkedAppointments.includes(id)
        ? checkedAppointments.filter((item) => item !== id)
        : [...checkedAppointments, id]
    );
  };

  const handleClientSelect = (clientId) => {
    setSelectedClient(clientId);
  };

  return (
    <InvoiceModalProvider>
      <ClientSelection
        selectedClient={selectedClient}
        handleClientSelect={handleClientSelect}
        clients={clients}
      />
      {selectedClient && (
        <UninvoicedAppointments
          reviewedAppointments={reviewedAppointments}
          handleAppointmentCheck={handleAppointmentCheck}
          checkedAppointments={checkedAppointments}
        />
      )}
      {selectedClient && (
        <InvoiceGenerator
          reviewedAppointments={reviewedAppointments}
          checkedAppointments={checkedAppointments}
          clientRate={clientRate}
          selectedClient={selectedClient}
          clientObj={clientObj}
          user={user}
          setSelectedClient={setSelectedClient}
          setCheckedAppointments={setCheckedAppointments}
        />
      )}
    </InvoiceModalProvider>
  );
};

export default AppointmentsContainer;
