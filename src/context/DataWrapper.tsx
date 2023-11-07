import React, { useState,createContext, useContext, useEffect, useRef } from 'react'
import AddOnlySuggestiveMsg from '../components/AddOnlySuggestiveMsg'
import AddTextMsg from '../components/AddTextMsg'
import {io} from 'socket.io-client';
import {v4 as uuidv4} from 'uuid'
import { useAuth } from './AuthContext';

const Context = createContext('')
type Data = {
        type:string,
        query: string, 
        label:string,
        replies: string[],
        color: string,
        iconColor:string,
        similarity_query:string,
        imageurl:string,
        value:string,
        radio:string[],
        content:string[],
        id:string,
        iconName:string,
        imageUrl:string,
        sessionid :string,
        audiofiletimestamp:string,
        loading:boolean
        initquery:boolean
} 
export function useData(){
    return useContext(Context)
}
 
export default function DataWrapper({children}:{children:React.ReactNode}) {
    
    const [data,setData] = useState<Object[]>([])
    //@ts-ignore
    const {ngrokUrl,currentUser}= useAuth()
    let url1 =`vitt-ai-request-broadcaster-production.up.railway.app`
     let baseUrl = 'https://b67d-49-204-215-128.ngrok-free.app/'
    //let url2 = 'http://localhost:5000'
    const [tableData,setTableData] = useState([])
    const tableDataRef = useRef([])

    const [socket,setSocket] = useState<any>(null)
    const [SESSION_ID,setSessionId] = useState('') 
    const tempRef = useRef("")
    const [msgLoading,setMsgLoading] = useState<boolean>(false);
    const [audioArr,setAudioArr] = useState<any>([])
    let audioUrlRef = useRef(null)
    const [audioUrlFlag,setAudioUrlFlag] = useState<boolean>(false)

    let Data = {
        color: "#7D11E9",
        content: ['A mutual fund pools investment from multiple inves…and debt instruments <br/>2. Shares <br/>3. Bonds'],
        iconColor: "blue",
        initquery: "what is mutual fund? what is mutual fund? is mutual fund what is mutual fund what is mutual fund",
        match_score: "0.9741857",
        matched_query: "what is a mutual fund",
        query: ['what is a mutual fund'],
        raw_modded_query: "what is mutual fund fund",
        sessionid: ['aff2b452-5014-4132-8d6d-6ccfa8d520b1'],
        similarity_query: "Definition of mutual fund"
    }
    

    function handleAudio(base64:string,filename:string){
        //@ts-ignore
        setAudioArr(prev=>[...prev,{base64:base64,filename:filename}])
    }
    function handleData(data:any){
        setMsgLoading(false)
        let arr:Data[] =[]
        //@ts-ignore
        let obj:Data = {}
// "sessionid": <str>, "audiofiletimestamp": <str>
        
        if(data?.loading){
            return ;
        }
        if(data?.audiourl!=null){
            audioUrlRef.current = data.audiourl
            setAudioUrlFlag(prev=>!prev)
            //setAudioUrl('https://files.gospeljingle.com/uploads/music/2023/04/Taylor_Swift_-_August.mp3')
        }
        if(data?.imageurl){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["type"]="ImageMsg"
            obj["imageUrl"] = data.imageurl;
            obj["iconName"] = 'fa-solid fa-forward-fast'
            obj["similarity_query"] = data.similarity_query;
            obj["color"]= data.color;
            obj["iconColor"] = data.iconColor 
            obj["sessionid"] = data.sessionid;
            obj["audiofiletimestamp"]=data.audiofiletimestamp
            obj["initquery"] = false
            //arr.push(obj)
            arr = [obj,...arr]
            //@ts-ignore
            obj = {}
        }
        if(data?.value){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["type"]="InputForm"
            obj["iconName"] = "fa-regular fa-pen-to-square"
            obj["value"] = data.value 
            obj["label"] = data.label 
            obj["color"] = data.color 
            obj["iconColor"] = data.iconColor 
            obj["similarity_query"] = data.similarity_query;
            obj["sessionid"] = data.sessionid
            obj["audiofiletimestamp"]=data.audiofiletimestamp
            obj["initquery"] = false
            //arr.push(obj)
            arr = [obj,...arr]
            //@ts-ignore
            obj = {}
        }
        if(data?.radio){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["type"]="RadioForm"
            obj["iconName"] = 'fa-regular fa-pen-to-square'
            obj["label"] = data.label 
            obj["radio"] = data.radio
            obj["color"] = data.color
            obj["iconColor"] = data.iconColor 
            obj["similarity_query"] = data.similarity_query;
            obj["sessionid"] = data.sessionid
            obj["audiofiletimestamp"]=data.audiofiletimestamp
            obj["initquery"] = false
            //arr.push(obj)
            arr = [obj,...arr]
            //@ts-ignore
            obj={}
        }
        if(data?.content){
            data.content.map((e:any,i:number)=>{
                //@ts-ignore
                obj["id"]= uuidv4()
                obj["type"]="TextMsg"
                obj["content"] = e 
                obj["iconName"] = 'fa-solid fa-circle-question'
                obj["color"]= data.color 
                obj["iconColor"] = data.iconColor
                obj["similarity_query"] = data.similarity_query;
                obj["sessionid"] = data.sessionid
                obj["audiofiletimestamp"]=data.audiofiletimestamp
                obj["initquery"] = false
                //arr.push(obj)
                arr = [obj,...arr]
                //@ts-ignore
                obj={}
            })
            
        }
        // if(data?.initquery.length>"1"){
        //         obj["id"]= uuidv4()
        //         obj["type"]="TextMsg"
        //         obj["content"] = data.initquery
        //         obj["iconName"] = 'fa-solid fa-circle-question'
        //         obj["color"]= data.color 
        //         obj["iconColor"] = data.iconColor
        //         obj["similarity_query"] = "Transcription captured";
        //         obj["sessionid"] = data.sessionid
        //         obj["audiofiletimestamp"]=data.audiofiletimestamp
        //         obj["initquery"] = true
        //         //arr.push(obj)
        //         arr = [...arr,obj]
        //         //@ts-ignore
        //         obj={}
        // }
        if(data?.replies){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["type"] = "SuggestiveMsg"
            obj["replies"] = data.replies
            obj["color"] = data.color
            obj["iconColor"] = data.iconColor 
            obj["similarity_query"] = data.similarity_query;
            obj["iconName"] = 'fa-solid fa-forward-fast'
            obj["sessionid"] = data.sessionid
            obj["audiofiletimestamp"]=data.audiofiletimestamp
            obj["initquery"] = false
            //arr.push(obj)
            arr = [obj,...arr]
            //@ts-ignore
            obj={}
           
        } 

       console.log(arr)
       setData(prev=>[...arr,...prev])
       //console.log(obj)
    }

    function updateForm(result:any){
      console.log("updateForm triggered",result)
      if(result.fields !== null){
                        //@ts-ignore
                        tableDataRef.current = tableDataRef.current.map((ob)=>{
                            if(result.fields.hasOwnProperty(Object.keys(ob)[0])===true ){
                                let obj = new Object()
                                //@ts-ignore
                                obj[Object.keys(ob)[0]] = result.fields[Object.keys(ob)[0]]
                                return obj 
                            }
                            else return ob 
                        })
                        //tableDataRef.current = {...tableDataRef.current,...result?.fields}
                        //console.log('res from audio server 2',tableDataRef.current)
                        setTableData(prev=>[...tableDataRef.current])
                    }
    }

    useEffect(()=>{
      const tempSocket = io(url1)
      setSocket(tempSocket)

      // function executeBeforeTabClose(e:Event){
      //   fetch(url,{
      //     method:'POST',
      //     headers:{
      //        'Accept':'application.json',
      //        'Content-Type':'application/json'
      //     },
      //     body:JSON.stringify({
      //         sessionid:data.id,
      //         mobileno:data.mob,
      //         //@ts-ignore
      //         audio_message:base64data.split(',')[1],
      //         timeStamp:`${date.toLocaleDateString()} ${date.toLocaleTimeString()}:${date.getMilliseconds()}`
      //     }),
      //     cache:'default',}).then(res=>{
      //        return res.json()
      //     }).then(result=>{
      //         console.log("res from audio server",result)

              
      //     })
      // }

      // window.addEventListener('beforeunload',executeBeforeTabClose,{capture:true})

      // return ()=>{
      //   window.removeEventListener('beforeunload',executeBeforeTabClose,{capture:true})
      // }
    },[])


    useEffect(()=>{
        console.log(data)
    },[data])

    useEffect(()=>{
        console.log('i am session id at data-wrapper',SESSION_ID)
    },[SESSION_ID])

    useEffect(()=>{
        if(SESSION_ID==='' || socket===null)
        return;

        function onConnect(){
                console.log("connection established");
                console.log(socket.id)
             socket.emit('join-room',SESSION_ID,socket.id)
        }
        function onDisconnect(){
            console.log("disconnected")
        }

       socket.on("connect",onConnect)
       socket.on("disconnect",onDisconnect)

       return ()=>{
           socket.off("connect",onConnect)
           socket.off('disconnect',onDisconnect)
       }
    },[SESSION_ID,socket])

    useEffect( ()=>{
       // handleData(Data)
        if(socket===null || currentUser===null)
        return ;

        function receiveData(data:any){
                console.log(data);
                if(tempRef.current ===data){
                    //console.log("tempRef current",tempRef.current)
                    return ;
                }
                console.log(data.sessionid ===currentUser.sessionid,data.sessionid)
                if(data.sessionid === currentUser.sessionid){
                  if('type' in data ===true)
                     updateForm(data)
                  else handleData(data)
                  // handleAudio(data.speech_bytes,data.file_name)
                }
        }
        socket.on("receive-data",receiveData)
        return ()=>{
            socket.off("receive-data",receiveData)
        }
    },[currentUser,socket])

    
   //@ts-ignore
    function sendToServer(blob,url,data){
        
        console.log(`sending`)
        let reader = new FileReader();
        reader.onloadend = ()=>{
            let base64data = reader.result;
            blob = null
           //console.log(base64data.split(',')[1])
    
            //https://f6p70odi12.execute-api.ap-south-1.amazonaws.com
            //http://localhost:5002/base64
            
            console.log('inside send to server',data);
           
            let date = new Date()
            
            fetch(url,{
                method:'POST',
                headers:{
                   'Accept':'application.json',
                   'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    sessionid:data.id,
                    mobileno:data.mob,
                    //@ts-ignore
                    audio_message:base64data.split(',')[1],
                    timeStamp:`${date.toLocaleDateString()} ${date.toLocaleTimeString()}:${date.getMilliseconds()}`
                }),
                cache:'default',}).then(res=>{
                   return res.json()
                }).then(result=>{
                    console.log("res from audio server",result)

                    
                })
            
        }
        reader.readAsDataURL(blob)
    }

    function bufferToWav(abuffer:ArrayBuffer, len:number) {
        //console.log("abuffer", abuffer, len);

        //@ts-ignore
        var numOfChan = abuffer.numberOfChannels,
          length = len * numOfChan * 2 + 44,
          buffer = new ArrayBuffer(length),
          view = new DataView(buffer),
          channels = [],
          i,
          sample,
          offset = 0,
          pos = 0;
      
        // write WAVE header
    
        //console.log("pos", pos, length);
        setUint32(0x46464952); // "RIFF"
        //console.log("pos", pos, length);
        setUint32(length - 8); // file length - 8
        //console.log("pos", pos, length);
        setUint32(0x45564157); // "WAVE"
        //console.log("pos", pos, length);
        setUint32(0x20746d66); // "fmt " chunk
        //console.log("pos", pos, length);
        setUint32(16); // length = 16
        //console.log("pos", pos, length);
        setUint16(1); // PCM (uncompressed)
        //console.log("pos", pos, length);
        setUint16(numOfChan);
        //console.log("pos", pos, length);
        //@ts-ignore
        setUint32(abuffer.sampleRate);
        //console.log("pos", pos, length);
        //@ts-ignore
        setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        //console.log("pos", pos, length);
        setUint16(numOfChan * 2); // block-align
        //console.log("pos", pos, length);
        setUint16(16); // 16-bit (hardcoded in this demo)
        //console.log("pos", pos, length);
        setUint32(0x61746164); // "data" - chunk
        //console.log("pos", pos, length);
        setUint32(length - pos - 4); // chunk length
        //console.log("pos", pos, length);
    
        // write interleaved data
        //@ts-ignore
        for (i = 0; i < abuffer.numberOfChannels; i++)
            //@ts-ignore
          channels.push(abuffer.getChannelData(i));
      
        while (pos < length) {
          for (i = 0; i < numOfChan; i++) {
            // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true); // write 16-bit sample
            pos += 2;
          }
          offset++; // next source sample
        }
      
        return buffer;
        //@ts-ignore
        function setUint16(data) {
          view.setUint16(pos, data, true);
          pos += 2;
        }
        //@ts-ignore
        function setUint32(data) {
          view.setUint32(pos, data, true);
          pos += 4;
        }
    }

    function downsampleToWav(file:any, callback:CallableFunction) {
        //Browser compatibility
        // https://caniuse.com/?search=AudioContext

        //@ts-ignore
        const AudioContext = window.AudioContext || window.webkitAudioContext || AudioContext;
        const audioCtx = new AudioContext();
        const fileReader1 = new FileReader();
        fileReader1.onload = function (ev) {
          // Decode audio
          //@ts-ignore
          audioCtx.decodeAudioData(ev.target.result, (buffer) => {
            // this is where you down sample the audio, usually is 44100 samples per second
            const usingWebkit = !window.OfflineAudioContext;
            //console.log("usingWebkit", usingWebkit);

            //@ts-ignore
            const OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
            // {
            //   numberOfChannels: 1,
            //   length: 16000 * buffer.duration,
            //   sampleRate: 16000
            // }
            var offlineAudioCtx = new OfflineAudioContext(
              1,
              16000 * buffer.duration,
              16000
            );
      
            let soundSource = offlineAudioCtx.createBufferSource();
            soundSource.buffer = buffer;
            soundSource.connect(offlineAudioCtx.destination);
      
            const reader2 = new FileReader();
            reader2.onload = function (ev) {
              const renderCompleteHandler = function (evt:any){
                //console.log("renderCompleteHandler", evt, offlineAudioCtx);
                let renderedBuffer = usingWebkit ? evt.renderedBuffer : evt;
                const buffer = bufferToWav(renderedBuffer, renderedBuffer.length);
                if (callback) {
                  callback(buffer);
                }
              };
              if (usingWebkit) {
                offlineAudioCtx.addEventListener("complete", renderCompleteHandler);
                offlineAudioCtx.startRendering();
              } else {
                offlineAudioCtx
                  .startRendering()
                  .then(renderCompleteHandler)
                  .catch(function (err) {
                    console.log(err);
                  });
              }
            };
            reader2.readAsArrayBuffer(file);
      
            soundSource.start(0);
          });
        };
      
        fileReader1.readAsArrayBuffer(file);
    }

    function encodeMp3(arrayBuffer:any) {
    
        //@ts-ignore
        const wav = lamejs.WavHeader.readHeader(new DataView(arrayBuffer));
        console.log("i am wav", wav);
        const dataView = new Int16Array(arrayBuffer, wav.dataOffset, wav.dataLen / 2);
        //@ts-ignore
        const mp3Encoder = new lamejs.Mp3Encoder(wav.channels, wav.sampleRate, 128);
        const maxSamples = 1152;
      
        console.log("wav", wav);
      
        const samplesLeft =
          wav.channels === 1
            ? dataView
            : new Int16Array(wav.dataLen / (2 * wav.channels));
      
        const samplesRight =
          wav.channels === 2
            ? new Int16Array(wav.dataLen / (2 * wav.channels))
            : undefined;
      
        if (wav.channels > 1) {
            //@ts-ignore
          for (var j = 0; j < samplesLeft.length; i++) {
            samplesLeft[j] = dataView[j * 2];
            //@ts-ignore
            samplesRight[j] = dataView[j * 2 + 1];
          }
        }
      
        let dataBuffer = [];
        let remaining = samplesLeft.length;
        for (var i = 0; remaining >= maxSamples; i += maxSamples) {
          var left = samplesLeft.subarray(i, i + maxSamples);
          var right;
          if (samplesRight) {
            right = samplesRight.subarray(i, i + maxSamples);
          }
          var mp3buf = mp3Encoder.encodeBuffer(left, right);
          dataBuffer.push(new Int8Array(mp3buf));
          remaining -= maxSamples;
        }
      
        const mp3Lastbuf = mp3Encoder.flush();
        dataBuffer.push(new Int8Array(mp3Lastbuf));
        return dataBuffer;
    }

    useEffect(()=>{

      if(currentUser===null)
      return ;

        //@ts-ignore
        let myVad=null;
        async function VAD(cb1:CallableFunction,cb2:CallableFunction){
        
            //@ts-ignore
            const myvad = await vad.MicVAD.new({
                onSpeechStart: cb1,
                onSpeechEnd: cb2
              })
            myVad =myvad;
          }


      let stop:Function
      let medRec =null
      let flag=false ;

      function getWavBytes(buffer:any, options:any) {
        const type = options.isFloat ? Float32Array : Uint16Array
        const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT
      
        const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }))
        const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);
      
        // prepend header, then add pcmBytes
        wavBytes.set(headerBytes, 0)
        wavBytes.set(new Uint8Array(buffer), headerBytes.length)
      
        return wavBytes
      }
      
      function getWavHeader(options:any) {
        const numFrames =      options.numFrames
        const numChannels =    options.numChannels || 2
        const sampleRate =     options.sampleRate || 44100
        const bytesPerSample = options.isFloat? 4 : 2
        const format =         options.isFloat? 3 : 1
      
        const blockAlign = numChannels * bytesPerSample
        const byteRate = sampleRate * blockAlign
        const dataSize = numFrames * blockAlign
      
        const buffer = new ArrayBuffer(44)
        const dv = new DataView(buffer)
      
        let p = 0
      
        function writeString(s:string) {
          for (let i = 0; i < s.length; i++) {
            dv.setUint8(p + i, s.charCodeAt(i))
          }
          p += s.length
        }
      
        function writeUint32(d:any) {
          dv.setUint32(p, d, true)
          p += 4
        }
      
        function writeUint16(d:any) {
          dv.setUint16(p, d, true)
          p += 2
        }
      
        writeString('RIFF')              // ChunkID
        writeUint32(dataSize + 36)       // ChunkSize
        writeString('WAVE')              // Format
        writeString('fmt ')              // Subchunk1ID
        writeUint32(16)                  // Subchunk1Size
        writeUint16(format)              // AudioFormat https://i.stack.imgur.com/BuSmb.png
        writeUint16(numChannels)         // NumChannels
        writeUint32(sampleRate)          // SampleRate
        writeUint32(byteRate)            // ByteRate
        writeUint16(blockAlign)          // BlockAlign
        writeUint16(bytesPerSample * 8)  // BitsPerSample
        writeString('data')              // Subchunk2ID
        writeUint32(dataSize)            // Subchunk2Size
      
        return new Uint8Array(buffer)
      }

      function start(){
            console.log("caling the function")
           // sendVadStreamToServer(myStream,usersArrRef.current[0],adminUrl,4000)
      }
      
      function stop1(audio:any){
          //console.log("stop tiggered",audio)
        
        //@ts-ignore
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createBufferSource();

        const myArrayBuffer = audioCtx.createBuffer(
            1,
            audio.length,
            16000,
          );

        let nowBuffering;
        for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
            // This gives us the actual array that contains the data
            nowBuffering = myArrayBuffer.getChannelData(channel);
          //  console.log('array buffer length',myArrayBuffer.length)
            for (let i = 0; i < myArrayBuffer.length; i++) {
              // Math.random() is in [0; 1.0]
              // audio needs to be in [-1.0; 1.0]
              nowBuffering[i] = audio[i]*2;
            }
          }
        
        const ch1Data = myArrayBuffer.getChannelData(0)
        const floatArr = new Float32Array(ch1Data.length)
        
        console.log("duration",myArrayBuffer.duration)
        const wavBytes = getWavBytes(nowBuffering?.buffer, {
                isFloat: true,       // floating point or 16-bit integer
                numChannels: 1,
                sampleRate: 16000,
            })
        const wavBlob = new Blob([wavBytes], { type: 'audio/ogg' })
        
        downsampleToWav(wavBlob,(buffer:ArrayBuffer)=>{
            const mp3Buffer = encodeMp3(buffer)
            let blob = new Blob(mp3Buffer,{type:"audio/mp3"});
            let data = {
                id:currentUser.sessionid,
                mob:12345,
            }
            let liveAudioRoute = `send_audio`
            let url = `${ngrokUrl}/${liveAudioRoute}`
            sendToServer(blob,url,data)
        })
       
      }

      function activateVad(){
        console.log("vad activated",currentUser)
        VAD(start,stop1).then(vad=>{
          //@ts-ignore
           myVad.start()
        })
      }

      let timeoutId = setTimeout(()=>{
        activateVad()
      },100)

     
      return ()=>clearTimeout(timeoutId)
    },[currentUser])

    useEffect(()=>{
      console.log("socket changed")
    },[socket])

    useEffect(()=>{
      console.log("current user changed",currentUser)
    },[currentUser])

    let values = {
        data,
        setData,
        SESSION_ID,setSessionId,
        msgLoading,
        setMsgLoading,
        audioArr,
        audioUrlFlag,audioUrlRef,
        tableData,setTableData,
        tableDataRef,
        baseUrl
    }
  return (
      //@ts-ignore
    <Context.Provider value={values}>
        {children}
    </Context.Provider>
  )
}
