import './App.css';
import { useSession, useSupabaseClient , useSessionContext} from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import { useState } from 'react';

const calendarId = '';

function App() {

  const [start,setStart] = useState(new Date());
  const [end,setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventeDescription, setEventDescription] = useState("");

  const session = useSession() ; //tokens, when session exist we have a user
  const supabase= useSupabaseClient(); //talk to supabase
  const {isLoading} =useSessionContext();

  if(isLoading)
  {
    return <></>
  }

  async function googleSignIn() {
      const {error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: ''
        }
      });
      if (error) 
      { 
        alert("Error loggin in to Google provider with supabase");
        console.log(error);
      
      }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createCalendarEvent()
  {
    console.log("creating calendar evet");
    const event={
      'summary': eventName,
      'description': eventeDescription,
      'start': {
        'dateTime' : start.toISOString(),  //Date.toISOString() ->
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime' : end.toISOString(),  //Date.toISOString() ->
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }
    await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {  //make a call to a specific endpoint from google
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + session.provider_token  //acces token for google
      },
      body: JSON.stringify(event)    //it s actually const event, so with JSON.stringgify translate into a string
    }).then((data) => {
        return data.json();
    }).then((data)=> {
      console.log(data);
      alert("Ckeck your Google Calendar");
    })
  }

  // console.log(session);
  // console.log(start);
  // console.log(eventName);
  // console.log(eventeDescription);

  return (
    <div className="App">
      <div style={{width : "800px", margin: "30px auto"}} >
      {session ?
      <>
      <h1>Hey there {session.user.email}</h1>
      <div className="Start" >
        <div className="Time">  Start your event:
            <DateTimePicker className="Time" onChange={setStart} value={start} />
        </div>
         <div className="Time">   </div> 
        <div className="Timeend">End your event:
            <DateTimePicker className="Timeend" onChange={setEnd} value={end} />
        </div>
      </div>
      <p>Event name:</p>
      <input type="text" onChange={(e)=> setEventName(e.target.value)} />
      <p>Event description</p>
      <textarea  rows="4" cols="30"  onChange={(e)=> setEventDescription(e.target.value)} />
      <p></p>
      <button className='But' onClick={()=> createCalendarEvent()} >Create Calendar Event</button>
      <p></p>
      <button className='BSign' onClick={()=> signOut()} >Sign Out</button>
      </>  
      :
      <>
      <p></p><p></p>
      <button  className='BIn' onClick={()=> googleSignIn()} >Sign In with Google</button>
      </>
    }
      </div>
    </div>
  );
}

export default App;
