import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import logo from "../images/logo.svg";
import SelectRps from "./SelectRps";
import randomRPS from "./randomRPS";
import Modal from "./Modal";
import iconPaper from "../images/icon-paper.svg";
import iconRock from "../images/icon-rock.svg";
import iconScissors from "../images/icon-scissors.svg";
import imageRules from "../images/image-rules.svg";
import iconClose from "../images/icon-close.svg";

function Display() {
  const [hasPicked, setHasPicked] = useState(false);
  const [clickedComponent, setClickedComponent] = useState("");
  const [pcPickedComponent, setPcPickedComponent] = useState("");
  const [housePicked, setHousePicked] = useState("");
  const [declareVerdict, setDeclareVerdict] = useState(false);
  const [verdictText, setVerdictText] = useState("");
  const [playAgain, setPlayAgain] = useState("");
  const [score, setScore] = useState(0);

  // modal state
  const [showModal, setShowModal] = useState(false);

  const DATA = [
    {
      component: "paper-component",
      id: "paper",
      borderColor: "paper-border-color",
      img: iconPaper,
      alt: "paper",
    },
    {
      component: "rock-component",
      id: "rock",
      borderColor: "rock-border-color",
      img: iconRock,
      alt: "rock",
    },
    {
      component: "scissors-component",
      id: "scissors",
      borderColor: "scissors-border-color",
      img: iconScissors,
      alt: "scissors",
    },
  ];

  function toggleModal() {
    setShowModal(!showModal);
  }

  // This function should be called only in userPickTemplate
  function handleClick(component) {
    const updatedComponent = DATA.map((button) => {
      if (button.component === component && component === "paper-component") {
        return { ...button, component: "paper-component-clicked" };
      } else if (
        button.component === component &&
        component === "rock-component"
      ) {
        return { ...button, component: "rock-component-clicked" };
      } else if (
        button.component === component &&
        component === "scissors-component"
      ) {
        return { ...button, component: "scissors-component-clicked" };
      }
    });
    const filteredUpdatedComponent = updatedComponent.filter(
      (button) => button !== undefined
    );

    setClickedComponent(...filteredUpdatedComponent);
    setHasPicked(true);

    pcPick();
  }

  // This function should be called only when it is time for the pc to pick
  function pcPick() {
    const updatedPcComponent = DATA.map((button) => {
      if (button.component === "paper-component") {
        return { ...button, component: "paper-component-pc-clicked" };
      } else if (button.component === "rock-component") {
        return { ...button, component: "rock-component-pc-clicked" };
      } else if (button.component === "scissors-component") {
        return { ...button, component: "scissors-component-pc-clicked" };
      }
    });

    let i = setInterval(() => {
      setPcPickedComponent(randomRPS(updatedPcComponent));
    }, 50);
    setTimeout(() => {
      clearInterval(i);
      setPcPickedComponent(randomRPS(updatedPcComponent));
      setHousePicked("THE HOUSE PICKED");
      setDeclareVerdict(true);
    }, 3000);
  }

  const buttonList = DATA.map((button) => (
    <SelectRps
      component={button.component}
      id={button.id}
      borderColor={button.borderColor}
      img={button.img}
      alt={button.alt}
      key={button.id}
      handleClick={handleClick}
    />
  ));

  useEffect(() => {
    document.title = "Rock-Paper-Scissors";

    if (declareVerdict === true) {
      setPlayAgain("PLAY AGAIN");
    }
    if (
      clickedComponent.id === pcPickedComponent.id &&
      declareVerdict === true
    ) {
      setVerdictText("DRAW");
    } else if (
      ((clickedComponent.id === "paper" && pcPickedComponent.id === "rock") ||
        (clickedComponent.id === "scissors" &&
          pcPickedComponent.id === "paper") ||
        (clickedComponent.id === "rock" &&
          pcPickedComponent.id === "scissors")) &&
      declareVerdict === true
    ) {
      setVerdictText("YOU WIN");
      setScore(score + 1);
    } else if (
      ((clickedComponent.id === "scissors" &&
        pcPickedComponent.id === "rock") ||
        (clickedComponent.id === "rock" && pcPickedComponent.id === "paper") ||
        (clickedComponent.id === "paper" &&
          pcPickedComponent.id === "scissors")) &&
      declareVerdict === true
    ) {
      setVerdictText("YOU LOSE");

      setScore(score - 1);
    } else {
      setVerdictText("");
    }
  }, [declareVerdict]);

  const userPickTemplate = (
    <section className="wrapper-before-click">{buttonList}</section>
  );

  // The nanoid() function assigned to key below generates a unique id
  const userHasPickedTemplate = (
    <section className="wrapper-after-click">
      <SelectRps
        component={clickedComponent.component}
        id={clickedComponent.id}
        borderColor={clickedComponent.borderColor}
        img={clickedComponent.img}
        alt={clickedComponent.alt}
        key={nanoid()}
      />
      <p className="you-picked">YOU PICKED</p>
      <div className="socket"></div>
      <SelectRps
        component={pcPickedComponent.component}
        id={pcPickedComponent.id}
        borderColor={pcPickedComponent.borderColor}
        img={pcPickedComponent.img}
        alt={pcPickedComponent.alt}
        key={nanoid()}
      />
      {declareVerdict ? (
        <p className="the-house-picked">{housePicked}</p>
      ) : null}
      <h2 className="verdict-text">{verdictText}</h2>
      {declareVerdict ? (
        <button
          className="play-again"
          onClick={() => {
            setHasPicked(false);
            setDeclareVerdict(false);
          }}
        >
          {playAgain}
        </button>
      ) : null}
    </section>
  );

  return (
    <div className="rps-body">
      <section className="heading">
        <img
          className="rock-paper-scissors-img"
          src={logo}
          alt="rock-paper-scissors"
        />
        <div className="score-board">
          <p className="score">SCORE</p>
          <p className="number">{score}</p>
        </div>
      </section>
      {!hasPicked ? userPickTemplate : userHasPickedTemplate}
      <button className="rules" onClick={toggleModal}>
        RULES
      </button>
      {showModal ? (
        <Modal>
          <img src={imageRules} alt="rules" className="image-rules" />
          <button onClick={toggleModal}>
            <img src={iconClose} alt="close" className="icon-close" />
          </button>
        </Modal>
      ) : null}
      <footer className="footer-rps">
        <Link to="/">check out my todo app</Link>
      </footer>
    </div>
  );
}
export default Display;
