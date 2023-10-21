function savetodatabase(event){
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const obj={
        name,
        email,
        password
    }
    console.log("obj details",obj);
    axios.post("http://16.171.224.3:3000/user/add-user", obj)
    .then((response) =>{
        
        // console.log(response.data.newUserdetail)
        document.getElementById("name").value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value ='';
        console.log("post success")
        document.getElementById('sign-in-alert').innerHTML = "User Signed in successfully";
        // displayonScreen(response.data.newUserdetail);
    })
    .catch(err=>{
        console.log("post request failed",err)
        document.getElementById('alert').innerHTML = "User already exists";
        
    })

}