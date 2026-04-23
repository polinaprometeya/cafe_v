import { useState } from "react";
import { DateFormatterYYYYMMDD, TimeFormatterHHMM } from "../components/Utility";
import { createReservation } from "../service/routes";
import {
  DateTimeTab,
  DetailsTab,
  GuestsTab,
} from "../components/ReservationComponent";
import "./Page.css";

export default function Reservation() {
  const [selectedHeaderTopic, setSelectedHeaderTopic] = useState("date");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const payload = {
      ...reservationInfo,
      reservationDate: DateFormatterYYYYMMDD(reservationInfo.reservationDate),
      startTime: TimeFormatterHHMM(reservationInfo.startTime),
      endTime: TimeFormatterHHMM(reservationInfo.endTime),
      phoneNumber: String(reservationInfo.phoneNumber),
    };

    try {
      setIsLoading(true);
      await createReservation(payload);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = {
    date: (
      <DateTimeTab reservationInfo={reservationInfo} setDate={setDate} setTime={setTime} />
    ),
    guests: (
      <GuestsTab reservationInfo={reservationInfo} setPeopleCount={setPeopleCount} />
    ),
    reservation: (
      <DetailsTab
        reservationInfo={reservationInfo}
        updateField={updateField}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    ),
  };

  return (
    <main>
      <menu className="headerTabs" id="headerTabs">
        <button onClick={() => setSelectedHeaderTopic("date")}>Date/Time</button>
        <button onClick={() => setSelectedHeaderTopic("guests")}>Guests</button>
        <button onClick={() => setSelectedHeaderTopic("reservation")}>Details</button>
      </menu>

      {tabs[selectedHeaderTopic]}
    </main>
  );
}

