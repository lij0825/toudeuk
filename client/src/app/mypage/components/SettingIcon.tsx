import SettingIcon from "../../../../public/icons/setting.svg";

interface SvgSettingIconProps {
  onClick: () => void;
}
export default function SvgSettingIcon({ onClick }: SvgSettingIconProps) {
  return (
    <SettingIcon
      style={{ width: "32px", height: "32px", cursor: "pointer" }}
      onClick={onClick}
    />
  );
}
