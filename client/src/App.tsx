import useWebSocket from "react-use-websocket";
import { useEffect, useRef, useState } from "react";
import { EVENTS, STATES, WebSocketRecievingData } from "./types";
import { timeAgo } from "./util/timeAgo";
import { InfoBox } from "./components/InfoBox";
import "./App.css";

function App() {
  const BASE_URL = `localhost:${process.env.PORT}`;
  const HEARTBEAT_INTERVAL = Number(process.env.HEARTBEAT_INTERVAL);

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `ws://${BASE_URL}`,
    {
      heartbeat: {
        message: "pong",
        returnMessage: "ping",
        timeout: HEARTBEAT_INTERVAL + 10000,
        interval: HEARTBEAT_INTERVAL - 5000,
      },
      shouldReconnect: () => true,
      retryOnError: true,
      reconnectAttempts: 20,
      reconnectInterval: 1000,
    }
  );

  const [plantData, setPlantData] = useState({
    humidity: 0,
    moisture: 0,
    lastActive: null as number | null,
    state: STATES.IDLE,
    lastWatered: "Not started",
  });

  const [isHolding, setIsHolding] = useState(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  function startButtonClick() {
    holdTimer.current = setTimeout(() => {
      sendJsonMessage({
        type: EVENTS.BUTTON_CLICK_START,
      });
      setIsHolding(true);
    }, 500);
  }

  function stopButtonClick() {
    if (holdTimer.current) clearTimeout(holdTimer.current);

    if (isHolding) {
      sendJsonMessage({
        type: EVENTS.BUTTON_CLICK_STOP,
      });
      setIsHolding(false);
    }
  }

  async function toggleGradientation() {
    const action =
      plantData.state === STATES.GRADIENT
        ? "stop_gradientation"
        : "start_gradientation";

    await fetch(`http://${BASE_URL}/${action}`, { method: "POST" });
  }

  const updateLastWatered = (message: WebSocketRecievingData) => {
    if (message.isActive) return "Watering...";
    if (!message.lastActive) return "Not started";

    const date = new Date();
    const lastWatered = timeAgo(message.lastActive, date.getTime());
    return lastWatered;
  };

  useEffect(() => {
    const message = lastJsonMessage as WebSocketRecievingData;
    if (message && message.type === EVENTS.TICK) {
      setPlantData((prev) => ({
        ...prev,
        humidity: message.humidity,
        moisture: message.moisture,
        state: message.state,
        lastActive: message.lastActive || prev.lastActive,
        lastWatered: updateLastWatered(message),
      }));
    }
  }, [lastJsonMessage]);

  return (
    <div id="screen">
      <h1 id="header">πPot</h1>
      <p id="phrase">
        {" "}
        A smart way to <br /> care and preserve <br /> your plant
      </p>
      <div id="image"></div>
      <div id="infoContainer">
        <InfoBox
          icon="fas fa-tint"
          label="Humidity"
          value={`${plantData.humidity} %`}
        />
        <InfoBox
          icon="fas fa-seedling"
          label="Moisture"
          value={`${plantData.moisture} %`}
        />
        <InfoBox
          icon="fas fa-clock"
          label="Last Watered"
          value={plantData.lastWatered}
        />
      </div>
      <div id="scaleContainer">
        <div className="scaleWrapper"></div>
      </div>
      <input
        id="waterPlant"
        type="submit"
        value="Water The Plant"
        onTouchStart={startButtonClick}
        onTouchEnd={stopButtonClick}
        onMouseDown={startButtonClick}
        onMouseUp={stopButtonClick}
      />
      <input
        id="irrigation"
        type="submit"
        value={
          (plantData.state === STATES.GRADIENT ? "Stop" : "Start") +
          " continuous supply"
        }
        onClick={toggleGradientation}
      />
    </div>
  );
}

export default App;