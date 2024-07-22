import {useState,useRef} from "react";
import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";
import {set,ref} from "firebase/database";
import "firebase/compat/auth";
import firebase from "firebase/compat/app"

const firebaseConfig = {
  apiKey: "AIzaSyCYYgd7jEj3GbFh9i0w80JJQqUr5729Tt4",
  authDomain: "sspage18june24.firebaseapp.com",
  projectId: "sspage18june24",
  storageBucket: "sspage18june24.appspot.com",
  messagingSenderId: "113815545052",
  appId: "1:113815545052:web:0f8ee82a4018660b3e8019"
};



const app = firebase.initializeApp(firebaseConfig);
const db = getDatabase(app);

function Enquiry()
{
	const[name,setName] = useState("");
	const[query,setQuery] = useState("");
	const[otp,setOtp] = useState("");
	const[phone,setPhone] = useState("");
	const[msg,setMsg] = useState("");
	const[final,setFinal] = useState("");

	const configureCaptcha = () =>{
		window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("sign-in-button",{
		'size':'invisible',
		'callback':(response)=>{
		sendOtp();
		console.log("Recaptcha Varified")
		},
		defaultCountry:"IN"
		});
		}
	

	const sendOtp =(event)=>{
	event.preventDefault();
	configureCaptcha();
	let pn = "+91"+phone;
	let av = window.recaptchaVerifier;
	firebase.auth().signInWithPhoneNumber(pn,av)
	.then(res=>{
		setFinal(res);
		alert("Otp Sent");	

	})
	.catch(err=>{
		console.log(err);
	})
	
	}
	

	const submitOtp= (event) =>{
	event.preventDefault();
	final.confirm(otp)
	.then(res=>{
		const d = new Date().toString();
		const n = name+"-->"+d;
		const data = {name,phone,query,d}
		set(ref(db,"visitors/"+n),data)
		.then(res=>{
		console.log(res);
		alert("we will call u in 2 hrs");
		window.location.reload()
		})
		.catch(err=>console.log(err))
	})
	.catch(err=>{
		console.log(err);
		alert("Invalid Otp");
		window.location.reload()
		})
		}


return(
<>
<center>
<form onSubmit = {sendOtp}>
<div id = "sign-in-button"></div>
<nav>
<h1>Enquriy Form</h1>
</nav>
<input type = "text" placeholder = "enter your name " onChange = {(event)=>{setName(event.target.value);}}/>
<br/><br/>
<textarea placeholder = "enter your query" rows ={3} cols = {20} onChange = {(event)=>{setQuery(event.target.value);}}/>
<br/><br/>
<input type = "number" placeholder = "enter phone number " onChange = {(event)=>{setPhone(event.target.value);}}/>
<br/><br/>
<input type = "submit" value = "submit"/>
</form>


<form onSubmit = {submitOtp}>
<input type = "number" placeholder = "enter Otp " onChange = {(event)=>{setOtp(event.target.value);}}/>
<br/><br/>

<input type = "submit" value = "submit otp"/>
</form>
</center>
</>
);
}
export default Enquiry;