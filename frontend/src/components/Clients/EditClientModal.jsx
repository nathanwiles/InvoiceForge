import { useState } from 'react';
import "../../styles/edit-client-modal.scss";
import requests from '../../api/requests';

export default function EditClientModal(props) {

  const { selectedClientIdtoEdit, user, selectedAddressIdtoEdit, setClientEditModelOpen, setEdited } = props;

  {/*states*/ }
  const [clientEditData, setClientEditData] = useState({
    userId: user.id,
    name: '',
    companyName: '',
    email: '',
    phone: '',
    clientRateCents: 4000,
  });

  const [addressEditData, setAddressEditData] = useState({
    userId: user.id,
    line1: '',
    line2: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
  });

  const [isClientEditFormOpen, setClientEditFormOpen] = useState(false);
  const [isClientEditConfirmOpen, setClientEditConfirmOpen] = useState(false);
  const [isAddressEditFormOpen, setAddressEditFormOpen] = useState(false);
  const [isAddressEditConfirmOpen, setAddressEditConfirm] = useState(false);

  {/*states end here*/ }
  {/*functions for storing input value from eidt forms*/ }

  const handleClientEditInputChange = (e) => {
    const { name, value } = e.target;
    setClientEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressEditInputChange = (e) => {
    const { name, value } = e.target;
    setAddressEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  {/*functions for conditional rendering*/ }

  const handleEditClientFormShow = () => {
    setClientEditFormOpen(true);
  };

  const handleEditClientFormHide = () => {
    setClientEditFormOpen(false);
  };

  const handleEditAddresssFormShow = () => {
    setAddressEditFormOpen(true);
  };

  const handleEditAddresssFormHide = () => {
    setAddressEditFormOpen(false);
  };

  const handleEditClientModalClose = () => {
    setClientEditModelOpen(false);
    setEdited(null);
    cleanClientInfoEditInputs();
    cleanClientAddressEditInputs();
  };

  {/*functions for calling put routes*/ }
  const handleClientEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const clientEditResponse = await requests.update.client(selectedClientIdtoEdit, clientEditData);
      console.log("clientEditResponse", clientEditResponse);
      //trigger ClientList re-rendering
      setEdited(clientEditResponse);
      //conditional rendering logics
      setClientEditFormOpen(false);
      setClientEditConfirmOpen(true);
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleAddressEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const addressEditForm = { ...addressEditData, selectedClientIdtoEdit };
      const addressEditResponse = await requests.update.address(selectedAddressIdtoEdit, addressEditForm);
      console.log("AddressEditResponse", addressEditResponse);
      //trigger ClientList re-rendering
      setEdited(addressEditResponse);
      //conditional rendering logics
      setAddressEditFormOpen(false);
      setAddressEditConfirm(true);
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  {/*functions for state cleaning after submission*/ }
  const cleanClientInfoEditInputs = () => {
    setClientEditData({
      userId: user.id,
      line1: '',
      line2: '',
      city: '',
      province: '',
      country: '',
      postalCode: '',
    });
  };

  const cleanClientAddressEditInputs = () => {
    setAddressEditData({
      userId: user.id,
      line1: '',
      line2: '',
      city: '',
      province: '',
      country: '',
      postalCode: '',
    });
  };

  return (
    <div className="edit-client-modal-container" id="editClientModal">
      <span className="edit-client-close" onClick={handleEditClientModalClose}>&times;</span>

      <div className="edit-client-modal-content">

        <h2 className='edit-form-title' onClick={() => { handleEditClientFormShow(); handleEditAddresssFormHide(); }}>➕ Edit Client Info</h2>
        {/* Edit Client Table*/}
        {isClientEditFormOpen &&
          <form onSubmit={handleClientEditSubmit}>
            <div className="form-group-edit-client">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={clientEditData.name}
                onChange={handleClientEditInputChange}
                placeholder='required'
                required
              />
            </div>
            <div className="form-group-edit-client">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={clientEditData.email}
                onChange={handleClientEditInputChange}
                placeholder='required'
                required
              />
            </div>
            <div className="form-group-edit-client">
              <label htmlFor="rate">Rate(¢):</label>
              <input
                type="number"
                id="clientRateCents"
                name="clientRateCents"
                value={clientEditData.clientRateCents}
                onChange={handleClientEditInputChange}
                required
              />
            </div>
            <div className="form-group-edit-client">
              <label htmlFor="phone">Phone:</label>
              <input
                type="phone"
                id="phone"
                name="phone"
                value={clientEditData.phone}
                onChange={handleClientEditInputChange}
                placeholder='optional'
              />
            </div>
            <div className="form-group-edit-client">
              <label htmlFor="companyName">Business:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={clientEditData.companyName}
                onChange={handleClientEditInputChange}
                placeholder='optional'
              />
            </div>
            <button type="submit" className='edit-client-button'>Change Client Info</button>
          </form>}

        {isClientEditConfirmOpen && <div>
          <h3>✔️ Client Info has been changed</h3>
        </div>
        }

        {/* Edit Address Table*/}
        <h2 className='edit-form-title' onClick={() => { handleEditAddresssFormShow(); handleEditClientFormHide(); }}>➕ Edit Address Info</h2>
        {isAddressEditFormOpen &&
          <form onSubmit={handleAddressEditSubmit}>
            <div className="address-group-edit">
              <input className="address-input-edit"
                type="text"
                placeholder="Line 1 (required)"
                name="line1"
                value={addressEditData.line1}
                onChange={handleAddressEditInputChange}
                required
              />
              <input className="address-input-edit"
                type="text"
                placeholder="Line 2 (optional)"
                name="line2"
                value={addressEditData.line2}
                onChange={handleAddressEditInputChange}
              />
              <input className="address-input-edit"
                type="text"
                placeholder="City (optional)"
                name="city"
                value={addressEditData.city}
                onChange={handleAddressEditInputChange}
              />
              <input className="address-input-edit"
                type="text"
                placeholder="Province (optional)"
                name="province"
                value={addressEditData.province}
                onChange={handleAddressEditInputChange}
              />
              <input className="address-input-edit"
                type="text"
                placeholder="Country (optional)"
                name="country"
                value={addressEditData.country}
                onChange={handleAddressEditInputChange}
              />
              <input className="address-input-edit"
                type="text"
                placeholder="Postal Code (required). No space."
                name="postalCode"
                value={addressEditData.postalCode}
                onChange={handleAddressEditInputChange}
                required
              />
            </div>
            <button type="submit" className='edit-client-button'>Change Address</button>
          </form>}

        {isAddressEditConfirmOpen && <div>
          <h3>✔️  Client address has been changed</h3>
          <button onClick={handleEditClientModalClose} className='edit-client-button'>Close</button>
        </div>
        }
      </div>
    </div>
  );
}
