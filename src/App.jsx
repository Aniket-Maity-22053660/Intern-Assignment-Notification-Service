import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Main_page } from './component/Main_Page.jsx'
import { ToastContainer } from 'react-toastify';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Main_page />
        <ToastContainer />
      </div>
    </>
  )
}

export default App
