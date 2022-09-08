import { useEffect, useState, useCallback } from "react";
const useTimer = (started) => {
  const [timer, setTimer] = useState(40);
  useEffect(() => {
    if (!timer || !started) return;
    const interval = setInterval(() => {
      setTimer(timer - 1);
      console.log(timer, "called on hooks");
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const resetTimer = useCallback(() => {
    console.log("restTImer called");
    setTimer(40);
  }, []);
  return { resetTimer, timer };
};

export default useTimer;
