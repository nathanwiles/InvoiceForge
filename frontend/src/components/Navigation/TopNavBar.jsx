import { useContext, useState } from 'react';
import "../../styles/top-navbar.scss";
import LoginModal from "./LoginModal";
import { useUserContext } from "../../contextProviders/useUserContext";
import { Dropdown, DropdownButton } from "react-bootstrap";



export default function TopNavBar(props) {
  const { handleLinkClick } = props;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, setUser } = useUserContext();

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLoginModalOpen(false);
    setUser(null);
    handleLinkClick(0);
  };

  return (
    <div>
      <nav className="top-nav-bar">
        <span onClick={() => handleLinkClick(0)} className="top-nav-bar__logo">InvoiceForge</span>

        {user &&
          <div className="top-nav-bar__list">
            <span onClick={() => handleLinkClick(1)}>Schedule</span>
            <span onClick={() => handleLinkClick(2)}>Clients</span>
            <span onClick={() => handleLinkClick(3)}>Confirm Hours</span>
            <span onClick={() => handleLinkClick(4)}>New Invoice</span>
          </div>}

        <div className="top-nav-bar__authentication">
          {!user && (<span onClick={handleLoginClick}>Log In</span>)}
          {!user && (<span>Sign Up</span>)}
        </div>
        {/* dropdown for logout */}
        {user && (
          <Dropdown>
            <Dropdown.Toggle as='span' className='user-greeting' id="dropdown-basic">
              Hello {user.firstName}.
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogoutClick}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
        {/* {user && (<span className='user-greeting'>Hello, {user.firstName}.</span>)}
          {user && (<span className='logout-btn' onClick={handleLogoutClick}>Log Out</span>)} */}

        {isLoginModalOpen && !user && <LoginModal onClose={handleModalClose} setUser={setUser} handleLinkClick={handleLinkClick} />}
      </nav>
    </div>
  );
}
