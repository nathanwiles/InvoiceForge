import { useState } from 'react';
import "../styles/top-navbar.scss";
import LoginModal from "./LoginModal";
import ClientList from './ClientList';


export default function TopNavBar(props) {
  const { user, setUser} = props
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const [showClientList, setClientListShow] = useState(false)

  const handleClientListClick = () => {
     setClientListShow(true)
     console.log('Client List clicked');
  }

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleModalClose = () => {
    setIsLoginModalOpen(false);
  };



  return (
    <div>
    <nav className="top-nav-bar">
      <span className="top-nav-bar__logo">InvoiceForge</span>

      {user &&
      <div className="top-nav-bar__list">
        <span>Schedule</span>
        <span onClick={handleClientListClick}>Client List</span>
        <span>Appointments in Review</span>
        <span>Forge Invoice</span>
      </div>}

      <div className="top-nav-bar__authentication">
        {!user && (<span onClick={handleLoginClick}>Login</span>)}
        {user && (<span className='username'>Hello, {user.first_name}.</span>)}
        {!user && (<span>Sign Up</span>)}
      </div>
      
      {isLoginModalOpen && !user && <LoginModal onClose={handleModalClose} setUser={setUser}/>}
    </nav>
      {showClientList && <ClientList/>}
      </div>
  );
}
