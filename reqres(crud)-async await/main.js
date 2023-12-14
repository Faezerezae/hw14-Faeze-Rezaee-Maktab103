import "./style.css";
import "flowbite";

const API_USER = "https://reqres.in/api/users";
const usersList = document.querySelector(".users-list");

let list = [];
console.log(list);

const paginationonButtons = document.querySelector("#pagination-buttons");

const showModalBtn = document.getElementById("showModalBtn");
const modal = document.getElementById("myModal");
const closeBtn = document.getElementById("closeBtn");

showModalBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

let creatingNewUser = true;
let editNum;

// document.addEventListener("DOMContentLoaded", () => {
// });

let totalUsers = 0;

const getAllUser = async (page = 1) => {
  try {
    const response = await fetch(`${API_USER}?page=${page}`);
    const body = await response.json();
    totalUsers = body.total;
    console.log(body);
    list = body.data;
    console.log(list);
    render(body);
  } catch (error) {
    console.error("Error:", error);
  }
};

getAllUser();

//-----------------------post--------------------------------
const submit = document.getElementById("submit");
submit.addEventListener("click", createNewUser);

let newUser;

const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const Email = document.getElementById("email");
const Avatar = document.getElementById("avatar");

// Function to create a new user
async function createNewUser(e) {
  e.preventDefault();
  const userone = {
    first_name: firstName.value,
    last_name: lastName.value,
    email: Email.value,
    avatar: Avatar.value,
  };

  try {
    const response = await fetch(API_USER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userone),
    });

    // اضافه کردن لاگ به جواب دریافتی
    const body = await response.json();
    console.log(body);

    getAllUser();
    // modal.classList.add("hidden");
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error(error);
  }
}

//----------------------------delet& edit------------------
usersList.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    console.log("ok");
    const deleteUser = e.target.parentElement.parentElement.dataset.set;
    console.log(deleteUser);
    deleteFetchValue(deleteUser);
  }
  if (e.target.classList.contains("btn-edit")) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    const editUser = e.target.parentElement.parentElement.dataset.set;
    editFetchValue(editUser);
    editNum = e.target.parentElement.parentElement.dataset.set;
  }
});

submit.addEventListener("click", postFetchValue);
async function postFetchValue() {
  try {
    if (creatingNewUser) {
      const postResponse = await fetch(API_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName.value,
          last_name: lastName.value,
          email: Email.value,
          avatar: Avatar.value,
        }),
      });

      console.log("User Created:", postResponse);
      console.log("Post Response Data:", await postResponse.json());
      const fetchResponse = await fetch(API_USER);
      const data = await fetchResponse.json();
      render(data);
      resetForm();
    } else {
      console.log("i am edit");
      const patchResponse = await fetch(`${API_USER}/${editNum}`, {
        method: "PATCH",
        body: JSON.stringify({
          first_name: firstName.value,
          last_name: lastName.value,
          email: Email.value,
          avatar: Avatar.value,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      console.log("Patch Success:", patchResponse);
      getAllUser();
      resetForm();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// //------------------------edit-----------------------------
async function editFetchValue(id) {
  try {
    const response = await fetch(`${API_USER}/${id}`);
    const editData = await response.json();
    console.log(editData.data);
    const { first_name, last_name, email, avatar, id: userId } = editData.data;
    firstName.value = first_name;
    lastName.value = last_name;
    Email.value = email;
    Avatar.value = avatar;
    submit.textContent = "save";

    submit.addEventListener("click", patchEditFunc);
    creatingNewUser = false;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function patchEditFunc(e) {
  try {
    e.preventDefault();
    console.log("editNum:", editNum);
    if (!editNum) {
      console.error("Invalid editNum");
      return;
    }
    const patchResponse = await fetch(`${API_USER}/${editNum}`, {
      method: "PATCH",
      body: JSON.stringify({
        first_name: firstName.value,
        last_name: lastName.value,
        email: Email.value,
        avatar: Avatar.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    console.log("Patch Success:", patchResponse);
    getAllUser();
    resetForm();
  } catch (error) {
    console.error("Error:", error);
  }
}

// //----------------------------delete-----------------------
async function deleteFetchValue(id) {
  try {
    console.log(`${API_USER}/${id}`);
    const response = await fetch(`${API_USER}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    console.log(response);
    // const data = await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

//--------------------------search-------------------------
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

searchButton.addEventListener("click", searchUser);

async function searchUser() {
  const searchQuery = searchInput.value.toLowerCase();
  console.log(list);

  const filteredList = await filterListAsync(list, searchQuery);
  userListRenderer(filteredList);
}

async function filterListAsync(list, searchQuery) {
  return list.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchQuery);
  });
}

function Card(
  id = "",
  avatar = "",
  first_name = "",
  last_name = "",
  email = ""
) {
  return `
  <div class="w-[400px] bg-white shadow-md rounded-md overflow-hidden" data-set="${id}">
        <img
          src="${avatar}"
          alt="User Avatar"
          class="w-full h-40 object-cover"
        />
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-2">${first_name} ${last_name}</h2>
          <p class="text-gray-600 mb-4">Email: ${email}</p>
          <p class="text-gray-600">UID: ${id}</p>
        </div>
        <div class="flex justify-start gap-5 pl-5 p-2 py-4">
          <button
            class="bg-blue-500 text-white py-2 p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800 card-profile"
          >
            Profile
          </button>
         
      <button
        class="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 focus:outline-none focus:shadow-outline-red active:bg-red-800 btn-delete"
      >
        Delete
      </button>
      <button
        class="bg-orange-400 text-white p-2 rounded-md hover:bg-orange-500 focus:outline-none focus:shadow-outline-blue active:bg-orange-800 btn-edit"
      >
        Edit
      </button>
        </div>
      </div>
    `;
}

usersList.addEventListener("click", eventHandler);

function eventHandler(e) {
  if (e.target.classList.contains("card-profile")) {
    const idUser = e.target.parentElement.parentElement.dataset.set;
    onClickCard(idUser);
  }
}

function onClickCard(id) {
  const splittedPathname = window.location.pathname.split("/");
  window.location.href =
    splittedPathname.slice(0, splittedPathname.length - 1).join("/") +
    `/user.html?id=${id}`;
}

function userListRenderer(list) {
  console.log("Rendering Users:", list); // افزودن این خط
  let html = "";
  for (const user of list) {
    html += Card(
      user.id,
      user.avatar,
      user.first_name,
      user.last_name,
      user.email
    );
  }
  usersList.innerHTML = html;
}

function paginationButton(page, isActive = false) {
  if (isActive) {
    return `
    <p class="inline-flex items-center justify-center border-t-2 border-indigo-500 px-4 text-sm font-medium bg-blue-600 text-white cursor-pointer p-2" aria-current="page" data-page="${page}">${page}</p>
      `;
  }
  return `
    <p class="inline-flex items-center border-t-2 border-transparent px-4 justify-center text-sm font-medium text-blue-600 p-2 hover:border-gray-300 hover:text-gray-700 cursor-pointer" aria-current="page" data-page="${page}">${page}</p>`;
}

function paginationBtnListRenderer(totalPages, activePage) {
  let html = "";

  for (let page = 1; page <= totalPages; page++) {
    html += paginationButton(page, activePage === page);
  }

  paginationonButtons.innerHTML = html;
}

paginationonButtons.addEventListener("click", (event) => {
  const clickedPage = event.target.dataset.page;
  if (clickedPage) {
    getAllUser(clickedPage);
  }
});

function render(body) {
  totalUsers = body.total; // به‌روز کردن مقدار totalUsers
  userListRenderer(list);
  paginationBtnListRenderer(body.total_pages, body.page);
}



function resetForm() {
  firstName.value = "";
  lastName.value = "";
  Email.value = "";
  Avatar.value = "";
  submit.textContent = "submit";
  creatingNewUser = true;
  modal.classList.add("hidden");
}
