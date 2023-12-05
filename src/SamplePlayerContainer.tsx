import React, { useEffect, useState } from "react";
import SamplePlayer from "./SamplePlayer";

const SamplePlayerContainer = ({ entriesData }: any) => {
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEntryIndex((prevIndex) => (prevIndex + 1) % entriesData.length);
    }, entriesData[currentEntryIndex].duration);

    return () => clearInterval(interval);
  }, [currentEntryIndex, entriesData]);

  return (
    <div>
      <SamplePlayer entry={entriesData[currentEntryIndex]} />
    </div>
  );
};

export default SamplePlayerContainer;
