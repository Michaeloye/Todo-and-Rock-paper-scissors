import React from "react";

function SelectRps(props) {
  return (
    <div className={props.component}>
      <div className={props.borderColor}>
        <button
          id={props.id}
          onClick={() =>
            props.component[props.component.length - 1] !== "d"
              ? props.handleClick(props.component)
              : null
          }
        >
          <img src={props.img} alt={props.alt} className="rps-images" />
        </button>
      </div>
    </div>
  );
}

export default SelectRps;
