import React, { useState } from "react";
import GeneratePDF from "./GeneratePDF";
import InvoiceModal from "../../Modals/InvoiceModal";
import { useAlertModal } from "../../contextProviders/useAlertModalContext";

const InvoiceGenerator = ({
  reviewedAppointments,
  checkedAppointments,
  clientRate,
  clientObj,
  user,
  setSelectedClient,
  setCheckedAppointments,
}) => {

  const [generatedPDF, setGeneratedPDF] = useState(null);
  const [generatedAttachment, setGeneratedAttachment] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);
  const { showAlert, hideAlert } = useAlertModal();

  const handleConfirmAndSend = async () => {
    try {
      const email = clientObj.email;
      const userName = user.firstName;
      const clientName = clientObj.name;

      const formData = new FormData();
      formData.append("email", email);
      formData.append("userName", userName);
      formData.append("clientName", clientName);
      formData.append("pdf", generatedAttachment);

      const requestOptions = {
        method: "POST",
        body: formData,
      };

      const invoiceData = {
        userId: user.id,
        clientId: clientObj.id,
        totalCents: grandTotal,
        appointmentIds: checkedAppointments,
      };

      const invoiceDataPostRequest = {
        method: "POST",
        body: JSON.stringify(invoiceData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      // Wait for the invoice creation request to complete
      await fetch("/api/invoice", invoiceDataPostRequest);

      const title = "Woohoo !!";
      const message = "INVOICE SENT";
      const onClose = handleCloseModal();
      showAlert({ title, message, onClose });
      // Wait for the email sending request to complete
      await fetch("/api/send_email/invoice", requestOptions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCloseModal = () => {
    setGeneratedPDF(null);
    setSelectedClient(null);
    setCheckedAppointments([]);
    hideAlert();
  };

  const handleBackToAppointments = () => {
    setGeneratedPDF(null);
  };

  return (
    <div>
      <GeneratePDF
        reviewedAppointments={reviewedAppointments}
        checkedAppointments={checkedAppointments}
        clientRate={clientRate}
        clientObj={clientObj}
        user={user}
        setGeneratedPDF={setGeneratedPDF}
        setGeneratedAttachment={setGeneratedAttachment}
        setGrandTotal={setGrandTotal}
      />
      <InvoiceModal generatedPDF={generatedPDF} handleConfirmAndSend={handleConfirmAndSend} handleBackToAppointments={handleBackToAppointments} />
    </div>
  );
};

export default InvoiceGenerator;
