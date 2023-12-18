// standard imports
import "./App.scss";
import { useState, useEffect, useContext } from "react";

// import contexts and providers
import { UseReviewAppointmentsContext } from "./components/ReviewAppointments/Context/UseReviewAppointmentsContext";
import { useUserContext } from "./contextProviders/useUserContext";
import { useAlertModal } from "./contextProviders/useAlertModalContext";
// import components
import ReviewAppointmentsModal from "./components/ReviewAppointments/ReviewAppointments";
import AppointmentContainer from "./components/CreateInvoice/AppointmentContainer";
import AlertModal from "./Modals/AlertModal";
import ClientList from "./components/Clients/ClientList";
import TopNavBar from "./components/Navigation/TopNavBar";
import LandingPage from "./components/PublicPages/Landingpage";
import Footer from "./components/Navigation/footer";
import Schedule from "./components/Schedule/Schedule";

function App() {

  const handleLinkClick = (pageNumber) => {
    // adjust so that modal doesn't redirect to blank background
    if (pageNumber === 3) {
      openReviewModal();
    }
    else {
      setDisplayPage(pageNumber);
    }
  };

  // user is now retriver from the context provider
  const { user, setUser } = useUserContext();
  const { openReviewModal } = UseReviewAppointmentsContext();
  const [displayPage, setDisplayPage] = useState(0);


  // // example of how to open the alert modal
  // const { showAlert } = useAlertModal(); // retrieves the show alert method from the modal's context. Import useAlertModal into your file, see line 8.
  // useEffect(() => { // ignore this useEffect, it's just so that the alert modal opens on page load
  //   // configure the desired alert message and title
  //   const myAlert = {
  //     message: 'This is an alert message. Checkout App.jsx lines 37 - 44 for an example of how to open the alert modal',
  //     title: 'This is an alert title',
  //   }
  // // call showAlert to open the alert modal
  // showAlert(myAlert);
  // },[]);

  //handle redirect to client list if no clients
  useEffect(() => {
    if (user) {
      fetch(`/api/user/${user.id}/clients`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) {
            setDisplayPage(2);
          } else {
            setDisplayPage(1); //change 1 to your page numbet to redirect on login for debugging
          }
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // Auto login for testing. set the userId to whichever user you want to login as:
  // 1: "Nathan"
  // 2: "Andrew"
  // 3: "Tobi"
  // 4: "Caroline"
  useEffect(() => {
    const id = 1;
    fetch(`/api/user/${id}/object`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  }, []);




  return (
    <>
      <TopNavBar
        handleLinkClick={handleLinkClick}
      />
      <section className="page-content">
        {displayPage === 0 && <LandingPage />}

        {displayPage === 1 && <Schedule />}
        {displayPage === 2 && <ClientList user={user} />}
        {displayPage === 4 && (
          <AppointmentContainer user={user} />
        )}
        <ReviewAppointmentsModal setDisplayPage={setDisplayPage} />
        <AlertModal />
      </section>
      <Footer />
    </>
  );
}

export default App;
