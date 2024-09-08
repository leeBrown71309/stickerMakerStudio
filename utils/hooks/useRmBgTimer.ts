import { useState, useEffect } from "react";

export default function useTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startDate, setStartDate] = useState(0);

  const calculateSecondsBetweenDates = (startDate: number, endDate: number) => {
    const milliseconds = endDate - startDate;
    const seconds = (milliseconds / 1000.0).toFixed(1);
    return seconds;
  };

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(
          parseFloat(calculateSecondsBetweenDates(startDate, Date.now()))
        );
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startDate]);

  const startTimer = () => {
    setIsRunning(true);
    setStartDate(Date.now());
    setSeconds(0);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  return { seconds, isRunning, startTimer, stopTimer };
}
