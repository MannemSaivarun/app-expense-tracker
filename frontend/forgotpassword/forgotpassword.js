function Enableforgotpassword(event){
    event.preventDefault();
    console.log(event.target.name);
    const form = new FormData(event.target);

    const userDetails = {
        email: form.get("email"),

    }
    console.log("user details",userDetails)
    axios.post('http://localhost:3000/password/forgotpassword',userDetails).then(response => {
        console.log("sent email")
        // if(response.status === 202){
        //     document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        // } else {
        //     throw new Error('Something went wrong!!!')
        // }
    }).catch(err => {
        // document.body.innerHTML += `<div style="color:red;">${err} <div>`;
        console.log("not sent")
    })
}