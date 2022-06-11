import React, { useRef, useState, useEffect } from "react";
import { formatBytes } from "../formats";
import { IoDocumentAttach } from "react-icons/io5";
import { sendMail } from "../api";
import { AiFillDelete } from 'react-icons/ai'

const Form = () => {
  const [files, setFiles] = useState([]); 
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("No Subject");
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [allowed,setAllowed] = useState(false);

  const inputFile = useRef(null);

  const handleClick = (e) => {
    inputFile.current.click();
  };

  const handleOnChange = (e) => {
    setFiles(Array.from(e.target.files));


  };

  const isValidate = (email) => {    
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateEmail = () => {
    if (!isValidate(email)) {
      setValidated(false);
    } else {
      setValidated(true);
    }
  };

  const isAllowed = ()=>{
    if(validated && files.length <= 3){
      setAllowed(true)
    }else{
      setAllowed(false)
    }
  }
  

  const handleSend = async (e) => {

    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", message);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    if (validated && allowed ) {      
      try {
        const { data, status } = await sendMail(formData);
        console.log(data + " " + status);
      } catch (error) {
        console.log(error.message);
      }
    } 
  };

  const removeFile = (item) =>{
    setFiles( files.filter((file) => file !== item));
  }
  

  useEffect(() => {
    validateEmail() 
    isAllowed()   
  }, [email,files,allowed,validated])

  return (
    <div className="grid  gap-4 grid-cols-2 ">
      <form className="w-full max-w-lg m-auto mt-20 p-2 border-2 rounded-xl border-black ">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-password"
            >
              Reciever
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {validated ? (
              <></>
            ) : (
              <label className="block  tracking-wide text-red-500 text-xs  mt-2">
                Enter Valid Email
              </label>
            )}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-password"
            >
              Subject
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="subject"
              type="subject"
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-password"
            >
              Message
            </label>
            <textarea
              className=" no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none"
              id="message"
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3">
            <>
              <button
                className="shadow bg-teal-400 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={handleClick}
              >
                <IoDocumentAttach size={25} />
              </button>
              <input
                type="file"
                id="file"
                ref={inputFile}
                onChange={handleOnChange}
                multiple
                style={{ display: "none" }}
              />
            </>
          </div>
          <div className="md:w-1/3 ml-10">
            {allowed ? 
            (<button className="shadow bg-teal-400 text-white font-bold py-2 px-4 rounded"onClick={handleSend}>Send</button>) 
            : (<button className="shadow bg-teal-200 text-white font-bold py-2 px-4 rounded" disabled={true} >Send</button>)}
            
          </div>
          <div className="md:w-2/3"></div>
        </div>
      </form>
      <div className = 'w-full max-w-lg m-auto mt-20 p-2 border-2 rounded-xl border-black'>
        <h2 className="text-xl font-sans">Attachments</h2>
        {files.length ? (files.map((file,i) =>{
          return(            
            <div className="grid grid-cols-3 gap-1 mt-4 border-2 rounded-xl p-2 border-black   ">              
              <h3 className="text-l">{file.name.slice(0,20)}</h3>
              <h3 className="text-l ml-20">{formatBytes(file.size,1)}</h3>
              <button className="h-10 w-10 bg-teal-400 ml-20 p-2 text-white rounded-md" onClick={e => removeFile(file)}><AiFillDelete  size={25} /> </button>                     
            </div>
          )
        })) : <></>}
        <hr className="mt-2  h-2 " />
        <div className="grid grid-cols-2 gap-1 mt-4    ">
          <h3 className="text-l">Files: {files.length}</h3>          
          <button className="h-10 w-20 bg-teal-400 ml-20 p-2 text-white rounded-md font-bold" onClick={e => setFiles([])}>Clear </button>                     

        </div>
        <div>
          {files.length >3 ? (<h3 className="text-xs text-red-500">Warning: The limit of files 3</h3>) : (<></>)}
        
        </div>
      </div>
    </div>
  );
};

export default Form;
