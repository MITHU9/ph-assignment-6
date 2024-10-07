const petCategory = document.getElementById("pet-category");
const petCards = document.getElementById("pet-cards");
const sortButton = document.getElementById("sort-btn");
const loading = document.getElementById("loading");

function buttonBg(clickedButton) {
  const buttons = document.querySelectorAll("#pet-category button");
  buttons.forEach((button) => {
    button.classList =
      "px-4 md:px-8 py-3 font-semibold rounded-lg border border-primary/20  md:flex gap-2";
  });
  clickedButton.classList =
    "px-4 md:px-8 py-3 font-semibold rounded-full border border-primary/40 bg-primary/20 md:flex gap-2";
}

let currentCategoryPets = [];

async function getPetsByCategory(category, button) {
  //console.log(category);
  petCards.innerHTML = "";
  petCards.appendChild(loading);
  loading.classList.remove("hidden");
  loading.classList.add("flex", "col-span-3");

  buttonBg(button);
  currentCategoryPets = [];

  const div1 = document.createElement("div");
  div1.classList = "hidden items-center justify-center h-[350px]";
  div1.innerHTML = `
  <span class="loading loading-bars loading-lg"></span>
  
  `;
  petCards.appendChild(div1);

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/peddy/category/${category}`
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const petsData = await res.json();
    //console.log(petsData);
    if (petsData && petsData.data.length > 0) {
      loading.classList.add("hidden");
      loading.classList.remove("flex");
      currentCategoryPets = petsData.data;
      getPets(petsData.data);
    } else {
      petCards.classList.remove("grid");
      const div = document.createElement("div");
      div.classList =
        "flex flex-col items-center gap-3 text-center bg-[#F8F8F8] p-8 rounded-lg";
      div.innerHTML = `
      <img src="./images/error.webp"  />
      <div>
      <h1 class="text-2xl font-bold">No Information Available</h1>
      <p class="font-semibold text-gray-500 py-2">It looks like there's currently no content available in this section. Please check back later for updates, or explore other parts of our site for more information.</p>
      </div>
      `;
      petCards.appendChild(div);
      loading.classList.add("hidden");
      loading.classList.remove("flex");
    }
  } catch (error) {
    console.log(error);
    loading.classList.remove("flex");
    loading.classList.add("hidden");
  }
}

async function getPetCategory() {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/peddy/categories"
    );
    const data = await response.json();
    //console.log(data);
    if (data && data.categories.length > 0) {
      data.categories.forEach((element) => {
        const button = document.createElement("button");
        button.classList =
          "px-4 md:px-8 py-3 font-semibold rounded-lg border border-primary/20  md:flex gap-2";
        button.innerHTML = `
        <img src="${element.category_icon}" alt="${element.category}" class="w-6 h-6 rounded-full" /> ${element.category}
        `;
        petCategory.appendChild(button);

        button.addEventListener("click", () => {
          getPetsByCategory(element.category, button);
        });
      });
    } else {
      throw new Error("No data found");
    }
  } catch (error) {
    console.log(error);
  }
}

async function getPetDetails(id) {
  const details = document.getElementById("details");
  details.innerHTML = "";
  details.showModal();
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/peddy/pet/${id}`
    );

    const data = await res.json();
    //console.log(data);
    if (data && data.petData) {
      const div = document.createElement("div");
      div.classList = "modal-box";
      div.innerHTML = `
        <div>
              <img class="rounded-xl w-full" src=${data.petData.image} />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-700 py-3">${
                data.petData.pet_name
              }</h2>
              <div class="flex gap-8">
                <div>
                  <p class="text-gray-500 font-semibold">
                  <i class="fa-solid fa-border-all mt-2"></i> Breed:${
                    data.petData.breed ? data.petData.breed : "Not Available"
                  }
                  </p>
                  <p class="text-gray-500 font-semibold">
                  <i class="fa-solid fa-venus"></i> Gender: ${
                    data.petData.gender ? data.petData.gender : "Not Available"
                  }
                  </p>
                  <p class="text-gray-500 font-semibold"><i class="fa-solid fa-venus"></i> Vaccinated status: ${
                    data.petData.vaccinated_status
                      ? data.petData.vaccinated_status
                      : "Not available"
                  }</p>
                </div>
                <div>
                  <p class="text-gray-500 font-semibold"><i class="fa-regular fa-calendar-days"></i> Birth: ${
                    data.petData.date_of_birth
                      ? data.petData.date_of_birth
                      : "Not Available"
                  }</p>
                  <p class="text-gray-500 font-semibold"><i class="fa-solid fa-dollar-sign"></i> Price: ${
                    data.petData.price
                  }$</p>
                </div>
              </div>
            </div>
            <hr class="mt-2" />
            <div>
              <h2 class="text-xl py-2 font-bold text-gray-800">
                Details Information
              </h2>
              <div>
                <div>
                  <p class="text-gray-500 font-semibold">
                    Pets are animals that people keep for companionship,
                    emotional support, and enjoyment. Unlike working animals or
                    livestock, pets are kept mainly for the joy they bring into
                    our lives.
                  </p>
                  <ul class="px-4 list-disc font-semibold text-gray-500">
                    <li>
                      ${data.petData.pet_details}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="modal-action">
              <form method="dialog">
                <button
                  class="px-10 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-slate-500"
                >
                  Close
                </button>
              </form>
            </div>
        `;
      details.appendChild(div);
    } else {
      throw new Error("No data found");
    }
  } catch (error) {
    console.error(error);
  }
}

async function getPetImage(id) {
  const petImage = document.getElementById("pet-images");
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/peddy/pet/${id}`
    );
    const data = await response.json();
    if (data && data.petData) {
      const div = document.createElement("div");
      div.innerHTML = `
   <img class="rounded-lg" src=${data.petData.image} alt="pets" />
   `;
      petImage.appendChild(div);
    } else {
      throw new Error("No data found");
    }
  } catch (error) {
    console.log(error);
  }
}

function adoptPet(adoptButton) {
  //console.log(adoptButton);

  let count = 3;
  const adoptBtn = document.getElementById("adopt-btn");
  const counter = document.getElementById("count");
  counter.innerText = count;
  const adopt = document.getElementById("adopt-modal");
  adopt.showModal();
  const interVal = setInterval(() => {
    count--;
    counter.innerText = count;
    //console.log(count);
    if (count === 1) {
      adopt.close();
      adoptButton.innerText = "Adopted";
      adoptButton.disabled = true;
      adoptButton.classList.remove(
        "text-primary",
        "hover:bg-primary",
        "hover:text-white"
      );
      adoptButton.classList.add("bg-gray-300", "text-gray-500");
      clearInterval(interVal);
    }
  }, 1000);
}

function getPets(data) {
  //console.log(data);
  data.forEach((element) => {
    //console.log(element.image);
    petCards.classList.add("grid");
    const card = document.createElement("div");
    card.classList =
      "flex flex-col gap-3 p-3 rounded-lg border border-primary/20";
    card.innerHTML = `
    <div>
            <img
              class="w-full rounded-xl"
              src=${element.image}
              alt="pet"
            />
          </div>
          <div class="text-gray-500 font-semibold">
            <h2 class="text-2xl font-bold text-gray-600">${
              element.pet_name
            }</h2>
            <p>
              <i class="fa-solid fa-border-all mt-2"></i> Breed: ${
                element.breed ? element.breed : "Not Available"
              }
            </p>
            <p><i class="fa-regular fa-calendar-days"></i> Birth: ${
              element.date_of_birth ? element.date_of_birth : "Not Available"
            }</p>
            <p><i class="fa-solid fa-venus"></i> Gender: ${
              element.gender ? element.gender : "Not Available"
            }</p>
            <p><i class="fa-solid fa-dollar-sign"></i> Price: ${
              element.price ? element.price + "$" : "Not Available"
            }</p>
            <hr class="my-2 mt-3" />
            <div
              class="flex items-center lg:gap-3 justify-between mt-3 flex-wrap gap-1"
            >
              <button
               onClick="getPetImage(${element.petId})"
                class="px-4 py-2 font-semibold rounded-lg border border-primary/20 hover:bg-primary hover:text-white"
              >
                <i class="fa-solid fa-thumbs-up"></i>
              </button>
              <button
                id="adopt-btn"
                onClick = "adoptPet(this)"
                class="px-3 text-primary py-2 font-semibold lg:font-bold rounded-lg border border-primary/20 hover:bg-primary hover:text-white lg:text-xl"
              >
                Adopt
              </button>
              <button
               
               onClick="getPetDetails(${element.petId})"
                class="px-3 lg:font-bold lg:px-4 text-primary py-2 font-semibold rounded-lg border border-primary/20 hover:bg-primary hover:text-white lg:text-xl"
              >
                Details
              </button>
            </div>
          </div>
    `;
    petCards.appendChild(card);
  });
}

async function getAllPets() {
  petCards.appendChild(loading);
  loading.classList.remove("hidden");
  loading.classList.add("flex", "col-span-3");
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/peddy/pets"
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = await response.json();
    //console.log(data.pets);
    if (data && data.pets.length) {
      loading.classList.add("hidden");
      loading.classList.remove("flex");
      getPets(data.pets);
    }
  } catch (error) {
    console.error(error);
  }
}

getPetCategory();
getAllPets();

sortButton.addEventListener("click", async () => {
  petCards.innerHTML = "";
  petCards.appendChild(loading);
  loading.classList.remove("hidden");
  loading.classList.add("flex", "col-span-3");

  try {
    if (currentCategoryPets.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const sortedData = currentCategoryPets.sort((a, b) => b.price - a.price);
      loading.classList.add("hidden");
      loading.classList.remove("flex");
      getPets(sortedData);
    } else {
      const res = await fetch(
        "https://openapi.programming-hero.com/api/peddy/pets"
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const data = await res.json();

      if (data && data.pets.length > 0) {
        loading.classList.add("hidden");
        loading.classList.remove("flex");
        const sortedData = data.pets.sort((a, b) => {
          return b.price - a.price;
        });
        getPets(sortedData);
      } else {
        throw new Error("No data found");
      }
    }
  } catch (error) {
    console.error(error);
  }
});
