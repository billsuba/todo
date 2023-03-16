// Heading
const nameInput = document.querySelector("#name");

nameInput.value = localStorage.getItem("name") || "";

nameInput.addEventListener("change", (e) => {
	localStorage.setItem("name", e.target.value);
});

nameInput.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		nameInput.blur();
	}
});

// Get items from local storage
const itemsArray = JSON.parse(localStorage.getItem("items")) || [];

// Reset
const reset = document.querySelector("#reset");
reset.addEventListener("click", () => {
	window.localStorage.clear();
	location.reload();
});

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

	// Add item to array and local
	const itemsObj = {
		item: item.value,
		isCompleted: false,
	};

	itemsArray.push(itemsObj);
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
	// Count
	const remaining = document.querySelector("#remaining");
	const completed = document.querySelector("#completed");
	const total = document.querySelector("#total");

	let numOfCompleted = 0;

	itemsArray.forEach((el) => {
		if (el.isCompleted === true) numOfCompleted++;
	});

	remaining.innerText = itemsArray.length - numOfCompleted;
	completed.innerText = numOfCompleted;
	total.innerText = itemsArray.length;

	const taskList = document.querySelector(".task-list");
	taskList.innerHTML = itemsArray
		.map(
			(el) => `
    <div class="item">
      <div class="input-controller">
				<input type="checkbox" class="checkbox">
        <textarea disabled>${el.item}</textarea>
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
			editBtn.style.opacity = "1";
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
				itemsArray[i].item = input.value;
				localStorage.setItem("items", JSON.stringify(itemsArray));
				displayItems();
			});
		});

		// Checkbox
		const checkbox = item.querySelector(".checkbox");

		if (itemsArray[i].isCompleted) {
			checkbox.checked = true;
			input.style.textDecoration = "line-through";
		}

		checkbox.addEventListener("change", () => {
			if (checkbox.checked) {
				itemsArray[i].isCompleted = true;
				displayItems();
			} else {
				itemsArray[i].isCompleted = false;
				input.style.textDecoration = "none";
				displayItems();
			}
			localStorage.setItem("items", JSON.stringify(itemsArray));
		});
	});
}

// Display items on page when window loads
window.onload = function () {
	displayItems();

	nameInput.value === ""
		? nameInput.focus()
		: document.querySelector("#item").focus();
};
