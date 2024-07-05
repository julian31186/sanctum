import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useEffect } from 'react'
import words from '../../dictionary.json'
import './App.css'

const port = ":5000"
const base = `https://localhost${port}`
const endpoint = "/query"

function randomWord(entries) {
  var arr = Object.keys(entries)
  return arr[Math.floor(Math.random() * arr.length)]
}

function App() {

  useEffect(() => {
    var newWord = randomWord(words)
    document.getElementById("word").textContent = newWord
  },[])

  return (
    <>
      <h1 class="header">Sanctum</h1>
      <div class="main">
        <h2 id="word" class="word"></h2>
        <div class="input-box">
          <input placeholder='Write definition'></input>
          <button class="show-definition">Show Definition</button>
        </div>
      </div>
    </>
  )
}

export default App
