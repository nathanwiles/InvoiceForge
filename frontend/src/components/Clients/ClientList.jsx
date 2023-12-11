import { useState, useEffect } from 'react';
import requests from '../../api/requests';
import "../../styles/client-list.scss";
import NewClientModal from "./NewClientModal";
import EditClientModal from "./EditClientModal";
import { FaTrash, FaEdit } from 'react-icons/fa';


export default function ClientList(props) {
  const { user } = props;

  {/* states set in this Modal for handling Modal open and fetch client info from user*/ }
  const [isClientModalOpen, setClientModelOpen] = useState(false);
  const [clients, setClients] = useState([]);

  {/* states set in addNewClientModal upon user submission of client info and address info*/ }
  const [clientId, setClientId] = useState(null);
  const [addressId, setAddressId] = useState(null);

  {/* states set in this Modal for handling client delete*/ }
  const [deleteMsgShow, setDeleteMsgShow] = useState(false);
  const [selectedClientIdtoDelete, setSelectedClientIdtoDelete] = useState(null);
  const [deleted, setDeleted] = useState(false);

  {/* states for EditClientsModal*/ }

  const [isClientEditModalOpen, setClientEditModelOpen] = useState(false);
  const [selectedClientIdtoEdit, setSelectedClientIdtoEdit] = useState(null);
  const [selectedAddressIdtoEdit, setSelectedAddressIdtoEdit] = useState(null);
  const [edited, setEdited] = useState(null);

  useEffect(() => {
    fetchClients();

    if (deleted) {
      const resetTimeout = setTimeout(() => {
        setDeleted(false);
      }, 1000);

      return () => clearTimeout(resetTimeout);
    }
  }, [clientId, addressId, deleted, edited]);

  {/* functions handling get clients logic*/ }
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
      const deletedOrNot = await requests.setDeleted.client(clientIdForDelete);
      console.log(clientIdForDelete);
      console.log("deleted?", deletedOrNot);
      setDeleted(deletedOrNot);
      handleDeleteConfirmPageClose();

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleClientDeleteClick = (selectedClientId) => {
    setDeleteMsgShow(true);
    setSelectedClientIdtoDelete(selectedClientId);
  };

  const handleDeleteConfirmPageClose = () => {
    setDeleteMsgShow(false);
  };

  {/* functions handling client edit logic*/ }

  const handleClientEditModalClick = (selectedClientId, selectedAddressId) => {
    setClientEditModelOpen(true);
    setSelectedClientIdtoEdit(selectedClientId);
    setSelectedAddressIdtoEdit(selectedAddressId);
  };


  return (
    <>
      {/* modals first for styling */}
      {isClientModalOpen && <NewClientModal setClientModelOpen={setClientModelOpen} user={user}
        setClientId={setClientId} setAddressId={setAddressId} clientId={clientId} addressId={addressId} />}

      {isClientEditModalOpen && <EditClientModal selectedClientIdtoEdit={selectedClientIdtoEdit} setEdited={setEdited}
        selectedAddressIdtoEdit={selectedAddressIdtoEdit} user={user} setClientEditModelOpen={setClientEditModelOpen} />}
      <h3>{clients.length > 0 ? `You have ${clients.length} Clients` : 'No Clients Yet'}</h3>
      <button className="add-new-client-button btn btn-block" onClick={handleNewClientModalClick}>Add New Client</button>

      {clients.length > 0 ? (
        <div className="client-list-container">
          <ul className="client-list">
            {clients.map((client) => (
              <li key={client.id} className="client-item">
                {/*edit icon and delete icons*/}
                <nav className="client-item-nav">
                  <FaEdit className='client-edit-icon' onClick={() => { handleClientEditModalClick(client.clientId, client.address.id); }} />
                  <FaTrash className="client-delete-icon" onClick={() => handleClientDeleteClick(client.id)} />
                </nav>
                {/*Delete confirmation div*/}
                {deleteMsgShow && client.id === selectedClientIdtoDelete && <div className='client-delete-container'>
                  <p className='delete-msg'>You are about to <span style={{ fontWeight: 'bold', color: 'red' }}>delete</span> this client from your client list.</p>
                  <div className='delete-confirm'>
                    <button className='delete-button' onClick={() => deleteClient(selectedClientIdtoDelete)}>Confirm</button>
                    <button className='delete-button' onClick={handleDeleteConfirmPageClose}>Cancel</button>
                  </div>
                </div>}
                {/*Delete confirmation div end*/}
                <div className="client-item-info card list-unstyled">
                  {client.companyName && <span>{client.companyName}</span>}
                  {!client.companyName && <span>{client.name}</span>}
                  <span>{client.email}</span>
                  {client.address && <span>{client.address.line1} {client.address.postalCode}</span>}

                  {client.phone && <span>{client.phone}</span>}
                  {client.clientRateCents && <span>Rate:${client.clientRateCents / 100} / hour</span>}
                </div>
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

    </>
  );
}
