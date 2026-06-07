import { useState } from "react";
import API from "../api/axios";

function BookingForm({ vehicleId }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const bookVehicle = async () => {
    try {
      await API.post("/bookings", {
        vehicleId,
        startDate,
        endDate,
      });

      alert("Booking successful");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <input type="date" onChange={(e) => setStartDate(e.target.value)} />

      <input type="date" onChange={(e) => setEndDate(e.target.value)} />

      <button onClick={bookVehicle}>Book Now</button>
    </div>
  );
}

export default BookingForm;
