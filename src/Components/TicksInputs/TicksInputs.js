import React from "react";

function TickInput({ getTickUp, getTickLow }) {
  const handleChangeLow = (e) => {
    getTickLow(e.currentTarget.value);
  };
  const handleChangeUp = (e) => {
    getTickUp(e.currentTarget.value);
  };

  return (
    <div>
      <div>
        <span className="m-6">Low Tick Price</span>
        <input
          type="number"
          pattern="^[0-9]+"
          onChange={(e) => handleChangeLow(e)}
          className="p-2 border-solid border-indigo-600 border-2 m-6 rounded-md w-24"
        />
        <span className="m-6">Up Tick Price</span>
        <input
          type="number"
          pattern="^[0-9]+"
          onChange={(e) => handleChangeUp(e)}
          className="p-2 border-solid border-indigo-600 border-2 m-6 rounded-md w-24"
        />
      </div>
    </div>
  );
}

document.addEventListener("wheel", (event) => {
  if (document.activeElement.type === "number") {
    document.activeElement.blur();
  }
});

export default TickInput;
