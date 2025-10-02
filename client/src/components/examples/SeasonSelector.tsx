import { useState } from "react";
import { SeasonSelector } from "../SeasonSelector";

export default function SeasonSelectorExample() {
  const [season, setSeason] = useState("2023-24");
  const seasons = ["2023-24", "2022-23", "2021-22", "2020-21", "2019-20"];
  
  return (
    <div className="p-8">
      <SeasonSelector value={season} onChange={setSeason} seasons={seasons} />
    </div>
  );
}
