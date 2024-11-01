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
          align-items: center;
          gap: 10px;
        }
        .toggle-switch {
          width: 40px;
          height: 20px;
          border-radius: 20px;
          background-color: #9f9f9f;
          position: relative;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .toggle-switch.toggled {
          background-color: #17181c;
        }
        .toggle-knob {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #fff;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.3s ease;
        }
        .toggle-switch.toggled .toggle-knob {
          transform: translateX(20px);
        }
        .toggle-label {
          font-size: 16px;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
