import "./App.css";
import Header from "./components/header";
import Gameboard from "./components/gameboard";
import shipData from "./data/shipData";
import cpuData from "./data/cpuData";
import React, { useEffect, useState } from "react";

function App() {
  const [turn, setTurn] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState("Player");
  const [boardReady, setBoardReady] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [ships, setShips] = useState([]);
  const [shipToPlaceIndex, setShipToPlaceIndex] = useState(0);
  const [shipToPlace, setShipToPlace] = useState(shipData[shipToPlaceIndex]);
  const [isHovering, setIsHovering] = useState([]);
  const [playerBoard, setPlayerBoard] = useState([]);
  const [cpuReady, setCpuReady] = useState(false);
  const [cpuShips, setCpuShips] = useState([]);
  const [cpuShipToPlaceIndex, setCpuShipToPlaceIndex] = useState(0);
  const [cpuShipToPlace, setCpuShipToPlace] = useState(
    CpuShipData[cpuShipToPlaceIndex]
  );
  const [cpuIsHovering, setCpuIsHovering] = useState([]);
  const [cpuBoard, setCpuBoard] = useState([]);
  const [onTarget, setOnTarget] = useState(false);
  const [targetValue, setTargetValue] = useState([]);
  const [isVertical, setIsVertical] = useState(false);
  const [axis, setAxis] = useState("Vertical");

  const switchPlayer = () => {
    setCurrentPlayer(currentPlayer === "Player" ? "Computer" : "Player");
    setTurn((prev) => prev + 1);
  };

  useEffect(() => {
    if (gameWon) return;
    if (currentPlayer === "Computer") {
      setTimeout(() => cpuTurn(), 2000);
    }
  }, [currentPlayer]);

  const cpuTurn = () => {
    if (gameWon) return;
    let attack = "";
    console.log("onTarget", onTarget);
    if (!onTarget) {
      attack = findRandomTarget();
    } else if (onTarget) {
      let preferredTargets = getPreferredTargets();
      if (preferredTargets.length > 0) {
        let preferredIndex = Math.floor(
          Math.random() * preferredTargets.length
        );
        attack = preferredTargets[preferredIndex];
        while (playerBoard.includes(attack) && preferredTargets.length > 0) {
          preferredTargets.splice(preferredIndex, 1);
          preferredIndex = Math.floor(Math.random() * preferredTargets.length);
          attack = preferredTargets[preferredIndex];
          if (onTarget && attack === undefined) {
            console.log(
              "Player boats have been stacked next to each other, keep firing on adjacent targets!"
            );
            let targetts = getTargets(targetValue);
            let index = Math.floor(Math.random() * targets.length);
            attack = targets[index];
            while (playerBoard.includes(attack)) {
              index = Math.floor(Math.random() * targets.length);
              attack = targets[index];
            }
          }
        }
      } else {
        let targets = getTargets(targetValue);
        let index = Math.floor(Math.random() * targets.length);
        attack = targets[index];
        while (playerBoard.includes(attack)) {
          index = Math.floor(Math.random() * targets.length);
          attack = targets[index];
        }
      }
    }

    console.log("attack: " + attack);
    console.log("--------------");
    setPlayerBoard((currentBoard) => [...currentBoard, attack]);
    for (let i = 0; i < ships.length; i++) {
      for (let j = 0; j < ships[i].coords.length; j++) {
        if (ships[i].coords[j] === attack) {
          ships[i].health--;
          setTargetValue((prev) => [...prev, attack]);
          console.log("adding targets: " + attack);
          setOnTarget(true);
          if (ships[i].health === 0) {
            ships[i].status = "sunk";
            checkIfOnTarget(ships[i]);
            for (let k = 0; k < ships[i].size; k++) {
              document.getElementById(
                `Player-${ships[i].coords[k]}`
              ).style.backgroundColor = "darkred";
            }
          }
          if (ships.every((ship) => ship.status === "sunk")) {
            gameOver("Computer");
          }
          switchPlayer();
          return;
        }
      }
    }
    document.getElementById(`Player-${attack}`).style.backgroundColor =
      "var(--miss)";
      switchPlayer();
      return;
  };

  const checkIfOnTarget = (ship) => {
    console.log("check if on target: " + ship.shipId);
    let leftoverTargets = targetValue;
    for (let i = 0; i < ship.coords.length; i++) {
      if (leftoverTargets.includes(ship.coords[i])) {
        const index = targetValue.indexOf(ship.coords[i]);
        leftoverTargets.splice(index, 1);
        console.log("removing targets: " + ship.coords[i]);
        console.log("leftover targets: " + leftoverTargets);
      }
    }
    setTargetValue(leftoverTargets);
    if (targetValue.length === 0) {
      setOnTarget(false);
      setTargetValue([]);
    }
    return;
  };

  const findRandomTarget = () => {
    let target = Math.floor(Math.random() * 100);
    while (playerBoard.includes(target)) {
      target = Math.floor(Math.random() * 100);
    }
    return target;
  };

  const getTargets = (targs) => {
    console.log("targetvalue in getTargets: " + targetValue);
    let targets = [];
    for (let i = 0; i < targs.length; i++) {
      if (targs[i] === 0) {
        targets.push(1);
        targets.push(10);
      } else if (targs[i] === 99) {
        targets.push(89);
        targets.push(98);
      } else if (targs[i] === 9) {
        targets.push(8);
        targets.push(19);
      } else if (targs[i] === 90) {
        targets.push(80);
        targets.push(91);
      } else if (targs[i] < 9) {
        targets.push(targs[i] - 1);
        targets.push(targs[i] + 1);
        targets.push(targs[i] + 10);
      } else if (targs[i] > 90) {
        targets.push(targs[i] - 1);
        targets.push(targs[i] + 1);
        targets.push(targs[i] - 10);
      } else if (targs % 10 === 0) {
        targets.push(targs[i] + 1);
        targets.push(targs[i] - 10);
        targets.push(targs[i] + 10);
      } else if ((targs[i] + 1) % 10 === 0) {
        targets.push(targs[i] - 1);
        targets.push(targs[i] - 10);
        targets.push(targs[i] + 10);
      } else {
        targets.push(targs[i] - 1);
        targets.push(targs[i] + 1);
        targets.push(targs[i] - 10);
        targets.push(targs[i] + 10);
      }
    }
    if (targets.every((target) => playerBoard.includes(target))) {
      targets = findRandomTarget();
    }
    return targets;
  };

  const getPreferredTargets = () => {
    if (targetValue.length < 2) return [];
    const preferredTargets = [];
    for (let i = 0; i < targetValue.length; i++) {
      for (let j = 0; j < targetValue.length; j++) {
        if (targetValue[i] === targetValue[j] + 1) {
          if (targetValue[i] + (1 % 10) !== 0) {
            preferredTargets.push(targetValue[i] + 1);
          }
          if (targetValue[j] % 10 !== 0) {
            preferredTargets.push(targetValue[j] - 1);
          }
        }
        if (targetValue[i] === targetValue[j] + 10) {
          if (targetValue[i] + 10 < 100) {
            preferredTargets.push(targetValue[i] + 10);
          }
          if (targetValue[j] - 10 >= 0) {
            preferredTargets.push(targetValue[j] - 10);
          }
        }
      }
    }
    console.log("preferredTargets: " + preferredTargets);
    return preferredTargets;
  };

  const startGame = () => {
    if (boardReady && !gameWon) {
      setGameStarted(true);
    } else if (gameWon) {
      refresh();
    }
  };
}