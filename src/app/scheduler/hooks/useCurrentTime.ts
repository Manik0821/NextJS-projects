"use client";

import { useEffect, useMemo, useState } from "react";

import { PIXELS_PER_MINUTE } from "../constants/scheduler";

function getCurrentDate() {
  return new Date();
}

export function useCurrentTime() {
  const [currentTime, setCurrentTime] =
    useState(getCurrentDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentDate());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const minutes = useMemo(() => {
    return (
      currentTime.getHours() * 60 +
      currentTime.getMinutes()
    );
  }, [currentTime]);

  return {
    currentTime,
    minutes,
    top: minutes * PIXELS_PER_MINUTE,
  };
}