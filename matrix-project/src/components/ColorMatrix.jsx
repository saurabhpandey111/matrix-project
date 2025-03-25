import { useState, useEffect, useRef } from "react";
import "../styles/styles.css";

export default function ColorMatrix() {
  const [clickedBoxes, setClickedBoxes] = useState([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [orangeBoxes, setOrangeBoxes] = useState([]);
  const timeoutsRef = useRef([]);

  const handleBoxClick = (index) => {
    if (isReplaying || clickedBoxes.includes(index)) return;
    const newClickedBoxes = [...clickedBoxes, index];
    setClickedBoxes(newClickedBoxes);
    if (index==8) setIsReplaying(true);
  };

  useEffect(() => {
    if (isReplaying) {
      setOrangeBoxes([]);
      timeoutsRef.current = clickedBoxes.map((boxIndex, i) =>
        setTimeout(() => {
          setOrangeBoxes((prev) => [...prev, boxIndex]);
          if (i === clickedBoxes.length - 1) {
            timeoutsRef.current.push(setTimeout(resetGame, 1000));
          }
        }, i * 500)
      );
    }
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [isReplaying, clickedBoxes]);

  const resetGame = () => {
    setIsReplaying(false);
    setClickedBoxes([]);
    setOrangeBoxes([]);
    timeoutsRef.current.forEach(clearTimeout);
  };

  const getBoxClass = (index) => {
    let className = "box";
    if (orangeBoxes.includes(index)) className += " box-orange";
    else if (clickedBoxes.includes(index)) className += " box-green";
    return className;
  };

  return (
    <div className="container">
      <h1 className="title">Color Matrix Game</h1>
      <div className="grid">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            onClick={() => handleBoxClick(index)}
            className={getBoxClass(index)}
            role="button"
            aria-label={`Box ${index + 1}`}
            tabIndex={0}
          >
            {clickedBoxes.indexOf(index) > -1 && !isReplaying
              ? clickedBoxes.indexOf(index) + 1
              : ""}
          </div>
        ))}
      </div>
      <div className="status">
        <p>
          {isReplaying
            ? "Replaying sequence..."
            : clickedBoxes.length === 0
            ? "Click on any box to start"
            : `Clicked ${clickedBoxes.length} of 9 boxes`}
        </p>
        <button onClick={resetGame} className="reset-button">Reset</button>
      </div>
    </div>
  );
}
