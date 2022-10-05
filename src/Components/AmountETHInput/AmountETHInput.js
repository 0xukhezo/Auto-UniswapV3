import React from "react";

function AmountETHInput({ getAmountETH }) {
  const handleChange = (e) => {
    getAmountETH(e.currentTarget.value);
  };

  return (
    <div>
      <div>
        <span className="m-6">Amount of ETH</span>
        <input
          type="number"
          min="1"
          pattern="^[0-9]+"
          onChange={(e) => handleChange(e)}
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

export default AmountETHInput;
