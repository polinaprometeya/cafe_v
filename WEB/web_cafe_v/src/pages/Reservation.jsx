import { useEffect, useState } from "react";
import { DateSelector, PeopleCounter, TimeSelector, ReservationForm , PhaseContext, PhaseContent, PhaseButton } from "../components/ReservationComponent";
import { createReservation } from "../service/routes";

export default function Reservation({ }) {
    const [phase, setPhase] = useState(1);
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    //const [peopleCount, setPeopleCount] = useState(1);

    const initStartTime = new Date();
    initStartTime.setHours(20, 0, 0, 0);

    const initEndTime = new Date();
    initEndTime.setHours(22, 0, 0, 0);

    const [reservationInfo, setReservationInfo] = useState({
        "reservationDate": new Date(), // hidden
        "startTime": initStartTime, // hidden
        "endTime": initEndTime, // hidden
        "email": "",
        "reservee": "",
        "phoneNumber": "",
        "partySize": 1, // hidden
    });

    const updateField = async (field, value) => {
        await setReservationInfo(
            (prev) => (
                {
                    ...prev,
                    [field]: value,
                }
            ));
    }

    const setPeopleCount = (partySize) => {
        updateField("partySize", partySize);
    }

    const setTime = (startTime) => {
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 2);

        updateField("startTime", startTime);
        updateField("endTime", endTime);
    }

    const setDate = (date) => {

        if (date == undefined) {
            return
        }

        updateField("reservationDate", date);
    }

    //APi call POST

    const handleSubmit = async (e) => 
    {
        e.preventDefault();
        console.log("Submitting1")
        if (isLoading == true)
        {
            console.log("Submitting")
            return
        }
        setIsLoading(true)
        const payload = 
        {
            ...reservationInfo,
            "reservationDate": formatDateYYYYMMDD(reservationInfo.reservationDate),
            "startTime": formatTimeHHMM(reservationInfo.startTime),
            "endTime": formatTimeHHMM(reservationInfo.endTime),
            "phoneNumber": String(reservationInfo.phoneNumber)
        }
        

        const saveReservation = await createReservation(payload);
        
        if (saveReservation)
        {
            setToast(saveReservation)
            setIsLoading(false)
        }

        // POST reservationInfo

    };

    function prevPhase() {
        if (phase <= 1) {
            return
        }
        setPhase(phase - 1)
    }

    function formatDateYYYYMMDD(date) {
        const d = new Date(date);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")

        return `${y}-${m}-${day}`
    }

    function formatTimeHHMM(date) {
        const d = new Date(date)
        const h = String(d.getHours()).padStart(2, "0")
        const m = String(d.getMinutes()).padStart(2, "0")

        return `${h}:${m}`
    }

    const startTime = new Date(reservationInfo.time);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);


    return (
        <>
            { toast != null && (
                <p className="toast"> {toast} </p>
            )}
            <PhaseContext.Provider value={{ phase, setPhase }}>
                <div className="segment_phases">
                    <PhaseButton setToPhase={1} icon="people">{reservationInfo.partySize}</PhaseButton>
                    <PhaseButton setToPhase={2} icon="date">{formatDateYYYYMMDD(reservationInfo.reservationDate)}</PhaseButton>
                    <PhaseButton setToPhase={3} icon="time">{reservationInfo.startTime.toTimeString().slice(0, 5)}</PhaseButton>
                    <PhaseButton setToPhase={4} icon="confirm"></PhaseButton>
                </div>
            

                <div className="content_phase">
                    {/* People Amount */}
                    <PhaseContent requiredPhase={1}>
                        <PeopleCounter count={reservationInfo.partySize} updateCount={setPeopleCount} />
                    </PhaseContent>

                    {/* Date */}
                    <PhaseContent requiredPhase={2}>
                        <DateSelector selectedDate={reservationInfo.reservationDate} updateDate={setDate} />
                    </PhaseContent>

                    {/* Time */}
                    <PhaseContent requiredPhase={3}>
                        <TimeSelector selectedTime={reservationInfo.startTime} updateTime={setTime} />
                    </PhaseContent>

                    {/* Personal Info */}
                    <PhaseContent requiredPhase={4}>
                        <ReservationForm
                            reservationInfo={reservationInfo}
                            updateField={updateField}
                            onSubmit={handleSubmit}
                            isDisabled={isLoading}
                        />
                    </PhaseContent>
                </div>
            


                {/* Controls */}
                <div className="btn_continue">
                    <PhaseButton setToPhase={(phase - 1)}>
                        PREV
                    </PhaseButton>
                    <PhaseButton setToPhase={(phase + 1)}>
                        NEXT
                    </PhaseButton>
                </div>
            </PhaseContext.Provider>
        </>);
}
