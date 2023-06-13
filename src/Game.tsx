import { useState, useEffect } from "react";

import Square from "./Square";

type Scores = {
	[key: string]: number;
};

const INTIAL_GAME_STATE = ["", "", "", "", "", "", "", "", ""];
const INTIAL_SCORES: Scores = { X: 0, O: 0, D: 0 };
const WINNNG_COMBOS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

function Game() {
	const [gameState, setGameState] = useState(INTIAL_GAME_STATE);
	const [currentPlayer, setCurrentPlayer] = useState("X");
	const [scores, setScores] = useState(INTIAL_SCORES);

	useEffect(() => {
		const storedScores = localStorage.getItem("scores");
		if (storedScores) {
			setScores(JSON.parse(storedScores));
		}
	}, []);

	useEffect(() => {
		if (gameState === INTIAL_GAME_STATE) {
			return;
		}
		checkForWinner();
	}, [gameState]);

	const resetBoard = () => setGameState(INTIAL_GAME_STATE);

	const handleWin = () => {
		window.alert(
			`Congratulations player ${currentPlayer}! You are the winner!`
		);

		const newPlayerScore = scores[currentPlayer] + 1;
		const newScores = { ...scores };
		newScores[currentPlayer] = newPlayerScore;
		setScores(newScores);
		localStorage.setItem("scores", JSON.stringify(newScores));

		resetBoard();
	};
	const handleDraw = () => {
		window.alert("The game ended in a draw");

		const newPlayerScore = scores["D"] + 1;
		const newScores = { ...scores };
		newScores["D"] = newPlayerScore;
		setScores(newScores);
		localStorage.setItem("scores", JSON.stringify(newScores));

		resetBoard();
	};

	const checkForWinner = () => {
		let roundWon = false;

		for (let i = 0; i < WINNNG_COMBOS.length; i++) {
			const winCombo = WINNNG_COMBOS[i];

			let a = gameState[winCombo[0]];
			let b = gameState[winCombo[1]];
			let c = gameState[winCombo[2]];

			if ([a, b, c].includes("")) {
				continue;
			}
			if (a === b && b === c) {
				roundWon = true;
				break;
			}
		}
		if (roundWon) {
			setTimeout(() => handleWin(), 500);
			return;
		}

		if (!gameState.includes("")) {
			setTimeout(() => handleDraw(), 500);
			return;
		}

		changePlayer();
	};

	const changePlayer = () => {
		setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
	};

	const handleCellClick = (event: any) => {
		const cellIndex = Number(event.target.getAttribute("data-cell-index"));

		const currentValue = gameState[cellIndex];
		if (currentValue) {
			return;
		}

		const newValues = [...gameState];
		newValues[cellIndex] = currentPlayer;
		setGameState(newValues);
	};

	return (
		<div className="h-fit p-8 text-slate-800 bg-cover bg-gradient-to-r from-yellow-500 to-pink-400 md:flex flex-col">
			<h1 className="text-center text-5xl mb-4 font-display text-white">
				Tic Tac Toe
			</h1>
			<div>
				<div className="grid grid-cols-3 gap-3 mx-auto w-96">
					{gameState.map((player, index) => (
						<Square
							key={index}
							onClick={handleCellClick}
							{...{ index, player }}
						/>
					))}
				</div>
			</div>
			<div className="mx-auto w-96 text-2xl text-serif">
				<p className=" text-white mt-5">
					Next Player: <span>{currentPlayer}</span>
				</p>
				<p className=" text-white mt-5">
					Player X wins: <span>{scores["X"]}</span>
				</p>
				<p className=" text-white mt-5">
					Player O wins: <span>{scores["O"]}</span>
				</p>

				<p className=" text-white mt-5">
					Total Draw(s): <span>{scores["D"]}</span>
				</p>
			</div>
		</div>
	);
}

export default Game;
