import { createContext, useContext } from "react";

export function PeopleCounter({ count, updateCount }) 
{
    function clamp(value, min, max) 
    {
        return Math.min(Math.max(value, min), max);
    }

    function changeNumber(amount) 
    {
        const number = clamp(count + amount, 1, 56) 
    }

    return (
        <>
            <button className="btn_people increase" onClick={() => changeNumber(-1)}>-</button>
            <p className="count">{count}</p>
            <button className="btn_people decrease" onClick={() => changeNumber(1)}>+</button>
        </>)

}

export function DateSelector({ selectedDate, updateDate }) {
    function toInputValue(date) {
        const d = new Date(date);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    }

    function handleChange(e) {
        const value = e.target.value; // YYYY-MM-DD
        if (!value) {
            updateDate(undefined);
            return;
        }

        // Create a Date in local time to avoid timezone off-by-one issues.
        const [y, m, d] = value.split("-").map(Number);
        updateDate(new Date(y, m - 1, d));
    }

    return (
        <>
            <input
                type="date"
                value={toInputValue(selectedDate)}
                min={toInputValue(new Date())}
                onChange={handleChange}
            />

        </>)

}

export function TimeSelector({ selectedTime, updateTime }) {
    const hour = selectedTime.getHours();
    const quarter = Math.floor(selectedTime.getMinutes()/15);

    async function changeHour(amount) {

        const newTime = new Date(selectedTime)
         let newHour  = hour + amount;


        if (newHour < 0) {
            newHour += 24;
        } else if (newHour > 23) { newHour -= 24 }

        newTime.setHours(newHour, quarter * 15,0,0);
        updateTime(newTime);
    }

    async function changeQuater(amount) {
        const newTime = new Date(selectedTime)
        let newQuater = quarter + amount;

        if (newQuater < 0) {
            newQuater += 4;
        } else if (newQuater > 3) { newQuater -= 4 }

        newTime.setHours(hour, newQuater * 15,0,0 )
        updateTime(newTime);
    }

    return (
    <>
        <div className="numControl hour">
            <button className="btn_num increase" onClick={() => changeHour(1)}></button>
            <p className="count">{hour > 9 ? hour : `0${hour}`}</p>
            <button className="btn_num decrease" onClick={() => changeHour(-1)}/>
        </div>
        <p className="count">:</p>
        <div className="numControl quarter">
            <button className="btn_num increase" onClick={() => changeQuater(1)}/>
            <p className="count">{quarter > 0 ? quarter * 15 : "00"}</p>
            <button className="btn_num decrease" onClick={() => changeQuater(-1)}></button>
        </div>
    </>)

}

export function ReservationForm({ reservationInfo, updateField, onSubmit, isDisabled}) 
{

    return (
        <form className="Form" onSubmit={onSubmit}>

            {/* Hidden inputs */}

            <input type="hidden" name="reservationDate" value={reservationInfo.reservationDate} />
            <input type="hidden" name="startTime" value={reservationInfo.startTime} />
            <input type="hidden" name="endTime" value={reservationInfo.endTime} />
            <input type="hidden" name="partySize" value={reservationInfo.partySize} />

            {/* Visible inputs */}
            <label>
                Reservation under name :{" "}
                <input
                    name="reservee"
                    type="text"
                    value={reservationInfo.reservee}
                    onChange={(e)=> updateField('reservee', e.target.value)}
                    placeholder={'Full Name' }
                    disabled={isDisabled}
                />
            </label>
            
            <label>
                Email :{" "}
                <input
                    name="email"
                    type="text"
                    value={reservationInfo.email}
                    onChange={(e)=> updateField('email', e.target.value)}
                    placeholder={'Email' }
                    disabled={isDisabled}
                />
            </label>

            <label>
                Mobil Number :{" "}
                <input
                    name="phoneNumber"
                    type="number"
                    value={reservationInfo.phoneNumber}
                    onChange={(e)=> updateField('phoneNumber', e.target.value)}
                    placeholder={'Mobil Number'}
                    disabled={isDisabled}
                />
            </label>


            {/* Hidden inputs */}
            

            {/* Finish */}
            <button className="submit" type="submit" disabled={isDisabled}>
                {isDisabled == false? "Submit" : "Submitting..."}
            </button>
        </form>
    );

}

export const PhaseContext = createContext(null);

export function PhaseContent({children, requiredPhase})
{
    const { phase } = useContext(PhaseContext)
    return (
    <>
        {phase === requiredPhase && children}        
    </>)
}

export function PhaseButton({children, setToPhase, icon})
{
    const { phase, setPhase } = useContext(PhaseContext)
    const isActive = (phase === setToPhase);
    
    return (
    <>
        {/* If currentPhase is equal to the button's phase, then it is Active which will make CSS change its appearance */}
        <button className={`btn_phase ${isActive ? "activePhase" : "inactivePhase"}`} onClick={() => 
        {
            if (setToPhase > 4 || setToPhase < 1) {return}
            setPhase(setToPhase)
        }}>
            {typeof(icon) != "undefined"}
            <span>{children}</span>
        </button>
    </>)
}