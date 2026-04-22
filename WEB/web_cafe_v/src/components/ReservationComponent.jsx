

export function SelectDateTime(){
    return <>Date</>
}

export function SelectpartySize(){
    return <>PartySize</>
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