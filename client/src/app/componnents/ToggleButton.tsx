"use client";

import { useState } from "react";

enum ToggleState {
  USED = "used",
  UNUSED = "unUsed",
}

export default function ToggelButtom() {
  const [isToggle, setIsToggle] = useState<ToggleState>(ToggleState.UNUSED);

  return <div className="bottom-sheet">dd</div>;
}
