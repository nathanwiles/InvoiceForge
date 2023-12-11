import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../styles/InvoiceGeneratedModal.scss";
import { useInvoiceModal } from "../../contextProviders/useInvoiceModalContext";

const GeneratePDF = ({
  reviewedAppointments,
  checkedAppointments,
  clientRate,
  clientObj,
  user,
  setGeneratedPDF,
  setGeneratedAttachment,
  setGrandTotal
}) => {

  const { showInvoice } = useInvoiceModal();

  const generateInvoice = () => {
    if (checkedAppointments.length === 0) {
      return;
    }

    // Create a new jsPDF instance
    const pdf = new jsPDF();

    pdf.setLineWidth(0.5);
    pdf.setDrawColor("black");
    const overlineY = 23;
    pdf.line(20, overlineY, 78, overlineY); // Draw the line

    // styled text
    pdf.setFont("Times");
    pdf.setFontSize(30);
    pdf.setTextColor(0, 0, 0);

    pdf.text(20, 32, "InvoiceForge");

    // user details
    const userDetails = user.address;
    pdf.setFontSize(12);
    pdf.setFont("Times");
    pdf.text(
      `
      ${user.firstName} ${user.lastName}
      ${userDetails.line1}
      ${userDetails.city}, ${userDetails.province} ${userDetails.postalCode}
      204-444-888
      `,
      150,
      20
    );

    // client details
    let clientDetails = clientObj.address;
    if (!clientDetails) {
      clientDetails = {
        line1: "",
        city: "",
        province: "",
        postalCode: "",
      };
    }
    pdf.text(
      `
      BILL TO:
      ${clientObj.name}
      ${clientDetails.line1}
      ${clientDetails.city} ${clientDetails.city ? "," : ""} ${clientDetails.province
      } ${clientDetails.postalCode}
      `,
      20,
      55
    );

    // styles for the table
    pdf.setFillColor(200, 220, 255);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("Times", "bold");

    pdf.autoTable({
      head: [["Description", "Date", "Rate ($)", "Hours", "Total ($)"]],

      body: reviewedAppointments
        .filter((appointment) => checkedAppointments.includes(appointment.id))
        .map((appointment) => {
          const rate = appointment.appointmentRateCents
            ? appointment.appointmentRateCents
            : clientRate
              ? clientRate
              : user.standardRateCents;
          const total = (rate * appointment.confirmedHours) / 100;

          return [
            appointment.notes,
            appointment.date,
            `${rate / 100}`,

            appointment.confirmedHours,
            `${total}`,
          ];
        }),
      startY: 90,
      theme: "striped",
    });

    // Calculate and add the total amount
    const subTotalAmount = reviewedAppointments
      .filter((appointment) => checkedAppointments.includes(appointment.id))
      .reduce((total, appointment) => {
        const { appointmentRateCents } = appointment;
        const rate = appointmentRateCents
          ? appointmentRateCents
          : clientRate
            ? clientRate
            : user.standardRateCents;
        return total + (appointment.confirmedHours * rate) / 100;
      }, 0);

    const gstRate = 0.05;
    const gstAmount = subTotalAmount * gstRate;

    // Add GST to the grand total
    const grandTotal = subTotalAmount + gstAmount;
    const grandTotalCents = grandTotal * 100;
    setGrandTotal(grandTotalCents);

    pdf.text(`Subtotal`, 140, pdf.autoTable.previous.finalY + 15);

    pdf.text(
      `$${subTotalAmount.toFixed(2)}`,
      170,
      pdf.autoTable.previous.finalY + 15
    );

    // Add GST information
    pdf.text(`Tax (5%)`, 140, pdf.autoTable.previous.finalY + 25);

    pdf.text(
      `$${gstAmount.toFixed(2)}`,
      170,
      pdf.autoTable.previous.finalY + 25
    );

    pdf.setFillColor(255, 255, 255);
    pdf.setFont("Times", "bold");
    pdf.setFontSize(14);

    pdf.text(`Grand Total`, 140, pdf.autoTable.previous.finalY + 35);

    pdf.text(
      `$${grandTotal.toFixed(2)}`,
      170,
      pdf.autoTable.previous.finalY + 35
    );
    // Save the PDF
    const generatedPDFData = pdf.output("blob");
    setGeneratedPDF(URL.createObjectURL(generatedPDFData));
    setGeneratedAttachment(
      new File([generatedPDFData], "invoice.pdf", { type: "application/pdf" })
    );
    showInvoice();
  };

  return <>{checkedAppointments.length > 0 && (<button className="forge-invoice-button" onClick={generateInvoice}>Forge Invoice</button>)}</>;
};

export default GeneratePDF;
