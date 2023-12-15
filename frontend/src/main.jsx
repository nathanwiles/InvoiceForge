/**
 * The main entry point of the application.
 * Renders the App component wrapped in context providers.
 *
 * @module Main
 * @returns {JSX.Element} The rendered App component
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ReviewAppointmentsProvider } from "./components/ReviewAppointments/Context/UseReviewAppointmentsContext";
import { UserContextProvider } from "./contextProviders/useUserContext";
import { AlertModalProvider } from './contextProviders/useAlertModalContext.jsx';
import { CalendarProvider } from './contextProviders/calendarContext.jsx';
import { ClientsContextProvider } from './contextProviders/clientsContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AlertModalProvider>
      <UserContextProvider>
        <ClientsContextProvider>
          <ReviewAppointmentsProvider>
            <CalendarProvider>
              <App />
            </CalendarProvider>
          </ReviewAppointmentsProvider>
        </ClientsContextProvider>
      </UserContextProvider>
    </AlertModalProvider>
  </React.StrictMode>,
);
