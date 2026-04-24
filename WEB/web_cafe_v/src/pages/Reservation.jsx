import { useCallback, useEffect, useMemo, useState } from "react";
import { DateFormatterYYYYMMDD, TimeFormatterHHMM } from "../components/Utility";
import { createReservation, holdReservation, tableAvailability } from "../service/routes";
import {
  DateTimeTab,
  DetailsTab,
  GuestsTab,
} from "../components/ReservationComponent";
import "./Page.css";

export default function Reservation() {
  const [selectedHeaderTopic, setSelectedHeaderTopic] = useState("date");
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [holdLoading, setHoldLoading] = useState(false);
  const [error, setError] = useState("");

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

  const [availableTableIds, setAvailableTableIds] = useState([]);
  const [selectedTableIds, setSelectedTableIds] = useState([]);
  const [hold, setHold] = useState(null); // { holdId, expiresAt }
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(null);

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

  const setPeopleCount = (partySize) => {
    updateField("partySize", partySize);
    clearHold();
  };

  const setTime = (startTime) => {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);
    updateField("startTime", startTime);
    updateField("endTime", endTime);
    clearHold();
  };

  const setDate = (date) => {
    if (date === undefined) return;
    updateField("reservationDate", date);
    clearHold();
  };

  const buildDateTimes = () => {
    const reservationDate = DateFormatterYYYYMMDD(reservationInfo.reservationDate); // "YYYY-MM-DD"
    const startTime = TimeFormatterHHMM(reservationInfo.startTime); // "HH:MM"
    const endTime = TimeFormatterHHMM(reservationInfo.endTime); // "HH:MM"

    return {
      date: `${reservationDate} 00:00:00`,
      start_time: `${reservationDate} ${startTime}:00`,
      end_time: `${reservationDate} ${endTime}:00`,
    };
  };

  const normalizeIds = (rawIds) => {
    return [...rawIds]
      .map(Number)
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);
  };

  const autoPickTables = (ids, count) => ids.slice(0, count);

  const fetchAvailableTableIds = useCallback(async () => {
    const { start_time, end_time } = buildDateTimes();
    const res = await tableAvailability({ start_time, end_time });
    const ids = Array.isArray(res?.available_table_ids) ? res.available_table_ids : [];
    return normalizeIds(ids);
    // buildDateTimes uses reservationInfo; keep deps on the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationInfo.reservationDate, reservationInfo.startTime, reservationInfo.endTime]);

  const loadAvailability = useCallback(async () => {
    setError("");
    setAvailabilityLoading(true);

    try {
      const ids = await fetchAvailableTableIds();

      setAvailableTableIds(ids);
      // Auto-select tables based on guest amount rule (requiredTableCount)
      const autoSelected = autoPickTables(ids, requiredTableCount);
      setSelectedTableIds(autoSelected);

      if (ids.length === 0) {
        setError("No tables available for the selected time.");
      } else if (ids.length < requiredTableCount) {
        setError(
          `Not enough tables available for ${reservationInfo.partySize} guest(s) at the selected time.`
        );
      }
    } catch (e) {
      setError("Failed to load available tables.");
    } finally {
      setAvailabilityLoading(false);
    }
  }, [fetchAvailableTableIds, requiredTableCount, reservationInfo.partySize]);

  // 1) Availability fetch whenever date/time changes.
  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  // 2) Keep selection valid when availability changes (e.g. refresh).
  useEffect(() => {
    setSelectedTableIds((prev) => {
      const setAvail = new Set(availableTableIds);
      const filtered = prev.filter((id) => setAvail.has(id));
      const padded =
        filtered.length >= requiredTableCount
          ? filtered.slice(0, requiredTableCount)
          : [...filtered, ...availableTableIds.filter((id) => !filtered.includes(id)).slice(0, requiredTableCount - filtered.length)];

      return padded;
    });
    // availability change should invalidate hold too
    clearHold();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTableIds, requiredTableCount]);

  // 4) Hold countdown UI
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

  const handleHold = async () => {
    if (holdLoading || availabilityLoading) return;
    setError("");

    if (selectedTableIds.length !== requiredTableCount) {
      setError(`Please select exactly ${requiredTableCount} table(s).`);
      return;
    }

    try {
      setHoldLoading(true);
      const { start_time, end_time } = buildDateTimes();

      const res = await holdReservation({
        start_time,
        end_time,
        guests_amount: reservationInfo.partySize,
        table_ids: selectedTableIds,
        ttl_seconds: 300,
      });

      setHold({
        holdId: res?.hold_id ?? null,
        expiresAt: res?.expires_at ?? null,
      });
    } catch (e) {
      // on 422, refresh availability and force reselect
      setError("Could not hold tables. Please try again.");
      try {
        const { start_time, end_time } = buildDateTimes();
        const refresh = await tableAvailability({ start_time, end_time });
        const ids = Array.isArray(refresh?.available_table_ids) ? refresh.available_table_ids : [];
        setAvailableTableIds([...ids].map(Number).filter((n) => Number.isFinite(n)).sort((a, b) => a - b));
      } catch {
        // ignore refresh errors
      }
    } finally {
      setHoldLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!hold?.holdId) {
      setError("Please hold tables before submitting.");
      return;
    }

    const { date, start_time, end_time } = buildDateTimes();

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
      <DateTimeTab 
        reservationInfo={reservationInfo} 
        setDate={setDate} 
        setTime={setTime} />
    ),
    guests: (
      <GuestsTab 
        reservationInfo={reservationInfo} 
        setPeopleCount={setPeopleCount}
        requiredTableCount={requiredTableCount}
        availableTableIds={availableTableIds}
        availabilityLoading={availabilityLoading}
        error={error}
        goToNextTab={() => setSelectedHeaderTopic("reservation")}
      />
    ),
    reservation: (
      <DetailsTab
        reservationInfo={reservationInfo}
        updateField={updateField}
        handleSubmit={handleSubmit}
        handleHold={handleHold}
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

