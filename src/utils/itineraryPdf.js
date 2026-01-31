import jsPDF from "jspdf";

export function generateItineraryPDF(booking) {
  const doc = new jsPDF();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("FlyBook - Booking Confirmation", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

  // Booking block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Booking Details", 14, 40);

  doc.setFont("helvetica", "normal");
  doc.text(`PNR: ${booking?.pnr || "-"}`, 14, 48);
  doc.text(`Booking Status: ${booking?.bookingStatus || "-"}`, 14, 55);
  doc.text(`Payment Status: ${booking?.paymentStatus || "-"}`, 14, 62);
  doc.text(`Amount: INR ${booking?.amount || "-"}`, 14, 69);

  // Flight block
  doc.setFont("helvetica", "bold");
  doc.text("Flight Details", 14, 84);

  doc.setFont("helvetica", "normal");
  const flight = booking?.flight || {};
  doc.text(`Route: ${flight.depIata || "-"} → ${flight.arrIata || "-"}`, 14, 92);
  doc.text(`Flight: ${flight.flightIata || flight.flightNumber || "-"}`, 14, 99);
  doc.text(`Airline: ${flight.airlineName || "-"}`, 14, 106);

  const depTime = flight.depScheduled ? new Date(flight.depScheduled).toLocaleString() : "-";
  const arrTime = flight.arrScheduled ? new Date(flight.arrScheduled).toLocaleString() : "-";

  doc.text(`Departure: ${flight.depAirport || "-"} (${flight.depIata || "-"})`, 14, 113);
  doc.text(`Dep Time: ${depTime}`, 14, 120);

  doc.text(`Arrival: ${flight.arrAirport || "-"} (${flight.arrIata || "-"})`, 14, 127);
  doc.text(`Arr Time: ${arrTime}`, 14, 134);

  doc.text(`Cabin Class: ${booking?.cabinClass || "-"}`, 14, 141);

  // Passenger block
  doc.setFont("helvetica", "bold");
  doc.text("Passengers", 14, 156);

  doc.setFont("helvetica", "normal");
  const passengers = booking?.passengers || [];
  if (!passengers.length) {
    doc.text("No passenger data available", 14, 164);
  } else {
    let y = 164;
    passengers.forEach((p, idx) => {
      doc.text(`${idx + 1}. ${p.fullName || p.name || "Passenger"}`, 14, y);
      y += 7;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  }

  // Footer note
  doc.setFontSize(10);
  doc.text("Note: This is a system-generated itinerary. Please carry a valid ID at airport.", 14, 285);

  // Download
  const fileName = `FlyBook_Itinerary_${booking?.pnr || booking?._id || "booking"}.pdf`;
  doc.save(fileName);
}
