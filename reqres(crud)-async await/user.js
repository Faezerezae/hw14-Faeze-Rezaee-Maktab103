const root=document.getElementById("root");
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("id");
if (!userId) {
  backToHome();
}
const API_USER = "https://reqres.in/api/users";

const getSingleUser = (id) => {
  fetch(`${API_USER}/${id}`)
    .then((response) => response.json())
    .then((body) => {
      render(body.data);
    }).catch((error)=>backToHome())
};

getSingleUser(userId)

function backToHome() {
  window.location.href = "index.html";
}

function UserInformation(user) {

  return `   <div class="w-[300x] bg-white shadow-2xl rounded-md overflow-hidden flex flex-col gap-5 items-center justify-between  m-10">
  <img
    src="${user.avatar}"
    class="w-full h-40 object-cover"
  />
 
    <h2 class="text-2xl font-bold mb-2">${user.first_name} ${user.last_name}</h2>
    <p class="text-gray-600 m-4">Email: ${user.email}</p>
    <p class="text-gray-600">UID: ${user.id}</p>
 


<div class="flex justify-start gap-5 pl-5 py-4 p-2">
<button
class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
>
<a href="index.html">Back to home</a>
</button>
</div>
</div>
`;
}

function render(user) {
  root.innerHTML = UserInformation(user);
}


