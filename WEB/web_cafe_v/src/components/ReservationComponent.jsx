import {
  ClampedCounter,
  DateSelector,
  TimeSelector,
} from "./Utility";

export function ReservationForm({
  reservationInfo,
  updateField,
  onSubmit,
  isDisabled,
}) {
  return (
    <form className="Form" onSubmit={onSubmit}>
      <input
        type="hidden"
        name="reservationDate"
        value={reservationInfo.reservationDate}
      />
      <input type="hidden" name="startTime" value={reservationInfo.startTime} />
      <input type="hidden" name="endTime" value={reservationInfo.endTime} />
      <input type="hidden" name="partySize" value={reservationInfo.partySize} />

      <label>
        Reservation under name :{" "}
        <input
          name="reservee"
          type="text"
          value={reservationInfo.reservee}
          onChange={(e) => updateField("reservee", e.target.value)}
          placeholder={"Full Name"}
          disabled={isDisabled}
        />
      </label>

      <label>
        Email :{" "}
        <input
          name="email"
          type="text"
          value={reservationInfo.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder={"Email"}
          disabled={isDisabled}
        />
      </label>

      <label>
        Mobil Number :{" "}
        <input
          name="phoneNumber"
          type="number"
          value={reservationInfo.phoneNumber}
          onChange={(e) => updateField("phoneNumber", e.target.value)}
          placeholder={"Mobil Number"}
          disabled={isDisabled}
        />
      </label>

      <button className="submit" type="submit" disabled={isDisabled}>
        {isDisabled ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export function DateTimeTab({ reservationInfo, setDate, setTime }) {
  return (
    <>
      <DateSelector selectedDate={reservationInfo.reservationDate} updateDate={setDate} />
      <div style={{ height: 12 }} />
      <TimeSelector selectedTime={reservationInfo.startTime} updateTime={setTime} />
    </>
  );
}

export function GuestsTab({ reservationInfo, setPeopleCount }) {
  return (
    <ClampedCounter count={reservationInfo.partySize} updateCount={setPeopleCount} />
  );
}

export function DetailsTab({ reservationInfo, updateField, handleSubmit, isLoading }) {
  return (
    <ReservationForm
      reservationInfo={reservationInfo}
      updateField={updateField}
      onSubmit={handleSubmit}
      isDisabled={isLoading}
    />
  );
}