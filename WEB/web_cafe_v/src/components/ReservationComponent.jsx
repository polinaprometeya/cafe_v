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
  /**
   * This is the "Details" form.
   * It does NOT choose tables. Table choice/hold happens in `Reservation.jsx`.
   *
   * `isDisabled` is used to:
   * - prevent duplicate submits
   * - ensure user can't submit without an active hold
   */
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

export function DateTimeTab({
  reservationInfo,
  setDate,
  setTime,
  availabilityLoading,
  error,
  goToNextTab,
}) {
  /**
   * Date + Time UI controls.
   * We keep the state as Date objects for UX, and compose server datetimes later.
   */
  return (
    <>
      <DateSelector selectedDate={reservationInfo.reservationDate} updateDate={setDate} />
      <div style={{ height: 12 }} />
      <TimeSelector selectedTime={reservationInfo.startTime} updateTime={setTime} />
      <div style={{ height: 12 }} />

      {availabilityLoading ? <p>Loading available tables...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div style={{ height: 12 }} />
      <button
        type="button"
        onClick={() => goToNextTab?.()}
        disabled={availabilityLoading || !!error}
      >
        Next
      </button>
    </>
  );
}

export function GuestsTab({
  reservationInfo,
  setPeopleCount,
  requiredTableCount,
  availableTableIds,
  selectedTableIds,
  availabilityLoading,
  hold,
  holdSecondsLeft,
  holdLoading,
  error,
  goToNextTab,
}) {
  /**
   * Guests tab:
   * - user picks party size
   * - we show how many tables the rule needs
   * - we show which table IDs are available (IDs only)
   */
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
            <p>
              Selected table IDs:{" "}
              {selectedTableIds?.length ? selectedTableIds.join(", ") : "none"}
            </p>
          </>
        )}

        {hold?.holdId ? (
          <p>
            Hold active: <strong>{hold.holdId}</strong>
            {typeof holdSecondsLeft === "number" ? ` (expires in ${holdSecondsLeft}s)` : ""}
          </p>
        ) : (
          <p>{holdLoading ? "Holding tables..." : "No active hold yet."}</p>
        )}

        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

        <div style={{ height: 12 }} />
        <button
          type="button"
          onClick={() => goToNextTab?.()}
          disabled={availabilityLoading || holdLoading || !!error || !hold?.holdId}
        >
          Next
        </button>
      </div>
    </>
  );
}

export function DetailsTab({ reservationInfo, updateField, handleSubmit, hold, holdSecondsLeft, requiredTableCount, selectedTableIds, availabilityLoading, holdLoading, error, isLoading }) {
  /**
   * Details tab:
   * - shows selected table IDs (auto-picked)
   * - shows hold state (auto-created when entering this tab)
   * - enables submit only when hold exists
   */
  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <p>
          Selected table IDs:{" "}
          {selectedTableIds.length ? selectedTableIds.join(", ") : "none"} (need{" "}
          {requiredTableCount})
        </p>
        {hold?.holdId ? (
          <p>
            Hold active: <strong>{hold.holdId}</strong>
            {typeof holdSecondsLeft === "number" ? ` (expires in ${holdSecondsLeft}s)` : ""}
          </p>
        ) : (
          <p>{holdLoading ? "Holding tables..." : "No active hold."}</p>
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