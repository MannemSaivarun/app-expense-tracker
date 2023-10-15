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
        alert("successfully added expense")
        displayOnScreen(response.data.expense);
    }
    ).catch(err=>{
        console.log("!!!error in adding expense!!!")
    })
}
let currentPage = 1;
function pagination(){
        const expenseList = document.getElementById('list-of-expenses');
        const prevButton = document.getElementById('prevbtn');
        const nextButton = document.getElementById('nextbtn');
        const itemsPerPageInput = document.getElementById('itemsPerPage');

        
        let itemsPerPage = parseInt(itemsPerPageInput.value, 10);

        function displayExpenses(page, pageSize) {
            const token =localStorage.getItem('token')
            axios.get(`http://localhost:3000/expense/pagination?page=${page}&pageSize=${pageSize}`,{headers:{"Authorization" : token}})
                .then(response => {
                    const data = response.data;
                    const expenses = data.Data;

                    expenseList.innerHTML = '';
                    expenses.forEach(expense => {
                        displayOnScreen(expense)
                    });

                    prevButton.disabled = page <= 1;
                    nextButton.disabled = (page * pageSize) >= data.totalCount;
                })
                .catch(error => {
                    console.error('Error fetching expenses:', error);
                });
        }

        function nextPage() {
            currentPage++;
            displayExpenses(currentPage, itemsPerPage);
        }

        function prevPage() {
            currentPage--;
            displayExpenses(currentPage, itemsPerPage);
        }

        function changeItemsPerPage() {
            itemsPerPage = parseInt(itemsPerPageInput.value, 10);
            currentPage = 1;
            displayExpenses(currentPage, itemsPerPage);
        }

        nextButton.addEventListener('click', nextPage);
        prevButton.addEventListener('click', prevPage);
        itemsPerPageInput.addEventListener('change', changeItemsPerPage);

        displayExpenses(currentPage, itemsPerPage);
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
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function showdownloadedfile(){
    const parentelem = document.getElementById("downloadfiles");
    const token = localStorage.getItem('token')

    axios.get("http://localhost:3000/user/get-alldownloadedfiles",{headers:{"Authorization" : token}})
    .then(res=>{
        
        console.log("all downloaddetails",res.data.alldownloaddetails)
        for(let i=0; i<res.data.alldownloaddetails.length; i++){
            const childelem = document.createElement('li');
            childelem.textContent = res.data.alldownloaddetails[i].fileUrl;
            parentelem.appendChild(childelem);
        }
    })
    .catch(err=>{
        console.log("unable to get all users",err)
    })

}
function showpremiummessage(){
           document.getElementById('rzp-button1').style.display ="none";
           document.getElementById('leaderboard').style.display = "block";
           document.getElementById('premiumfeatures').style.display="block";
           document.getElementById('premiumfeatures-2').style.display="block";
           document.getElementById("download").disabled = false;
           // Initial population of the table
           populateTable(dateRangeSelect.value);

           document.getElementById('scroll-content').innerHTML = "Now You'r a premium user. Enjoy all the premium features"
           document.body.style.backgroundColor = "#ABD417"
           document.getElementById('expense-form').style.backgroundColor="#2DD417"

}
window.addEventListener("DOMContentLoaded",()=>{

    const token =localStorage.getItem('token')
    const decodedToken  = parseJwt(token)
    const ispremiumuser = decodedToken.ispremiumuser
    if(ispremiumuser){
        showpremiummessage()
        showLeaderboard()
        showdownloadedfile()
        pagination()
    }
    else{
        axios.get("http://localhost:3000/expense/get-allcategories",{headers:{"Authorization" : token}})
    .then(res=>{
        
        console.log("all categories",res.data.allcategorydetails[0])
        for(let i=0;i<res.data.allcategorydetails.length;i++){
            displayOnScreen(res.data.allcategorydetails[i])
        }
    })
    .catch(err=>{
        console.log("unable to get all users",err)
    })
    }
    
    
})

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
            const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            },{headers:{"Authorization": token} })
            alert('You are a premium user now')
            console.log("response.data.token",res.data.token)
            localStorage.setItem('token',res.data.token)
            showpremiummessage()
            showLeaderboard()
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

function showLeaderboard(){
    document.getElementById('leaderboard').onclick = async ()=>{
        const token = localStorage.getItem('token')
        console.log(token)
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/leaderboard',{headers:{"Authorization": token}})
        console.log(userLeaderBoardArray.data);
        //<-------to be displayed------>
        const parentElem = document.getElementById('list-of-leaders')
        parentElem.innerHTML = ""
        userLeaderBoardArray.data.forEach((userLeader)=>{
            parentElem.innerHTML += `<ul>Total expenses of ${userLeader.name} is ${userLeader.totalexpense}</ul>`
        })
        
    }
}


const dateRangeSelect = document.getElementById('dateRange');
const dataRows = document.getElementById('dataRows');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const savings = document.getElementById('savings');
        
function populateTable(selectedRange) {
    // Filter data based on the selected date range.
    // const today = new Date();
    // const filteredData = data.filter(item => {
    //     const itemDate = new Date(item.date);
    //     if (selectedRange === 'daily') {
    //         return itemDate.toDateString() === today.toDateString();
    //     } else if (selectedRange === 'weekly') {
    //         const oneWeekAgo = new Date(today);
    //         oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    //         return itemDate >= oneWeekAgo;
    //     } else {
    //         const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    //         return itemDate >= startOfMonth;
    //     }
    // });

    axios.get(`/api/finance/${selectedRange}`)
        .then(response => {
            const data = response.data;

            // Clear existing rows and populate the table with the fetched data
            dataRows.innerHTML = '';
            let totalIncomeAmount = 0;
            let totalExpenseAmount = 0;

            filteredData.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.date}</td>
                    <td>${item.description}</td>
                    <td>${item.category}</td>
                    <td>${item.category === 'Income' ? item.amount : ''}</td>
                    <td>${item.category === 'Expense' ? -item.amount : ''}</td>
                `;
                dataRows.appendChild(row);
        
                if (item.category === 'Income') {
                    totalIncomeAmount += item.amount;
                } else if (item.category === 'Expense') {
                    totalExpenseAmount += item.amount;
                }
            });

            totalIncome.textContent = totalIncomeAmount;
            totalExpense.textContent = totalExpenseAmount;
            savings.textContent = totalIncomeAmount - totalExpenseAmount;
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });

    
    // dataRows.innerHTML = '';
    // let totalIncomeAmount = 0;
    // let totalExpenseAmount = 0;
    
    

    // totalIncome.textContent = totalIncomeAmount;
    // totalExpense.textContent = totalExpenseAmount;
    // savings.textContent = totalIncomeAmount - totalExpenseAmount;
}


// Listen for changes to the date range selection
dateRangeSelect.addEventListener('change', (event) => {
    populateTable(event.target.value);
});



function download(){
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
            showdownloadedfile(response.data.fileURL)
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        cosole.log(err)
    });
}