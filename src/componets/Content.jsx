import Message from "./Message.jsx";
import Attempts from "./Attempts.jsx";
import Keyboard from "./Keyboard.jsx";
import Word from "./Word.jsx";
import {useCallback, useEffect, useState} from "react";
import {nanoid} from "nanoid";
import {KeyContext} from "../util/KeyContext.js";
import ReactConfetti from "react-confetti";
import NewGameButton from "./NewGameButton.jsx";
import {faker} from "@faker-js/faker"
import getLanguages from "../util/languages.js";

export default function Content() {
    const [languages, setLanguages] = useState(getInitialLanguages)
    const [guessedCharacters, setGuessedCharacters] = useState([])
    const [solution, setSolution] = useState(getRandomWord)
    const displayedWord = solution
        .split('')
        .map((char) => guessedCharacters.includes(char) ? char : '');
    const numberOfAttemptsLeft = 8 - languages.filter(language => language.isDead).length
    const gameStatus = displayedWord.join('') === solution ? 'won' : numberOfAttemptsLeft < 1 ? 'lost' : 'in-progress'
    const message = getMessage();

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
                    description: 'You lose! Better start learning Assembly 😭 Correct answer : ' + solution
                }
            case 'in-progress': {
                if(guessedCharacters.length && numberOfAttemptsLeft < 8){
                    let deadLanguages = languages.reduce((accumulator, language, index) => {
                        accumulator += language.isDead ? language.name + ', ' : ''
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

    function getInitialLanguages() {
        return getLanguages().map(language => ({...language, id: nanoid(), isDead: false}))
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
        setLanguages(getInitialLanguages)
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
        if (guessedCharacters.length && !solution.includes(guessedCharacters.toReversed()[0])) {
            setLanguages(prevLanguages => prevLanguages.map((language, index) => {
                if (index === 8 - numberOfAttemptsLeft) {
                    return {...language, isDead: true}
                } else {
                    return language;
                }
            }))
        }
    }, [guessedCharacters])

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
            <Attempts languages={languages}></Attempts>
            <Word word={displayedWord}></Word>
            <KeyContext.Provider value={contextValue}>
                <Keyboard getKeyState={getKeyState}></Keyboard>
            </KeyContext.Provider>
            {gameStatus !== 'in-progress' && <NewGameButton onClick={resetGame}></NewGameButton>}
        </main>
    )
}