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