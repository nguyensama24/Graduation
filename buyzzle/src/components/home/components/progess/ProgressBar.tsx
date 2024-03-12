import React from "react";

interface ProgressBarProps {
  bgColor: string;
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ bgColor, progress }) => {
  const containerStyles: React.CSSProperties = {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
  };

  const fillerStyles: React.CSSProperties = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: bgColor,
    borderRadius: "inherit",
    textAlign: "right"
  };

  const labelStyles: React.CSSProperties = {
    padding: 5,
    color: "white",
    fontWeight: "bold"
  };

  return (
    <div className="progress-bar" style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{progress} Đã bán</span>
      </div>
    </div>
  );
};

export default ProgressBar;
