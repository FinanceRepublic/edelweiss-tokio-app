import React, { useEffect, useState } from 'react'

export default function TableInputFields({fieldName,fieldValue,updatedData}:{fieldName:string,fieldValue:string,updatedData:any}) {

    
    const [inputField,setInputField] = useState(fieldName)
    const [inputFieldValue,setInputFieldValue] = useState<any>(undefined)

    let styling ={
        input:{
          fontSize:"2rem",
          margin:"0.5rem 0",
          padding:"1rem 1rem"
        }
      }
    useEffect(()=>{
        if(inputFieldValue===undefined)
        return ;
                
        updatedData.current[fieldName] = inputFieldValue
       // console.log("inputFieldValueChanged",updatedData.current)
    },[inputFieldValue])

    useEffect(()=>{
      //  console.log("rendered again",fieldName,fieldValue)
    },[])
    useEffect(()=>{
       // console.log("rendered everytime",fieldName,inputField,fieldValue,inputFieldValue,)
        
    })
    return (
    <tr>
        <th>{fieldName}</th>
        
        <td >
          <input 
            style={styling.input} 
            type="text" 
            value={inputFieldValue===undefined?fieldValue:inputFieldValue} 
            onChange={(ev)=>setInputFieldValue(ev.target.value)}
            />
        </td>
    </tr>
  )
}
