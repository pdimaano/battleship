import React from "react";

const GridPosition = ({
    board,
    coords,
    placeShip,
    switchPlayer,
    currentPlayer,
    gameStarted,
    handleHover,
    isHovering = [],
    cpuIsHovering = [],
    cpuShips,
    cpuBoard,
    setCpuBoard,
    gameOver,
    gameWon
    }) => {

    let classname = 'square';
    if (isHovering) {
        classname += isHovering.includes(coords) ? ' hover-ship' : '';
    }
    if (cpuIsHovering) {
        classname += cpuIsHovering.includes(coords) ? ' hover-aim' : '';
    }
    
    const handleClick = (e) => {
        if(gameWon) return
        if(currentPlayer === "Computer") return
        if(!gameStarted && board === "Player"){
            e.preventDefault();
            placeShip(coords)
        }
        if(board === "Computer"){
            e.preventDefault();
            shotOutcome();
        }
    };

    const shotOutcome = () => {
        if (board === "Computer"){
            if(cpuBoard.includes(coords)) return
            setCpuBoard((currentBoard) => [...currentBoard, coords])
            for(let i = 0; i < cpuShips.length; i++){
                for(let j = 0; j < cpuShips[i].coords.length; j++){
                    if (cpuShips[i].coords[j] === coords){
                        document.getElementById(`${board}-${coords}`).style.backgroundColor = "red";
                        cpuShips[i].health --;
                        if(cpuShips[i].health === 0){
                            cpuShips[i].status = "sunk";
                            for(let k = 0; k < cpuShips[i].size; k++){
                                document.getElementById(`${board}-${cpuShips[i].coords[k]}`).style.backgroundColor = "darkred";
                            }
                        }
                        if(cpuShips.every(ship => ship.status === "sunk")){
                            gameOver("Player");
                        }
                        switchPlayer();
                        return
                    }
                }
            }
            document.getElementById(`${board}-${coords}`).style.backgroundColor = "var(--miss)"
            switchPlayer();
        }
    }
    const hoverPositions = () => {
        if(board === "Player"){
            if (!handleHover) return;
            handleHover(coords);
        } else if (board === "Computer"){
            if (!handleHover) return;
            handleHover(coords)
        }
    };

    return(
        <div
            className={`grid-square ${board} ${classname}`}
            onClick={(e) => handleClick(e)}
            onMouseEnter={hoverPositions}
            id={`${board}-${coords}`}
        />
    )
}

export default GridPosition