import { ChangeEvent, useCallback, useState } from "react"

export default function SaisieAdresse(){
    const [saisie, setSaisie] = useState('')
    const [addresses, setAddresses] = useState<string[]>([]);
    async function fetchData(address:string) {
        try {
          const response = await fetch("https://api-adresse.data.gouv.fr/search/?q="+address);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          const adList:string[] = []
    
          data.features.map(function(add:any){
            adList.push(add.properties.label)
          })
          
          return adList;
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
      }  

      const handleSaisie = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSaisie(value);
        if (value.length > 3) {
          try {
            const fetchedAddresses = await fetchData(value);
            setAddresses(fetchedAddresses);
          } catch (error) {
            console.error(error);
          }
        } else {
          setAddresses([]);
        }
      }, []);
    
      const handleClickSelection = useCallback((add:string)=>{
        setAddresses([]);
        setSaisie(add)
      }, [])
    return (
        <div className='input'>
        <input value={saisie} onChange={handleSaisie}/>
        <div className="results">
          {addresses.map((add, index) => (
            <button key={index} onClick={() => handleClickSelection(add)}>{add}</button>
          ))}
        </div>
      </div>
      )
}