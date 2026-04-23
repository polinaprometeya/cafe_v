import { useEffect, useState } from "react";
import { ReservationButtonsList} from "../components/ReservationComponent";
import Section from "../Layout/Section.jsx";
import Tabs from "../Layout/Tabs.jsx";
import "./Page.css";

export default function Reservation() {
    const [selectedHeaderTopic, handleSelectedHeaderTopic] = useState("date");

    function headerTabSelect(clickButton) {
      handleSelectedHeaderTopic(clickButton);
    }
  
    let content;
    if (selectedHeaderTopic) {
      content = ReservationButtonsList[selectedHeaderTopic].content;
    }

    
  return (

      <main>
        <menu className="headerTabs" id="headerTabs">
          <button onClick={() => headerTabSelect("date")}>Concepts</button>
          <button onClick={() => headerTabSelect("guests")}>Games</button>
          <button onClick={() => headerTabSelect("reservation")}>Cards</button>
        </menu>

        {content}
      </main>

  );
}

