import { useCallback, useState } from 'react';
import './App.css'
import SaisieAdresse from './SaisieAdresse';
 
function App() {
  const [adresse, setAdresse] = useState('')

  const handleAdresseChange = useCallback((add:string)=>{
    setAdresse(add)
  }, [adresse])

  return (
    <>
    
    <div className='container'>
    <p>L'adresse saisie est {adresse}</p>
      <SaisieAdresse fnUp={handleAdresseChange}></SaisieAdresse>
    </div>
    <p>Text caché plus tard</p>
    
    </>
  );
}
 
export default App