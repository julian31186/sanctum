import { useState } from 'react'
import { useEffect } from 'react'
import words from '../../dictionary.json'
import './App.css'

import { Text } from '@chakra-ui/react'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'

import { ReactTyped } from "react-typed";


function App() {

  const [accuracy, setAccuracy] = useState('')
  const [word, setWord] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [trueDefinition, setTrueDefinition] = useState('')
  const [definitionInput, setDefinitionInput] = useState('')
  const [error, setError] = useState(false)
  const [errorKey, setErrorKey] = useState(0)

  const port = ":5000"
  const base = `http://localhost${port}`
  const endpoint = "/query"

  function randomWord(entries) {
    var arr = Object.keys(entries)
    return arr[Math.floor(Math.random() * arr.length)]
  }

  function reset() {
    setWord(randomWord(words))
    setAccuracy(0)
    setHasResults(false)
    setTrueDefinition('')
    setDefinitionInput('')
    setErrorKey(0)
  }

  async function handleKeyDown(event, definition, word) {
    if (event.key === '\\') {
      event.preventDefault();
      setError(false)
      setTrueDefinition(words[word])
      setHasResults(true)
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      if (hasResults) {
        reset()
        return
      }
      if (definition.length === 0) {
        setError(true)
        setErrorKey(errorKey + 1)
        return
      }
      if (loading) {
        return 
      }
      if (!hasResults) {
        setError(false)
        await getSimilarity(definition, word)
        setHasResults(true)
      }
    }
  }

  async function getSimilarity(definition, word) {
    setLoading(true)
    let res = await fetch(base + endpoint + `?word=${word}&definition=${definition}`, {
      method: "POST"
    })

    const data = await res.json()
    setLoading(false)

    setAccuracy(data.similarity)
    setTrueDefinition(data.definition)
  }

  useEffect(() => {
    reset()
  },[])

  return (
    <>
    <div>
      <h1 className="header">Sanctum</h1>
      <div className="input">
        <h2 id="word" className="word">{word}</h2>
        <div className="accuracy">
          <CircularProgress value={Math.floor(accuracy * 100)} color='green.400'>
            <CircularProgressLabel>{Math.floor(accuracy * 100)}</CircularProgressLabel>
          </CircularProgress>
          { loading ? <Spinner ml="1rem"/> : null }
        </div>
        <div className="actual-definition">
          {trueDefinition && <ReactTyped typeSpeed={3} strings={[trueDefinition]} className="stream-definition"/>}
        </div>
        <div className="input-box">
          <textarea value={definitionInput} onChange={(e) => { setDefinitionInput(e.target.value) }} onKeyDown={(e) => handleKeyDown(e, e.target.value, word)} className="definition-input" placeholder='Write definition'></textarea>
          {error && <Text key={errorKey} className="error">Input must be non-empty</Text>}
        </div>
        <div className="description">
          <Text>Press Enter to submit, and enter a second time to move forward after receiving score</Text>
        </div>
      </div>
        
      <div className="description">
        <Text position="fixed" bottom="0">Enter a best-effort definition of the word to see how accurate it is. Press \ to display definition without guess.</Text>
      </div>
    </div>
    </>
  )
}

export default App
