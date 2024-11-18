import React from "react";
import MyPoint from "./components/MyPoint";
import PointList from "./components/PointList";

const page = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-shrink-0">
        <MyPoint />
      </div>
      <div className="flex-grow">
        <PointList />
      </div>
    </div>
  );
};

export default page;
