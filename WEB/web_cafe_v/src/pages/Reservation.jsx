import { useEffect, useMemo, useRef, useState } from "react";
import { DateFormatterYYYYMMDD, TimeFormatterHHMM } from "../components/Utility";
import {
  createReservation,
  holdReservation,
  releaseReservationHold,
  tableAvailability,
} from "../service/routes";
import * as ReservationComponents from "../components/ReservationComponent";
import "./Page.css";

export default function Reservation() {
  /**
   * Reservation page (frontend state machine)
   *
   * UX: user picks date/time -> picks guest amount -> enters details -> submits
   *
   * Backend contract (important):
   * - `/tables/availability` expects canonical datetimes: { start_time, end_time }
   *   and returns: { available_table_ids: number[] }
   * - `/reservation-holds` expects: { start_time, end_time, guests_amount, table_ids, ttl_seconds? }
   *   and returns: { hold_id, expires_at }
   * - `/reservation` expects: { guests_amount, date, start_time, end_time, reservation_name, reservation_number, table_ids }
   *
   * Best practice used here:
   * - Keep Date/Time separate in UI state (Date objects)
   * - Convert to canonical datetime strings only at the API boundary
   */
  const [selectedHeaderTopic, setSelectedHeaderTopic] = useState("date");
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [holdLoading, setHoldLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableTableIds, setAvailableTableIds] = useState([]);
  const [selectedTableIds, setSelectedTableIds] = useState([]);
  const [hold, setHold] = useState(null); // { holdId, expiresAt }
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(null);
  const lastAvailabilityKeyRef = useRef(null);
  const lastHoldKeyRef = useRef(null);

  const initStartTime = new Date();
  initStartTime.setHours(20, 0, 0, 0);
  const initEndTime = new Date();
  initEndTime.setHours(22, 0, 0, 0);

  //create an empty reservation
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

  const requiredTableCount = useMemo(() => {
    // Simple rule:
    // 1-2 guests => 1 table, 3-4 => 2 tables, 5-6 => 3 tables, 7-8 => 4 tables
    return Math.ceil(reservationInfo.partySize / 2);
  }, [reservationInfo.partySize]);

  const clearHold = () => {
    setHold(null);
    setHoldSecondsLeft(null);
  };

  const releaseHoldIfAny = async () => {
    const holdId = hold?.holdId;
    if (!holdId) return;
    try {
      await releaseReservationHold(holdId);
    } catch {
      // Best-effort release.
    } finally {
      clearHold();
    }
  };

  const setPeopleCount = (partySize) => {
    updateField("partySize", partySize);
    void releaseHoldIfAny();
    lastHoldKeyRef.current = null;
  };

  const setTime = (startTime) => {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);
    updateField("startTime", startTime);
    updateField("endTime", endTime);
    void releaseHoldIfAny();
    lastAvailabilityKeyRef.current = null;
    lastHoldKeyRef.current = null;
  };

  const setDate = (date) => {
    if (date === undefined) return;
    updateField("reservationDate", date);
    void releaseHoldIfAny();
    lastAvailabilityKeyRef.current = null;
    lastHoldKeyRef.current = null;
  };

  const reservationDateStr = useMemo(
    () => DateFormatterYYYYMMDD(reservationInfo.reservationDate), // "YYYY-MM-DD"
    [reservationInfo.reservationDate]
  );
  const startTimeStr = useMemo(
    () => TimeFormatterHHMM(reservationInfo.startTime), // "HH:MM"
    [reservationInfo.startTime]
  );
  const endTimeStr = useMemo(
    () => TimeFormatterHHMM(reservationInfo.endTime), // "HH:MM"
    [reservationInfo.endTime]
  );

  const start_time = `${reservationDateStr} ${startTimeStr}:00`;
  const end_time = `${reservationDateStr} ${endTimeStr}:00`;
  const date = `${reservationDateStr} 00:00:00`;

  const availabilityKey = `${start_time}|${end_time}`;
  const holdKey = `${start_time}|${end_time}|${reservationInfo.partySize}|${selectedTableIds.join(
    ","
  )}`;

  // Availability fetch when date/time changes (and when tab is active).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const isRelevantTab =
        selectedHeaderTopic === "date" ||
        selectedHeaderTopic === "guests" ||
        selectedHeaderTopic === "reservation";
      if (!isRelevantTab) return;
      if (lastAvailabilityKeyRef.current === availabilityKey) return;

      setError("");
      setAvailabilityLoading(true);

      try {
        const res = await tableAvailability({ start_time, end_time });
        if (cancelled) return;

        const rawIds = Array.isArray(res?.available_table_ids) ? res.available_table_ids : [];
        const ids = rawIds
          .map(Number)
          .filter((n) => Number.isFinite(n))
          .sort((a, b) => a - b);

        lastAvailabilityKeyRef.current = availabilityKey;
        setAvailableTableIds(ids);
        setSelectedTableIds(ids.slice(0, requiredTableCount));

        // Availability changed => the old hold (if any) is no longer valid.
        clearHold();
        lastHoldKeyRef.current = null;

        if (ids.length === 0) {
          setError("No tables available for the selected time.");
        } else if (ids.length < requiredTableCount) {
          setError(`Not enough tables available for ${reservationInfo.partySize} guest(s).`);
        }
      } catch {
        if (!cancelled) setError("Failed to load available tables.");
      } finally {
        if (!cancelled) setAvailabilityLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [
    selectedHeaderTopic,
    availabilityKey,
    start_time,
    end_time,
    requiredTableCount,
    reservationInfo.partySize,
  ]);

  // Create / refresh hold on the Guests tab (and keep it for the Details tab).
  useEffect(() => {
    if (selectedHeaderTopic !== "guests") return;
    if (availabilityLoading || holdLoading) return;
    if (hold?.holdId) return;
    if (selectedTableIds.length !== requiredTableCount) return;
    if (error) return;

    // No-op if we already created this specific hold.
    if (lastHoldKeyRef.current === holdKey && hold?.holdId) return;

    (async () => {
      try {
        setHoldLoading(true);
        const res = await holdReservation({
          start_time,
          end_time,
          guests_amount: reservationInfo.partySize,
          table_ids: selectedTableIds,
          ttl_seconds: 300,
        });

        const holdId = res?.hold_id ?? null;
        const expiresAt = res?.expires_at ?? null;

        if (!holdId || !expiresAt) {
          clearHold();
          // This usually means backend returned a different shape than expected.
          setError("Hold request succeeded, but response did not include hold_id/expires_at.");
          return;
        }

        setHold({ holdId, expiresAt });
        lastHoldKeyRef.current = holdKey;
      } catch {
        setError("Could not hold tables. Please try again.");
      } finally {
        setHoldLoading(false);
      }
    })();
  }, [
    selectedHeaderTopic,
    availabilityLoading,
    holdLoading,
    hold?.holdId,
    requiredTableCount,
    selectedTableIds,
    holdKey,
    error,
    start_time,
    end_time,
    reservationInfo.partySize,
  ]);

  // Hold countdown UI
  useEffect(() => {
    if (!hold?.expiresAt) return;

    const tick = () => {
      const expiresMs = new Date(hold.expiresAt).getTime();
      const nowMs = Date.now();
      const seconds = Math.max(0, Math.floor((expiresMs - nowMs) / 1000));
      setHoldSecondsLeft(seconds);
      if (seconds === 0) {
        clearHold();
        setError("Hold expired. Please hold tables again.");
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hold?.expiresAt]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!hold?.holdId) {
      setError("Please hold tables before submitting.");
      return;
    }

    /**
     *  final reservation create.
     * Backend re-checks availability, so even if the hold failed/expired,
     * it will not silently create an invalid reservation.
     */
    const payload = {
      guests_amount: reservationInfo.partySize,
      date,
      start_time,
      end_time,
      reservation_name: reservationInfo.reservee,
      reservation_number: String(reservationInfo.phoneNumber),
      table_ids: selectedTableIds,
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
      <ReservationComponents.DateTimeTab 
        reservationInfo={reservationInfo} 
        setDate={setDate} 
        setTime={setTime}
        availabilityLoading={availabilityLoading}
        error={error}
        goToNextTab={() => setSelectedHeaderTopic("guests")}
      />
    ),
    guests: (
      <ReservationComponents.GuestsTab 
        reservationInfo={reservationInfo} 
        setPeopleCount={setPeopleCount}
        requiredTableCount={requiredTableCount}
        availableTableIds={availableTableIds}
        selectedTableIds={selectedTableIds}
        availabilityLoading={availabilityLoading}
        hold={hold}
        holdSecondsLeft={holdSecondsLeft}
        holdLoading={holdLoading}
        error={error}
        goToNextTab={() => setSelectedHeaderTopic("reservation")}
      />
    ),
    reservation: (
      <ReservationComponents.DetailsTab
        reservationInfo={reservationInfo}
        updateField={updateField}
        handleSubmit={handleSubmit}
        hold={hold}
        holdSecondsLeft={holdSecondsLeft}
        requiredTableCount={requiredTableCount}
        selectedTableIds={selectedTableIds}
        availabilityLoading={availabilityLoading}
        holdLoading={holdLoading}
        error={error}
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

      <div className="tabContent">{tabs[selectedHeaderTopic]}</div>
    </main>
  );
}

