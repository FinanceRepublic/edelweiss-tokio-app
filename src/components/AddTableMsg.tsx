import React, { useEffect, useState,useRef } from 'react'
import TableInputFields from './TableInputFields'
import { useData } from '../context/DataWrapper'
import { useAuth } from '../context/AuthContext'

export default function AddTableMsg() {
  
  //@ts-ignore
  const {tableData,setTableData,tableDataRef,baseUrl} = useData()
  //@ts-ignore
  const {ngrokUrl,currentUser} = useAuth()
  

 // const [tableData2,setTableData2] = useState({})
  const updatedData = useRef({})

  let styling ={
    input:{
      fontSize:"2rem",
      margin:"0.5rem 0",
      padding:"1rem 1rem"
    }
  }

  useEffect(()=>{
    let routeName = `send_form`
   // let baseUrl = 'https://a74c-182-72-76-34.ngrok-free.app/'
    let date = new Date()

    fetch(`${ngrokUrl}/${routeName}`,{
      method:'POST',
      headers:{
         'Accept':'application.json',
         'Content-Type':'application/json'
      },
      body:JSON.stringify({
          sessionid:currentUser.sessionid, 
          mobileno:'12345',
          timeStamp:`${date.toLocaleDateString()} ${date.toLocaleTimeString()}:${date.getMilliseconds()}`
      }),
      cache:'default'}).then(res=>{
         return res.json()
      }).then(result=>{ 
        console.log("getting form fields from server",result)
        
        let temp:[] = []
        {Object.keys(result.fields).map((e,i)=>{
          //console.log("object keys",e,result.fields[e])
          
          let ob= new Object()
          //@ts-ignore
          ob[e] = result.fields[e]
         //@ts-ignore
          temp.push(ob)
        })}

        tableDataRef.current = [...temp]
        setTableData([...tableDataRef.current])
         
  })
  },[ngrokUrl,currentUser])

  

  function updateFormData(){
    
    let routeName = `submit_feedback`
    let baseUrl = 'https://a74c-182-72-76-34.ngrok-free.app/'
    let date = new Date()

    let tempObj = {}
    

    tableDataRef.current.map((ob:any)=>{
      let ob_key = Object.keys(ob)[0]
      //@ts-ignore
      tempObj[ob_key]=ob[ob_key]
    })

    fetch(`${ngrokUrl}/${routeName}`,{
      method:'POST',
      headers:{
         'Accept':'application.json',
         'Content-Type':'application/json'
      },
      body:JSON.stringify({
          sessionid:currentUser.sessionid, 
          mobileno:'12345',
          fields:{...tempObj,...updatedData.current},
          timeStamp:`${date.toLocaleDateString()} ${date.toLocaleTimeString()}:${date.getMilliseconds()}`
      }),
      cache:'default'}).then(res=>{
         return res.json()
      }).then(result=>{ 
        console.log("res from feedback from",result) 
           
    })
    
    //console.log("updatedFormData",{...tempObj,...updatedData.current})
  }

  useEffect(()=>{
    console.log('tableData changed',tableData)
  },[tableData])

  if(tableData.length>0)
  return (
    
    <div className='second table-msg' style={{
      
      color:"black",
      textAlign:"center",
      margin:"auto 0",
      fontSize:"2.5rem",
     // backgroundColor:"white"
      }}>
        
      <table >
        <thead></thead>
        <tbody>
        {/* {Object.keys(tableData).map((e,i)=>{
          //console.log(tableDataRef.current[e])
          
          return <TableInputFields key={i} fieldName={e} fieldValue={tableData[e]} updatedData={updatedData}/>
        })} */}
        {tableData.map((ob:any,i:number)=>{
          let ob_key = Object.keys(ob)[0]
          //console.log(ob,ob_key,ob[ob_key],tableData)
          return <TableInputFields 
                        key={i} 
                        fieldName={ob_key} 
                        fieldValue={ob[ob_key]} 
                        updatedData={updatedData} 
                    />
        })}
        </tbody>
      </table>
      <button  onClick={()=>updateFormData()}>Submit</button>
    </div>
      
  )
  else return null
}
