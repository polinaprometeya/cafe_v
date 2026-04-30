import { useEffect, useMemo, useRef, useState } from "react";
import {
  DateFormatterYYYYMMDD,
  getExpiresMs,
  normalizeTableIds,
  TimeFormatterHHMM,
} from "../components/Utility";
import {
  createReservation,
  holdReservation,
  releaseReservationHold,
  tableAvailability,
} from "../service/routes";
import * as ReservationComponents from "../components/ReservationComponent";
import "./Page.css";

export default function Reservation() {
  const emptyReservationInfo = () => ({
    reservationDate: new Date(),
    startTime: initStartTime,
    endTime: initEndTime,
    email: "",
    reservee: "",
    phoneNumber: "",
    partySize: 1,
  });

  const [selectedHeaderTopic, setSelectedHeaderTopic] = useState("date");
  const [isLoading, setIsLoading] = useState(false); //true while submitting final reservatio , kinda obsessive
  const [availabilityLoading, setAvailabilityLoading] = useState(false); //true while fetching availble tables like a simp
  const [holdLoading, setHoldLoading] = useState(false); // true while creating a hold
  const [error, setError] = useState(""); //I like error management, a string instead of a toast. Maybe I will make a toast
  const [availableTableIds, setAvailableTableIds] = useState([]); //array with avaible table IDs
  const [selectedTableIds, setSelectedTableIds] = useState([]);  //array with selected table IDs --> the first “adjacent” tables
  const [hold, setHold] = useState(null); // { holdId, expiresAt }  
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(null); //It is uneccery but hey.. Countdown is okay
  const availabilityRequestIdRef = useRef(0); //useRef doesn’t trigger re-renders, I could have used session I think
  const lastHoldKeyRef = useRef(null); // prevents duplicate hold requests for same inputs

  const initStartTime = new Date();
  initStartTime.setHours(10, 0, 0, 0); //we open at 10 
  const initEndTime = new Date();
  initEndTime.setHours(11, 0, 0, 0); //maybe should be automatic 

  const ttlSecondsDefault = 300; //5 min , max 900seconds
  //create an empty reservation - form data
  const [reservationInfo, setReservationInfo] = useState(emptyReservationInfo);


  //this updates fields runningly , gices possability to update one at the time
  const updateField = (field, value) => {
    setReservationInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  //calculate how many tables needed
  const requiredTableCount = useMemo(() => {
    // Simple rule:
    // 1-2 guests => 1 table, 3-4 => 2 tables, 5-6 => 3 tables, 7-8 => 4 tables
    return Math.ceil(reservationInfo.partySize / 2);
  }, [reservationInfo.partySize]);

  //Hold helpers
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
      // Not sure what to put here 
    } finally {
      clearHold();
    }
  };

  // get available tables data
  const fetchAvailability = async ({ start_time, end_time, partySize, requiredTableCount }) => {
    const requestId = ++availabilityRequestIdRef.current; //the ++ increments the number by 1
    setError("");
    setAvailabilityLoading(true);

    try {
      const res = await tableAvailability({ start_time, end_time });
      if (availabilityRequestIdRef.current !== requestId) return; // stale response , so the old response does not overwrite the newest data

      //normalizeTableIds cleans IDs
      const ids = normalizeTableIds(res?.available_table_ids);
      setAvailableTableIds(ids);
      setSelectedTableIds(ids.slice(0, requiredTableCount)); //requiredTableCount --> how many tables I need

      // New time => old hold is invalid.
      await releaseHoldIfAny();
      lastHoldKeyRef.current = null;

      if (ids.length === 0) {
        setError("No tables available for the selected time.");
      } else if (ids.length < requiredTableCount) {
        setError(`Not enough tables available for ${partySize} guest(s).`); //Well this is just my toasts
      }
    } catch {
      setError("Failed to load available tables.");
    } finally {
      if (availabilityRequestIdRef.current === requestId) setAvailabilityLoading(false);
    }
  };

  //end point create hold
  const createHold = async ({ start_time, end_time, partySize, tableIds }) => {
    setError("");
    setHoldLoading(true);
    try {
      const res = await holdReservation({
        start_time,
        end_time,
        guests_amount: partySize,
        table_ids: tableIds,
        ttl_seconds: ttlSecondsDefault,
      });

      const holdId = res?.hold_id ?? null;
      const expiresAt = res?.expires_at ?? null;
      const expiresAtIso = res?.expires_at_iso ?? null;
      const expiresAtEpoch = res?.expires_at_epoch ?? null;

      //sanity check
      if (!holdId || !expiresAt) {
        clearHold();
        setError("Hold request succeeded, but response did not include hold_id/expires_at.");
        return null;
      }

      setHold({ holdId, expiresAt, expiresAtIso, expiresAtEpoch });
      
      return { holdId, expiresAt };
    } catch {
      setError("Could not hold tables. Please try again.");
      return null;
    } finally {
      setHoldLoading(false);
    }
  };

  const setPeopleCount = (partySize) => {
    updateField("partySize", partySize);
    void releaseHoldIfAny();
    lastHoldKeyRef.current = null; // the hold needs to be reset so..
  };

  const setTime = (startTime) => {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);
    updateField("startTime", startTime);
    updateField("endTime", endTime);
    void releaseHoldIfAny();
    lastHoldKeyRef.current = null;
  };

  const setDate = (date) => {
    if (date === undefined) return;
    updateField("reservationDate", date);
    void releaseHoldIfAny();
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

  const holdKey = `${start_time}|${end_time}|${reservationInfo.partySize}|${selectedTableIds.join(",")}`;

  /**
   * STEP 1: load availability when user is on Date/Time tab.
   * (You can also change this to load on "Next" only, but this matches your request.)
   */
  useEffect(() => {
    if (selectedHeaderTopic !== "date") return;
    void fetchAvailability({
      start_time,
      end_time,
      partySize: reservationInfo.partySize,
      requiredTableCount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHeaderTopic, start_time, end_time]);

  /**
   * STEP 2: on Guests tab, once we have "enough selected tables", create a hold.
   * Hold is kept and displayed also on the Details tab.
   */
  useEffect(() => {
    if (selectedHeaderTopic !== "guests") return;
    if (availabilityLoading || holdLoading) return;
    if (hold?.holdId) return;
    if (selectedTableIds.length !== requiredTableCount) return;
    if (error) return;

    // No-op if we already attempted to create this hold for these exact inputs.
    if (lastHoldKeyRef.current === holdKey) return;
    lastHoldKeyRef.current = holdKey;

    void createHold({
      start_time,
      end_time,
      partySize: reservationInfo.partySize,
      tableIds: selectedTableIds,
    });
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
    const expiresMsInitial = getExpiresMs(hold ?? {});
    if (expiresMsInitial === null) return;

    const tick = () => {
      const expiresMs = getExpiresMs(hold ?? {});
      if (expiresMs === null) return;
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
  }, [hold]);


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
      clearHold();
      setReservationInfo(emptyReservationInfo);
      setIsLoading(false);
    }
  };

  const tabs = {
    date: (
      <ReservationComponents.DateTab 
        reservationInfo={reservationInfo} 
        setDate={setDate} 
        setTime={setTime}
        availabilityLoading={availabilityLoading}
        error={error}
        goToNextTab={async () => {
          await fetchAvailability({
            start_time,
            end_time,
            partySize: reservationInfo.partySize,
            requiredTableCount,
          });
          setSelectedHeaderTopic("time");
        }}
      />
    ),
    time: (
      <ReservationComponents.TimeTab 
        reservationInfo={reservationInfo} 
        setTime={setTime}
        availabilityLoading={availabilityLoading}
        error={error}
        goToNextTab={async () => {
          await fetchAvailability({
            start_time,
            end_time,
            partySize: reservationInfo.partySize,
            requiredTableCount,
          });
          setSelectedHeaderTopic("guests");
        }}
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
        <button onClick={() => setSelectedHeaderTopic("date")}>Date</button>
        <button onClick={() => setSelectedHeaderTopic("time")}>Time</button>
        <button onClick={() => setSelectedHeaderTopic("guests")}>Guests</button>
        <button onClick={() => setSelectedHeaderTopic("reservation")}>Details</button>
      </menu>

      <div className="tabContent">{tabs[selectedHeaderTopic]}</div>
    </main>
  );
}

