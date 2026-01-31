export function printItinerary(booking) {
  const flight = booking?.flight || {};
  const depTime = flight.depScheduled ? new Date(flight.depScheduled).toLocaleString() : "-";
  const arrTime = flight.arrScheduled ? new Date(flight.arrScheduled).toLocaleString() : "-";

  const passengers = (booking?.passengers || [])
    .map((p, i) => `<li>${i + 1}. ${p.fullName || p.name || "Passenger"}</li>`)
    .join("");

  const html = `
  <html>
    <head>
      <title>FlyBook Itinerary - ${booking?.pnr || ""}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        .box { border: 1px solid #ddd; padding: 16px; border-radius: 10px; margin-top: 12px; }
        h1 { margin: 0; }
        .row { margin: 6px 0; }
        .muted { color: #555; font-size: 13px; }
      </style>
    </head>
    <body>
      <h1>FlyBook - Booking Confirmation</h1>
      <p class="muted">Generated: ${new Date().toLocaleString()}</p>

      <div class="box">
        <h2>Booking</h2>
        <div class="row"><b>PNR:</b> ${booking?.pnr || "-"}</div>
        <div class="row"><b>Status:</b> ${booking?.bookingStatus || "-"}</div>
        <div class="row"><b>Payment:</b> ${booking?.paymentStatus || "-"}</div>
        <div class="row"><b>Amount:</b> INR ${booking?.amount || "-"}</div>
      </div>

      <div class="box">
        <h2>Flight</h2>
        <div class="row"><b>Route:</b> ${flight.depIata || "-"} → ${flight.arrIata || "-"}</div>
        <div class="row"><b>Flight:</b> ${flight.flightIata || flight.flightNumber || "-"}</div>
        <div class="row"><b>Airline:</b> ${flight.airlineName || "-"}</div>
        <div class="row"><b>Departure:</b> ${flight.depAirport || "-"} (${flight.depIata || "-"})</div>
        <div class="row"><b>Dep Time:</b> ${depTime}</div>
        <div class="row"><b>Arrival:</b> ${flight.arrAirport || "-"} (${flight.arrIata || "-"})</div>
        <div class="row"><b>Arr Time:</b> ${arrTime}</div>
        <div class="row"><b>Cabin:</b> ${booking?.cabinClass || "-"}</div>
      </div>

      <div class="box">
        <h2>Passengers</h2>
        <ol>${passengers || "<li>No passenger data</li>"}</ol>
      </div>

      <p class="muted">Note: Carry valid ID proof at airport.</p>
      <script>
        window.onload = () => window.print();
      </script>
    </body>
  </html>
  `;

  const win = window.open("", "_blank", "width=900,height=700");
  win.document.open();
  win.document.write(html);
  win.document.close();
}
