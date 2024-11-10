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
      {label && <span className="toggle-label">{label}</span>}
      <div
        className={`toggle-switch ${isToggled ? "toggled" : ""}`}
        onClick={onToggle}
      >
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
        .toggle-label {
          font-size: 12px;
          color: #b0b0b0; /* 연한 회색 */
        }
        .toggle-switch {
          width: 55px;
          height: 24px;
          border-radius: 30px;
          background-color: #a3c8ff;
          position: relative;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .toggle-switch.toggled {
          background-color: #4a90e2;
        }
        .toggle-knob {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #ffffff;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.3s ease;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
        }
        .toggle-switch.toggled .toggle-knob {
          transform: translateX(30px);
        }
      `}</style>
    </div>
  );
}
