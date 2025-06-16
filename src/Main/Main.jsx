import { toast } from "react-toastify";
import "./main.css";
import { useState, useRef, useEffect } from "react";

const App = () => {
  const getSecs = (time) => {
    const [h, m, s] = time.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  const initTime = "06:00:00";
  const initSecs = getSecs(initTime);

  const intervalRef = useRef(null);
  const [timer, setTimer] = useState(localStorage.getItem("time") || initTime);
  const [isRunning, setIsRunning] = useState(false);
  const [days, setDays] = useState(+localStorage.getItem("days") || 0);
  const [totalDays, setTotalDays] = useState(
    +localStorage.getItem("totalDays") || 0
  );

  const getTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(total / 1000 / 60 / 60);
    return { total, hours, minutes, seconds };
  };

  const formatTime = (hours, minutes, seconds) => {
    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  };

  const startTimer = (endTime) => {
    const { total, hours, minutes, seconds } = getTimeRemaining(endTime);
    if (total >= 0) {
      setTimer(formatTime(hours, minutes, seconds));
    } else {
      clearInterval(intervalRef.current);
    }
  };

  const clearTimer = (endTime) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => startTimer(endTime), 1000);
  };

  const getDeadTime = (secs) => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + secs);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime(getSecs(timer)));
    setIsRunning(true);
    return () => clearInterval(intervalRef.current);
  }, []);

  const onClickReset = () => {
    let q = prompt("Sure you want to reset? Y/N: ", "Y");
    if (!q || q.toLowerCase() !== "y") return;
    clearTimer(getDeadTime(initSecs));
    setIsRunning(true);
    localStorage.setItem("time", initTime);
  };

  const onClickStart = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      toast.success("Stoped!");
    } else {
      clearTimer(getDeadTime(getSecs(timer)));
      setIsRunning(true);
      toast.success("Started!");
    }
  };

  const onClickSave = () => {
    localStorage.setItem("time", timer);
    toast.success("Time saved successfully!");
  };

  const addDays = () => {
    setDays((prev) => {
      const newDays = prev + 1;
      localStorage.setItem("days", +newDays);
      return newDays;
    });

    setTotalDays((prev) => {
      const newDays = prev + 1;
      localStorage.setItem("totalDays", +newDays);
      return newDays;
    });
  };

  const removeDays = () => {
    setDays((prev) => {
      const newDays = prev === 0 ? 0 : prev - 1;
      localStorage.setItem("days", +newDays);
      return newDays;
    });
  };

  return (
    <>
      <div className="main">
        <h2>{timer}</h2>
        <div className="daysCounter">
          <h6>
            {days <= 9 ? "0" : ""}
            {days} / {totalDays <= 9 ? "0" : ""}
            {totalDays}
          </h6>
          <div className="imgs">
            <img src="./minus.png" alt="minus" onClick={removeDays} />
            <img src="./plus.png" alt="plus" onClick={addDays} />
          </div>
        </div>
      </div>
      <div className="controlsPanel">
        <button onClick={onClickStart}>{isRunning ? "Stop" : "Start"}</button>
        <button onClick={onClickReset}>Reset</button>
        <button onClick={onClickSave}>Save</button>
      </div>
    </>
  );
};

export default App;
