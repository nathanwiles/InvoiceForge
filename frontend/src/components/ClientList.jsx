import { useState, useEffect } from 'react';
import requests from '../api/requests';
import "../styles/client-list.scss";
import NewClientModal from "./NewClientModal";

export default function ClientList(props) {
  const { user } = props;

  {/* states set in this Modal for handling Modal open and fetch client info from user*/}
  const [isClientModalOpen, setClientModelOpen] = useState(false);
  const [clients, setClients] = useState([]);

  {/* states set in addNewClientModal upon user submission of client info and address info*/ }
  const [clientId, setClientId] = useState(null);
  const [addressId, setAddressId] = useState(null);

  {/* states set in this Modal for handling client delete*/}
  const [deleteMsgShow, setDeleteMsgShow] = useState(false);
  const [selectedClientIdtoDelete, setSelectedClientIdtoDelete] = useState(null);
  const [deleted,setDeleted] = useState(false);
 

  
  useEffect(() => {
    fetchClients();
  }, [clientId, addressId]);

  const fetchClients = async () => {
    try {
      const clientData = await requests.get.user(user.id).clients;
      setClients(clientData);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const handleNewClientModalClick = () => {
    setClientModelOpen(true);
  };
  
     {/* functions handling client delete logic*/ }
  
  const deleteClient = async (clientIdForDelete) => {
    try {
      const deletedOrNot = await requests.setDeleted.client(clientIdForDelete)
      console.log(clientIdForDelete)
      console.log("deleted?", deletedOrNot)

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleClientDeleteClick = (selectedClientId) => {
    setDeleteMsgShow(true);
    setSelectedClientIdtoDelete(selectedClientId);
  }


  return (
    <div>
      <h3>{clients.length > 0 ? `You have ${clients.length} Clients` : 'No Clients Yet'}</h3>
      <button className="add-new-client-button" onClick={handleNewClientModalClick}>Add New Client</button>

      {clients.length > 0 ? (
        <div className="client-list-container">
          <ul className="client-list">
            {clients.map((client) => (
              <li key={client.id} className="client-item">
                <span className="client-delete-icon" onClick={() => handleClientDeleteClick(client.id)}>&times;</span>
               
                <span>{client.name}</span>
                {client.address && <span>{client.address.line1}, {client.address.postalCode}</span>}
                {client.phone && <span>Phone: {client.phone}</span>}
                {client.companyName && <span>Company: {client.companyName}</span>}
                {client.clientRateCents && <span>Rate:${client.clientRateCents/100} / hour</span>}
              </li>

            ))}
          </ul>
        </div>) : (
        <div className="client-list-container">
          <h4>Please Add your first client using the "Add New Client" button.</h4>
          <h4>Your client info will display when you finish adding new client. Here is an exmaple:</h4>
          <img style={{ maxWidth: '45%' }}
            src="/clientExample.jpg" alt="example" />
        </div>
      )}

      {isClientModalOpen && <NewClientModal setClientModelOpen={setClientModelOpen} user={user}
        setClientId={setClientId} setAddressId={setAddressId} clientId={clientId} addressId={addressId} />}
    </div>
  );
}
