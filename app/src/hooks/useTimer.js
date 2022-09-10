import { useEffect, useState, useCallback, useRef } from "react";
const useTimer = (started, firstHand, gameEnd) => {
  const [timer, setTimer] = useState(40);
  useEffect(() => {
    if (!timer || !started || firstHand || gameEnd) return;
    const interval = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, started, firstHand]);

  const startTimer = useCallback(() => {
    setTimer(40);
  }, []);
  return { startTimer, timer, setTimer };
};

export default useTimer;
