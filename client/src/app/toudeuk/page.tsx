import Button from "./components/Button";
import CurrentRank from "./components/CurrentRank";

export default function Toudeuk() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <CurrentRank rank = {7}/>
      <Button/>
    </div>
  );
}
