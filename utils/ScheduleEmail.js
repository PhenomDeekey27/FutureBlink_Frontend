import axios from "axios";

const backendurl = import.meta.env.VITE_BACKEND_URL
console.log(backendurl)
export const scheduleEmail = async ({ to, subject, body, delay }) => {
    console.log(to,subject,body,delay)
    try {
        const res = await axios.post(`${backendurl}/api/email/schedule`, {
            to,
            subject,
            body,
            delay,
          });
          return res.data;
        
    } catch (error) {
        console.log(error ? error : error.message,"err")
        
    }
 
  };