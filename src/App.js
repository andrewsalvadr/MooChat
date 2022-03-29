import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; 
     import 'firebase/compat/firestore';
     import 'firebase/compat/auth';   

import { useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Logo from './Asset/moochat-logo.png'
import GLogo from './Asset/googleIcon.svg'


firebase.initializeApp({
  apiKey: "AIzaSyBCdo2fza8pqwkEbfUht7HwPRlKbBroSts",
  authDomain: "moochat-4a7d2.firebaseapp.com",
  projectId: "moochat-4a7d2",
  storageBucket: "moochat-4a7d2.appspot.com",
  messagingSenderId: "177852455295",
  appId: "1:177852455295:web:3f4adf6c34171211e2e24a"
}) 

const auth = firebase.auth()
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <img src={Logo} alt="logo" className='main-logo'/>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
        <div>
        </div>
      </section>

    </div>
  );
}


function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }


  return (
    <div>
      <div>
      <img src={Logo} className="sign-inLogo"/>
      </div>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google
      <img src={GLogo} alt="google-logo" />
      </button>
        </div> 
    
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Log out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type here" />

      <button type="submit" disabled={!formValue}>Enter</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
