import { useEffect, useState, useCallback, useRef } from "react";
const useTimer = (started, firstHand) => {
  const [timer, setTimer] = useState(40);
  useEffect(() => {
    // if (!timer || !started || firstHand) return;
    // const interval = setInterval(() => {
    //   setTimer(timer - 1);
    // }, 1000);
    // return () => clearInterval(interval);
  }, [timer, started, firstHand]);

  const startTimer = useCallback(() => {
    setTimer(40);
  }, []);
  return { startTimer, timer, setTimer };
};

export default useTimer;
