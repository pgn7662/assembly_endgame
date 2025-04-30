import Message from "./Message.jsx";
import Attempts from "./Attempts.jsx";
import Keyboard from "./Keyboard.jsx";
import Word from "./Word.jsx";
import {useCallback, useEffect, useState} from "react";
import {KeyContext} from "../util/KeyContext.js";
import ReactConfetti from "react-confetti";
import NewGameButton from "./NewGameButton.jsx";
import {faker} from "@faker-js/faker"
import getLanguages from "../util/languages.js";

export default function Content() {
    const languages = getLanguages().map((language, index) => ({...language, id: index}))
    const [guessedCharacters, setGuessedCharacters] = useState([])
    const [solution, setSolution] = useState(getRandomWord)
    const displayedWord = solution
        .split('')
        .map((char) => guessedCharacters.includes(char) ? char : '');
    const wrongAttempts = guessedCharacters.filter(char => !solution.includes(char)).length
    const gameStatus = displayedWord.join('') === solution ? 'won' : wrongAttempts === 8 ? 'lost' : 'in-progress'
    const message = getMessage();
    const lastGuessedLetter = guessedCharacters[guessedCharacters.length - 1]

    function getMessage() {
        switch (gameStatus) {
            case 'won':
                return {
                    heading: 'You win!',
                    description: 'Well done! 🎉'
                }
            case 'lost':
                return {
                    heading: 'Game Over!',
                    description: 'You lose! Better start learning Assembly 😭'
                }
            case 'in-progress': {
                if (guessedCharacters.length && wrongAttempts > 0) {
                    let deadLanguages = languages.slice(0, wrongAttempts).reduce((accumulator, language) => {
                        accumulator += language.name + ', '
                        return accumulator
                    }, '')
                    deadLanguages = deadLanguages.substring(0, deadLanguages.length - 2)
                    return {
                        heading: 'Farewell! 🫡',
                        description: 'RIP ' + deadLanguages
                    }
                }
                return {
                    heading: 'Let Set Go!',
                    description: 'Save your favorite programming languages'
                }
            }
        }
    }

    function onCharSelect(event, selectedChar) {
        selectedChar = selectedChar || event.target.name
        if (guessedCharacters.includes(selectedChar)) {
            return;
        }
        const matchedIndices = []
        solution.split('').forEach((value, index) => value === selectedChar && matchedIndices.push(index))
        const isCorrectChar = matchedIndices.length > 0
        setGuessedCharacters(prevChars => [...prevChars, selectedChar])
    }

    function getRandomWord() {
        return faker.word.noun({length: {min: 5, max: 8}}).toUpperCase()
    }

    function resetGame() {
        setGuessedCharacters([])
        setSolution(getRandomWord)
    }

    function getKeyState(key) {
        return !guessedCharacters.includes(key) ? 'not-selected' : solution.includes(key) ? 'correct' : 'wrong'
    }

    const onType = useCallback((event) => {
        if (gameStatus !== 'in-progress') return;

        const typedLetter = event.key.toUpperCase()
        if (typedLetter.length === 1 && typedLetter.charCodeAt(0) > 64 && typedLetter.charCodeAt(0) < 91) {
            onCharSelect(undefined, typedLetter)
        }
    }, [gameStatus, onCharSelect, solution]);

    useEffect(() => {
        gameStatus !== 'in-progress' && document.removeEventListener("keyup", onType)
    }, [gameStatus])

    useEffect(() => {
        document.addEventListener("keyup", onType)
        return () => document.removeEventListener("keyup", onType)
    }, [onType])


    const contextValue = {gameStatus, onCharSelect}

    return (
        <main>
            {gameStatus === "won" && <ReactConfetti></ReactConfetti>}
            <Message desc={message.description} heading={message.heading} gameStatus={gameStatus}></Message>
            <Attempts languages={languages} wrongAttempts={wrongAttempts}></Attempts>
            <section aria-live="polite" role="status" className="hidden">
                <p>
                    {
                        solution.includes(lastGuessedLetter) ?
                            `Correct! The letter ${lastGuessedLetter} is in the word.` :
                            `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {8 - wrongAttempts} attempts left.
                </p>
                <p>
                    Current word: {displayedWord.map(letter =>
                    letter !== '' ? letter + "." : "blank.")
                    .join(" ")}
                </p>
            </section>
            <Word guessedWord={displayedWord} answer={solution} isGameOver={gameStatus === 'lost'}></Word>
            <KeyContext.Provider value={contextValue}>
                <Keyboard getKeyState={getKeyState}></Keyboard>
            </KeyContext.Provider>
            {gameStatus !== 'in-progress' && <NewGameButton onClick={resetGame}></NewGameButton>}
        </main>
    )
}