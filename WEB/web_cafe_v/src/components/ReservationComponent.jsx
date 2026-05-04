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
        {isDisabled ? "Submited" : "Submit"}
      </button>
    </form>
  );
}

export function DateTab({
  reservation,
  status,
  actions,
}) {
  /**
   * Date + Time UI controls.
   * We keep the state as Date objects for UX, and compose server datetimes later.
   */
  return (
    <>
      <DateSelector
        selectedDate={reservation.reservationInfo.reservationDate}
        updateDate={actions.setDate}
      />
      <div style={{ height: 12 }} />

      {status.availabilityLoading ? <p>Loading available tables...</p> : null}
      {status.error ? <p style={{ color: "crimson" }}>{status.error}</p> : null}

      <div style={{ height: 12 }} />
      <button
        type="button"
        onClick={() => actions.goToNextTab?.()}
        disabled={status.availabilityLoading || !!status.error}
      >
        Next
      </button>
    </>
  );
}

export function TimeTab({
  reservation,
  status,
  actions,
}) {
  /**
   * Date + Time UI controls.
   * We keep the state as Date objects for UX, and compose server datetimes later.
   */
  return (
    <>
      <TimeSelector
        selectedTime={reservation.reservationInfo.startTime}
        updateTime={actions.setTime}
      />
      <div style={{ height: 12 }} />

      {status.availabilityLoading ? <p>Loading available tables...</p> : null}
      {status.error ? <p style={{ color: "crimson" }}>{status.error}</p> : null}

      <div style={{ height: 12 }} />
      <button
        type="button"
        onClick={() => actions.goToNextTab?.()}
        disabled={status.availabilityLoading || !!status.error}
      >
        Next
      </button>
    </>
  );
}

export function GuestsTab({
  reservation,
  status,
  actions,
}) {
  /**
   * Guests tab:
   * - user picks party size
   * - we show how many tables the rule needs
   * - we show which table IDs are available (IDs only)
   */
  return (
    <>
      <ClampedCounter
        count={reservation.reservationInfo.partySize}
        updateCount={actions.setPeopleCount}
      />

      <div style={{ height: 12 }} />

      <div>
        <p>
          Tables needed: <strong>{reservation.requiredTableCount}</strong>
        </p>
        {status.availabilityLoading ? (
          <p>Loading available tables...</p>
        ) : (
          <>
            <p>
              Available table IDs:{" "}
              {reservation.availableTableIds?.length
                ? reservation.availableTableIds.join(", ")
                : "none"}
            </p>
            <p>
              Selected table IDs:{" "}
              {reservation.selectedTableIds?.length
                ? reservation.selectedTableIds.join(", ")
                : "none"}
            </p>
          </>
        )}

        {reservation.hold?.holdId ? (
          <p>
            Hold active: <strong>{reservation.hold.holdId}</strong>
            {typeof reservation.holdSecondsLeft === "number"
              ? ` (expires in ${reservation.holdSecondsLeft}s)`
              : ""}
          </p>
        ) : (
          <p>{status.holdLoading ? "Holding tables..." : "No active hold yet."}</p>
        )}

        {status.error ? <p style={{ color: "crimson" }}>{status.error}</p> : null}

        <div style={{ height: 12 }} />
        <button
          type="button"
          onClick={() => actions.goToNextTab?.()}
          disabled={
            status.availabilityLoading ||
            status.holdLoading ||
            !!status.error ||
            !reservation.hold?.holdId
          }
        >
          Next
        </button>
      </div>
    </>
  );
}

export function DetailsTab({ reservation, status, actions }) {
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
          {reservation.selectedTableIds?.length
            ? reservation.selectedTableIds.join(", ")
            : "none"}{" "}
          (need {reservation.requiredTableCount})
        </p>
        {reservation.hold?.holdId ? (
          <p>
            Hold active: <strong>{reservation.hold.holdId}</strong>
            {typeof reservation.holdSecondsLeft === "number"
              ? ` (expires in ${reservation.holdSecondsLeft}s)`
              : ""}
          </p>
        ) : (
          <p>{status.holdLoading ? "Holding tables..." : "No active hold."}</p>
        )}
        {status.error ? <p style={{ color: "crimson" }}>{status.error}</p> : null}
      </div>

      <ReservationForm
        reservationInfo={reservation.reservationInfo}
        updateField={actions.updateField}
        onSubmit={actions.handleSubmit}
        isDisabled={status.isLoading || !reservation.hold?.holdId}
      />
    </>
  );
}

export function DoneTab({ actions }) {
  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <p>Thank you for reserving with us</p>
      </div>
      {actions?.startOver ? (
        <button type="button" onClick={actions.startOver}>
          New reservation
        </button>
      ) : null}
    </>
  );
}