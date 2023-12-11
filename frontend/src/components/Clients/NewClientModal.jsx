import { useState } from 'react';
import "../../styles/new-client-modal.scss";
import requests from '../../api/requests';


export default function NewClientModal(props) {

  {/* imports */ }
  const { setClientModelOpen, user, setAddressId, setClientId, clientId, addressId } = props;

  {/* states */ }
  const [clientData, setClientData] = useState({
    userId: user.id,
    name: '',
    companyName: '',
    email: '',
    phone: '',
    clientRateCents: 4000,
  });

  const [addressData, setAddressData] = useState({
    userId: user.id,
    line1: '',
    line2: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
  });



  // State for showing the address form
  const [showAddressForm, setShowAddressForm] = useState(false);


  {/* functions */ }
  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClientModelClose = () => {
    setClientModelOpen(false);
    setClientId(null);
    setAddressId(null);

  };

  const handleTransition = () => {
    setShowAddressForm(true);
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await requests.create.client(clientData); //return client id
      const newClientId = response;
      console.log("response", response);
      console.log(newClientId);
      setClientId(newClientId);

    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    try {

      const addressForm = { ...addressData, clientId };// use client id to connect address table to client table
      const newAddressId = await requests.create.address(addressForm);
      console.log("addressId", newAddressId);
      setAddressId(newAddressId);


    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  return (
    <div className="new-client-modal-container" id="newClientModal">
      <span className="new-client-close" onClick={handleClientModelClose}>&times;</span>

      <div className="new-client-modal-content">


        {!clientId &&
          <form onSubmit={handleClientSubmit}>
            <h2>Add Client Info</h2>

            {/* New Client Table*/}

            <div className="form-group-new-client">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={clientData.name}
                onChange={handleClientInputChange}
                placeholder='required'
                required
              />
            </div>
            <div className="form-group-new-client">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={clientData.email}
                onChange={handleClientInputChange}
                placeholder='required'
                required
              />
            </div>
            <div className="form-group-new-client">
              <label htmlFor="rate">Rate(¢):</label>
              <input
                type="number"
                id="clientRateCents"
                name="clientRateCents"
                value={clientData.clientRateCents}
                onChange={handleClientInputChange}
                required
              />
            </div>
            <div className="form-group-new-client">
              <label htmlFor="phone">Phone:</label>
              <input
                type="phone"
                id="phone"
                name="phone"
                value={clientData.phone}
                onChange={handleClientInputChange}
                placeholder='optional'
              />
            </div>
            <div className="form-group-new-client">
              <label htmlFor="companyName">Business:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={clientData.companyName}
                onChange={handleClientInputChange}
                placeholder='optional'
              />
            </div>


            <button type="submit" className='new-client-button'>Add Client Info</button>
          </form>}

        {/* Transition*/}
        {clientId && !showAddressForm &&
          <div >
            <h3>✔️ Client Info Added</h3>
            <p>Would you like to add client address now?</p>
            <div className='info-address-transition'>
              <button onClick={handleTransition} className='new-client-button'>Yes</button>
              <button onClick={handleClientModelClose} className='new-client-button'>No</button>
            </div>
          </div>}

        {/* New Address Table*/}

        {showAddressForm && !addressId &&
          <form onSubmit={handleAddressSubmit}>
            <div className="address-group">
              <label><h2>Add Client Address</h2></label>
              <input className="address-input"
                type="text"
                placeholder="Line 1 (required)"
                name="line1"
                value={addressData.line1}
                onChange={handleAddressInputChange}
                required
              />
              <input className="address-input"
                type="text"
                placeholder="Line 2 (optional)"
                name="line2"
                value={addressData.line2}
                onChange={handleAddressInputChange}
              />
              <input className="address-input"
                type="text"
                placeholder="City (optional)"
                name="city"
                value={addressData.city}
                onChange={handleAddressInputChange}
              />
              <input className="address-input"
                type="text"
                placeholder="Province (optional)"
                name="province"
                value={addressData.province}
                onChange={handleAddressInputChange}
              />
              <input className="address-input"
                type="text"
                placeholder="Country (optional)"
                name="country"
                value={addressData.country}
                onChange={handleAddressInputChange}
              />
              <input className="address-input"
                type="text"
                placeholder="Postal Code (required). No Space Needed."
                name="postalCode"
                value={addressData.postalCode}
                onChange={handleAddressInputChange}
                required
              />
            </div>
            <button type="submit" className='new-client-button' onClick={handleTransition}>Add Address</button>


          </form>}

        {/* Close msg and button*/}
        {addressId &&
          <div>
            <h3>✔️ Client Address Added</h3>
            <button onClick={handleClientModelClose} className='new-client-button'>Close</button>
          </div>
        }

      </div>
    </div>
  );
}
