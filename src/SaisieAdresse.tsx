import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useDebounce } from "use-debounce";

interface SaisieAdresseProps {
    fnUp: (add:string) => void;
}

export default function SaisieAdresse({fnUp}: SaisieAdresseProps){
    const [saisie, setSaisie] = useState('');
    const [addresses, setAddresses] = useState<string[]>([]);
    const [debounceValue] = useDebounce(saisie, 500);

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

    useEffect(() => {
        const fetchAddresses = async () => {
          if (debounceValue.length > 3 ) {
            const fetchedAddresses = await fetchData(debounceValue);
            if(fetchedAddresses[0] === debounceValue){
                setAddresses([]);
            }
            else {
                setAddresses(fetchedAddresses);
            }
          }else{
            setAddresses([]);
          }
        };
      
        fetchAddresses();
      }, [debounceValue]);

      const handleSaisie = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        fnUp(value);
        setSaisie(value);
      }, []);
    
      const handleClickSelection = useCallback((add:string)=>{
        setAddresses([]);
        setSaisie(add);
        fnUp(add);
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