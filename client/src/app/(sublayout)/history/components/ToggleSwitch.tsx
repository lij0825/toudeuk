interface ToggleSwitchProps {
  isToggled: boolean;
  onToggle: () => void;
  labelLeft: string;
  labelRight: string;
}

export default function ToggleSwitch({
  isToggled,
  onToggle,
  labelLeft,
  labelRight,
}: ToggleSwitchProps) {
  return (
    <div className="slider-container">
      <div className="slider">
        <div className={`slider-knob ${isToggled ? "right" : "left"}`} />
        <button
          className={`slider-item ${!isToggled ? "active" : ""}`}
          onClick={() => {
            if (!isToggled) return; // 현재 비활성화된 탭일 때만 onToggle 호출
            onToggle();
          }}
        >
          {labelLeft}
        </button>
        <button
          className={`slider-item ${isToggled ? "active" : ""}`}
          onClick={() => {
            if (isToggled) return; // 현재 비활성화된 탭일 때만 onToggle 호출
            onToggle();
          }}
        >
          {labelRight}
        </button>
      </div>

      <style jsx>{`
        .slider-container {
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 0;
        }
        .slider {
          display: flex;
          position: relative;
          width: 100%;
          max-width: 300px;
          background-color: #f0f0f0;
          border-radius: 24px;
          overflow: hidden;
        }
        .slider-item {
          flex: 1;
          padding: 10px 20px;
          text-align: center;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          background: transparent;
          z-index: 2;
          transition: color 0.3s ease;
        }
        .slider-item.active {
          color: #fff;
          font-weight: bold;
        }
        .slider-knob {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          background-color: #4a90e2;
          border-radius: 24px;
          transition: transform 0.3s ease;
        }
        .slider-knob.left {
          transform: translateX(0%);
        }
        .slider-knob.right {
          transform: translateX(100%);
        }
      `}</style>
    </div>
  );
}
