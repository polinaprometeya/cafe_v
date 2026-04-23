export function RandomNumber() {
    var randomNumber = Math.floor(Math.random());
    return randomNumber;
  }

export function PlusButton(props) {
    return  <button {...props}>+</button>;
  }

  export function MinusButton(props) {
    return  <button {...props}>-</button>;
  }
  
  export function ClampedCounter({ count, updateCount }) 
{
    function clamp(value, min, max) 
    {
        return Math.min(Math.max(value, min), max);
    }

    function changeNumber(amount) 
    {
        const number = clamp(count + amount, 1, 8);
        updateCount(number);
    }

    return (
        <>
            <MinusButton className="btn_people increase" onClick={() => changeNumber(-1)}/>
            <p className="count">{count}</p>
            <PlusButton className="btn_people decrease" onClick={() => changeNumber(1)}/>
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
          <PlusButton className="btn_num increase" onClick={() => changeHour(1)}/>
          <p className="count">{hour > 9 ? hour : `0${hour}`}</p>
          <MinusButton className="btn_num decrease" onClick={() => changeHour(-1)}/>
      </div>
      <p className="count">:</p>
      <div className="numControl quarter">
          <PlusButton className="btn_num increase" onClick={() => changeQuater(1)}/>
          <p className="count">{quarter > 0 ? quarter * 15 : "00"}</p>
          <MinusButton className="btn_num decrease" onClick={() => changeQuater(-1)}/>
      </div>
  </>)

}
