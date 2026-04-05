import React from 'react'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden" style={{ width: '800px', margin: '0 auto' }}>
  <button
    style={{ color: '#ffffff', backgroundColor: '#6366f1', opacity: 0.8, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', left: 100, top: 150, width: 200, height: 60, position: 'absolute' }}
    className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
    onClick={() => { // Add your logic here }}
  >
    Click Me
  </button>
    </div>
  )
}

export default App
