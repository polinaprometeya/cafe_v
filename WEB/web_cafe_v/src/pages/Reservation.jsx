import { useState } from "react";
import {
  DateSelector,
  PeopleCounter,
  ReservationForm,
  TimeSelector,
} from "../components/ReservationComponent";
import { createReservation } from "../service/routes";
import "./Page.css";

export default function Reservation() {
  const [selectedHeaderTopic, setSelectedHeaderTopic] = useState("date");
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initStartTime = new Date();
  initStartTime.setHours(20, 0, 0, 0);
  const initEndTime = new Date();
  initEndTime.setHours(22, 0, 0, 0);

  const [reservationInfo, setReservationInfo] = useState({
    reservationDate: new Date(),
    startTime: initStartTime,
    endTime: initEndTime,
    email: "",
    reservee: "",
    phoneNumber: "",
    partySize: 1,
  });

  const updateField = (field, value) => {
    setReservationInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const setPeopleCount = (partySize) => updateField("partySize", partySize);

  const setTime = (startTime) => {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);
    updateField("startTime", startTime);
    updateField("endTime", endTime);
  };

  const setDate = (date) => {
    if (date === undefined) return;
    updateField("reservationDate", date);
  };

  function formatDateYYYYMMDD(date) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function formatTimeHHMM(date) {
    const d = new Date(date);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading === true) return;

    setIsLoading(true);
    const payload = {
      ...reservationInfo,
      reservationDate: formatDateYYYYMMDD(reservationInfo.reservationDate),
      startTime: formatTimeHHMM(reservationInfo.startTime),
      endTime: formatTimeHHMM(reservationInfo.endTime),
      phoneNumber: String(reservationInfo.phoneNumber),
    };

    try {
      const saveReservation = await createReservation(payload);
      if (saveReservation) setToast(saveReservation);
    } finally {
      setIsLoading(false);
    }
  };

  function headerTabSelect(clickButton) {
    setSelectedHeaderTopic(clickButton);
  }

  let content = null;
  if (selectedHeaderTopic === "date") {
    content = (
      <>
        <DateSelector
          selectedDate={reservationInfo.reservationDate}
          updateDate={setDate}
        />
        <div style={{ height: 12 }} />
        <TimeSelector selectedTime={reservationInfo.startTime} updateTime={setTime} />
      </>
    );
  } else if (selectedHeaderTopic === "guests") {
    content = (
      <PeopleCounter count={reservationInfo.partySize} updateCount={setPeopleCount} />
    );
  } else if (selectedHeaderTopic === "reservation") {
    content = (
      <ReservationForm
        reservationInfo={reservationInfo}
        updateField={updateField}
        onSubmit={handleSubmit}
        isDisabled={isLoading}
      />
    );
  }

  return (
    <main>
      {toast != null && <p className="toast">{toast}</p>}

      <menu className="headerTabs" id="headerTabs">
        <button onClick={() => headerTabSelect("date")}>Date/Time</button>
        <button onClick={() => headerTabSelect("guests")}>Guests</button>
        <button onClick={() => headerTabSelect("reservation")}>Details</button>
      </menu>

      {content}
    </main>
  );
}

