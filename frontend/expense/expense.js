// import Razorpay from 'razorpay';

function savetoexpensedatabase(event){
    event.preventDefault();
    const expense = event.target.expense.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    
    const obj={
        expense,
        description,
        category,
        
    }
    const token = localStorage.getItem('token')
    axios.post("http://localhost:3000/expense/add-expense", obj , {headers :{"Authorization" : token}}).
    then((response)=>{
        // alert(response.data.message)
        displayOnScreen(response.data.Newexpensedetails);
    }
    ).catch(err=>{
        console.log("!!!error in adding expense!!!")
    })
}
function displayOnScreen(obj){
    const parentelem = document.getElementById("list-of-expenses");
    const childelem = document.createElement('ul');
    childelem.setAttribute('id',obj.id);
    childelem.textContent = obj.expense + '-' + obj.description + '-' + obj.category + " ";

    const deletebtn = document.createElement('input');
    deletebtn.type = 'button';
    deletebtn.value = 'Delete';
    deletebtn.setAttribute('id','deletebtn');

    deletebtn.onclick = ()=>{
        axios.delete(`http://localhost:3000/expense/delete-category/${obj.id}`)
       .then(res=>{
        console.log("deleted")
        parentelem.removeChild(childelem);
       })
       .catch(err=>{
        console.log(err)
       })               
    }

    // const editbtn = document.createElement('input');
    // editbtn.type = 'button';
    // editbtn.value = 'Edit';
    // editbtn.setAttribute('id','edit');
    // editbtn.onclick =()=>{
    //     document.getElementById("expensetag").value = obj.expense;
    //     document.getElementById("descriptiontag").value = obj.description;
    //     document.getElementById("cars").value =obj.carname;
    //     parentelem.removeChild(childelem);
    // }
    childelem.appendChild(deletebtn);
    // childelem.appendChild(editbtn);
    parentelem.appendChild(childelem);

}


window.addEventListener("DOMContentLoaded",()=>{

    const token =localStorage.getItem('token')
    console.log(token)
    axios.get("http://localhost:3000/expense/get-allcategories",{headers:{"Authorization" : token}})
    .then(res=>{
        console.log("all categories",res.data.allcategorydetails)
        for(let i=0;i<res.data.allcategorydetails.length;i++){
            displayOnScreen(res.data.allcategorydetails[i])
        }
    })
    .catch(err=>{
        console.log("unable to get all users",err)
    })
})
// if(localStorage.getItem('ispremiumuser')){
//     document.getElementById('rzp-button1').style.display ="none";
//     document.getElementById('scroll-content').innerHTML = "Now You'r a premium user. Enjoy all the premium features"
//     document.body.style.backgroundColor = "#ABD417"
//     document.getElementById('expense-form').style.backgroundColor="#2DD417"
// }
document.getElementById('rzp-button1').onclick = async function(e){
    console.log("button clicked")
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', {headers : {"Authorization" : token}})
    console.log("response after get request from razorpay",response)
    var options ={
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        //handler funtion will handle the success payment
        "handler":async function (response){
            console.log("handler options")
            await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            },{headers:{"Authorization": token} })
            alert('You are a premium user now')
            // document.getElementById('rzp-button1').style.display="none";
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function(response){
        console.log(response)
        alert('Something went wrong')
    });
}