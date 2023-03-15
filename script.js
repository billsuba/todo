// Get items from local storage
const itemsArray = JSON.parse(localStorage.getItem("items")) || [];

// Add item on button click or Enter key press
const addItem = () => {
	const item = document.querySelector("#item");
	const MAX_LENGTH = 50;

	// Validate input
	if (!item.value.trim()) {
		alert("Please enter a valid task");
		return;
	}
	if (item.value.length > MAX_LENGTH) {
		alert(`Please enter a task with ${MAX_LENGTH} characters or less`);
		return;
	}

	// Add item to array and local storage
	itemsArray.push(item.value);
	localStorage.setItem("items", JSON.stringify(itemsArray));

	// Reset input text
	item.value = "";

	displayItems();
};

document.querySelector("#add-btn").addEventListener("click", addItem);
document.querySelector("#item").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		addItem();
	}
});

// Display items on page
function displayItems() {
	const taskList = document.querySelector(".task-list");
	taskList.innerHTML = itemsArray
		.map(
			(el) => `
    <div class="item">
      <div class="input-controller">
        <textarea disabled>${el}</textarea>
        <div class="edit-controller">
          <i class="fa-solid fa-ellipsis editBtn"></i>
        </div>
      </div>
      <div class="update-controller" style="display:none">
        <button class="saveBtn">Save</button>
        <button class="deleteBtn">Delete</button>
      </div>
    </div>
    `
		)
		.join("");

	// Activate delete and edit button listeners
	taskList.querySelectorAll(".item").forEach((item, i) => {
		const deleteBtn = item.querySelector(".deleteBtn");
		const editBtn = item.querySelector(".editBtn");
		const input = item.querySelector("textarea");
		const updateController = item.querySelector(".update-controller");

		deleteBtn.addEventListener("click", () => {
			itemsArray.splice(i, 1);
			localStorage.setItem("items", JSON.stringify(itemsArray));
			displayItems();
		});

		editBtn.addEventListener("click", () => {
			editBtn.classList.remove("fa-ellipsis");
			editBtn.classList.add("fa-xmark");
			editBtn.classList.remove("editBtn");
			editBtn.classList.add("cancelBtn");
			updateController.style.display = "block";
			input.disabled = false;

			const cancelBtn = item.querySelector(".cancelBtn");
			cancelBtn.addEventListener("click", () => {
				updateController.style.display = "none";
				input.disabled = true;
				input.style.border = "none";
				displayItems();
			});

			const saveBtn = item.querySelector(".saveBtn");
			saveBtn.addEventListener("click", () => {
				itemsArray[i] = input.value;
				localStorage.setItem("items", JSON.stringify(itemsArray));
				displayItems();
			});
		});
	});
}

// Display items on page when window loads
window.onload = function () {
	displayItems();
};
