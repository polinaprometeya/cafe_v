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

export function GuestsTab({
  reservationInfo,
  setPeopleCount,
  requiredTableCount,
  availableTableIds,
  availabilityLoading,
  error,
}) {
  return (
    <>
      <ClampedCounter count={reservationInfo.partySize} updateCount={setPeopleCount} />

      <div style={{ height: 12 }} />

      <div>
        <p>
          Tables needed: <strong>{requiredTableCount}</strong>
        </p>
        {availabilityLoading ? (
          <p>Loading available tables...</p>
        ) : (
          <>
            <p>
              Available table IDs:{" "}
              {availableTableIds.length ? availableTableIds.join(", ") : "none"}
            </p>
          </>
        )}

        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      </div>
    </>
  );
}

export function DetailsTab({ reservationInfo, updateField, handleSubmit, handleHold, hold, holdSecondsLeft, requiredTableCount, selectedTableIds, availabilityLoading, holdLoading, error, isLoading }) {
  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <p>
          Selected table IDs:{" "}
          {selectedTableIds.length ? selectedTableIds.join(", ") : "none"} (need{" "}
          {requiredTableCount})
        </p>
        <button
          type="button"
          onClick={handleHold}
          disabled={availabilityLoading || holdLoading}
        >
          {holdLoading ? "Holding..." : "Hold tables"}
        </button>
        {hold?.holdId ? (
          <p>
            Hold active: <strong>{hold.holdId}</strong>
            {typeof holdSecondsLeft === "number" ? ` (expires in ${holdSecondsLeft}s)` : ""}
          </p>
        ) : (
          <p>No active hold.</p>
        )}
        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      </div>

      <ReservationForm
        reservationInfo={reservationInfo}
        updateField={updateField}
        onSubmit={handleSubmit}
        isDisabled={isLoading || !hold?.holdId}
      />
    </>
  );
}