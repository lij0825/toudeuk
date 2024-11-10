interface ToggleSwitchProps {
  isToggled: boolean;
  onToggle: () => void;
  label?: string;
}

export default function ToggleSwitch({
  isToggled,
  onToggle,
  label,
}: ToggleSwitchProps) {
  return (
    <div className="toggle-container">
      <div
        className={`toggle-switch ${isToggled ? "toggled" : ""}`}
        onClick={onToggle}
      >
        {label && (
          <span
            className={`toggle-background-label ${isToggled ? "toggled" : ""}`}
          >
            {label}
          </span>
        )}
        <div className="toggle-knob"></div>
      </div>

      <style jsx>{`
        .toggle-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin: 0;
          padding: 0;
        }
        .toggle-switch {
          width: 86px;
          height: 30px;
          border-radius: 30px;
          background-color: #a3c8ff;
          position: relative;
          cursor: pointer;
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .toggle-switch.toggled {
          background-color: #4a90e2;
        }
        .toggle-background-label {
          position: absolute;
          font-size: 12px;
          color: #ffffff;
          opacity: 0.8;
          pointer-events: none;
          transition: all 0.3s ease;
          right: 8px; /* 기본 상태에서 왼쪽에 위치 */
        }
        .toggle-background-label.toggled {
          right: auto;
          left: 8px; /* 토글된 상태에서 오른쪽으로 이동 */
          text-align: right;
        }
        .toggle-knob {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #ffffff;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: transform 0.5s ease;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
        }
        .toggle-switch.toggled .toggle-knob {
          transform: translateX(55px); /* 토글된 상태에서 오른쪽으로 이동 */
        }
      `}</style>
    </div>
  );
}
