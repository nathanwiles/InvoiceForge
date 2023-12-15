import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from './useUserContext';
import requests from '../api/requests';
import { useAlertModal } from './useAlertModalContext';

// Create the client context
const ClientsContext = createContext();

// Create the client context provider
export const ClientsContextProvider = ({ children }) => {
  const { showAlert } = useAlertModal();
  const [clients, setClients] = useState([]);
  const { user } = useUserContext();
  const userId = user ? user.id : null;

  useEffect(() => {

    if (!userId) {
      setClients([]); // clear clients if no user
      return;
    };

    // fetch clients
    requests.get.user(userId).clients.then((clients) => {
      setClients(clients);
    })
      .catch((error) => { // show Alert if error
        showAlert({
          title: "Can't do it",
          message: "There was an error fetching your clients. Please try again later."
        });
        console.error(error);
      });
  }, [userId]);

  return (
    <ClientsContext.Provider value={{ clients, setClients }}>
      {children}
    </ClientsContext.Provider>
  );
};

// Custom hook to access the client context
export const useClients = () => useContext(ClientsContext);
