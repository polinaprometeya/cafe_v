import { useState } from "react";
import Section from "./Section";

export function Tabs({ children, buttons, ButtonContainer = "menu" }) {
    return (
      <>
        <ButtonContainer>{buttons}</ButtonContainer>
        {children}
      </>
    );
  }
  
  export function TabSelector() {
    //useState(); //cannot be nested somewhere else, has to be used directly
    const [selectedTopic, setSelectedTopic] = useState("");
  
    function handleSelect(selectedButton) {
      setSelectedTopic(selectedButton);
    }
  
    function TabButton({ children, onSelect, isSelected }) {
      //onSelect --- you can give this a custom name of your choice
      //children needs to be named children
      //if you add () in onClick={handelSelect()} this function will be executed when button is rendered not when you click
      return (
        <li className="examples">
          <button
            className={isSelected ? "active" : undefined}
            onClick={onSelect}
          >
            {children}
          </button>
        </li>
      );
    }
  
    function MenuButtonsRow({ selectedTopic }) {
      const menuButtons = ["Date", "Time", "Guests", "Reservation"];
      const buttonsRow = menuButtons.map((item) => (
        <TabButton
          key={item}
          isSelected={selectedTopic === item}
          onSelect={() => handleSelect(item)}
        >
          {item}
        </TabButton>
      ));
      return <>{buttonsRow}</>;
    }
  
    return (
      <Section title="Examples" id="examples">
        {/* <ExamplesTabTable
                  selectedTopic={selectedTopic}
                  handleSelect={handleSelect}
                /> */}
        <Tabs
          buttons={
            <MenuButtonsRow selectedTopic={selectedTopic} />
            //Manual approach -->
            //   <TabButton
            //     isSelected={selectedTopic === "components"}
            //     onSelect={() => handleSelect("components")}
            //   >
            //     Components
            //   </TabButton>
  
            //You can give the buttonsContainer wrapper a custom made one using a component like this -->buttonContainer={Section}
          }
        >
          {/* {tabContent} */}
          {/* {selectedTopic} */}
          {/* {!selectedTopic && <p>Select a topic</p>} */}
  
          {/* {selectedTopic ? (
            <div id="tab-content">
              <h3>{EXAMPLES[selectedTopic].title}</h3>
              <p>{EXAMPLES[selectedTopic].description}</p>
              <pre>
                <code>{EXAMPLES[selectedTopic].code}</code>
              </pre>
            </div>
          ) : (
            <p>Select a topic</p>
          )} */}
  
  
           {selectedTopic} 
        </Tabs>
      </Section>
    );
  }