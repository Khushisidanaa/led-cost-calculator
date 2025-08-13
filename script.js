// Global variables
let components = [];
let selectedComponents = {
  pcbs: [],
  power: [],
  controller: [],
  accessories: [],
  packaging: [],
};
let materialCosts = {
  acpSheet: 9,
  acrylicSheet: 15,
  printedVinyl: 8,
  aluminum: 13,
  hardware: 45,
};
let currentStep = "pcbs";
let editingComponentId = null;

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  loadComponents();
  loadMaterialCosts();
  updateProgress();
  populateComponentSelects();
  calculateCabinetCost();
  updateTotalCosts();
  validateAddComponentForm(); // Initial validation
});

// Navigation Functions
function goToHome() {
  // Hide admin panel if open
  const adminPanel = document.getElementById("adminPanel");
  adminPanel.classList.remove("active");

  // Show main calculator
  const calculatorMain = document.getElementById("calculatorMain");
  calculatorMain.style.display = "block";
}

// Admin Panel Functions
function toggleAdminPanel() {
  const adminPanel = document.getElementById("adminPanel");
  const calculatorMain = document.getElementById("calculatorMain");

  if (adminPanel.classList.contains("active")) {
    // Close admin panel
    adminPanel.classList.remove("active");
    calculatorMain.style.display = "block";
  } else {
    // Open admin panel
    adminPanel.classList.add("active");
    calculatorMain.style.display = "none";
  }
}

function switchTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((btn) => btn.classList.remove("active"));

  // Show selected tab content
  document.getElementById(tabName + "Tab").classList.add("active");

  // Add active class to selected tab button
  event.target.classList.add("active");
}

// Component Management Functions
function addComponent() {
  const category = document.getElementById("category").value;
  const componentName = document.getElementById("componentName").value;
  const description = document.getElementById("description").value;
  const unitPrice = parseFloat(document.getElementById("unitPrice").value);

  if (!category || !componentName || !description || isNaN(unitPrice)) {
    alert("Please fill in all fields with valid values.");
    return;
  }

  // Always add new component (editing is handled separately)
  const component = {
    id: Date.now(),
    category: category,
    name: componentName,
    description: description,
    unitPrice: unitPrice,
  };
  components.push(component);

  saveComponents();
  displayComponents();
  populateComponentSelects();
  clearComponentForm();
  updateComponentCount();
}

function clearComponentForm() {
  document.getElementById("category").value = "";
  document.getElementById("componentName").value = "";
  document.getElementById("description").value = "";
  document.getElementById("unitPrice").value = "0";
  document.getElementById("addComponentBtn").disabled = true;

  // Update button text
  const addButton = document.getElementById("addComponentBtn");
  addButton.innerHTML = '<i class="fas fa-plus"></i> Add Component';
}

// Validate Add Component Form
function validateAddComponentForm() {
  const category = document.getElementById("category").value;
  const name = document.getElementById("componentName").value.trim();
  const price = document.getElementById("unitPrice").value;
  const addButton = document.getElementById("addComponentBtn");

  // Enable button only if category, name, and price are provided
  if (category && name && price && parseFloat(price) > 0) {
    addButton.disabled = false;
    addButton.classList.remove("btn-disabled");
  } else {
    addButton.disabled = true;
    addButton.classList.add("btn-disabled");
  }
}

function displayComponents() {
  const componentsList = document.getElementById("componentsList");
  const categoryFilter = document.getElementById("categoryFilter").value;

  let filteredComponents = components;
  if (categoryFilter) {
    filteredComponents = components.filter(
      (comp) => comp.category === categoryFilter
    );
  }

  if (filteredComponents.length === 0) {
    componentsList.innerHTML =
      '<p class="no-components">No components found.</p>';
    return;
  }

  componentsList.innerHTML = filteredComponents
    .map(
      (component) => `
    <div class="component-item">
      <div class="component-header">
        <div class="component-name">${component.name}</div>
        <div class="component-category">${component.category}</div>
      </div>
      <div class="component-description">${component.description}</div>
      <div class="component-price">₹${component.unitPrice}</div>
      <div class="component-actions">
        <button class="edit-btn" onclick="editComponent(${component.id})" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" onclick="deleteComponent(${component.id})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `
    )
    .join("");
}

function filterComponents() {
  displayComponents();
}

function editComponent(id) {
  const component = components.find((comp) => comp.id === id);
  if (!component) return;

  editingComponentId = id;

  // Show edit section and hide add section
  document.getElementById("editComponentSection").style.display = "block";
  document.querySelector(".add-component-section").style.display = "none";

  // Fill edit form
  document.getElementById("editCategory").value = component.category;
  document.getElementById("editComponentName").value = component.name;
  document.getElementById("editDescription").value = component.description;
  document.getElementById("editUnitPrice").value = component.unitPrice;

  // Scroll to edit section
  document
    .getElementById("editComponentSection")
    .scrollIntoView({ behavior: "smooth" });
}

function cancelEdit() {
  editingComponentId = null;

  // Hide edit section and show add section
  document.getElementById("editComponentSection").style.display = "none";
  document.querySelector(".add-component-section").style.display = "block";

  // Clear edit form
  document.getElementById("editCategory").value = "";
  document.getElementById("editComponentName").value = "";
  document.getElementById("editDescription").value = "";
  document.getElementById("editUnitPrice").value = "0";
}

function updateComponent() {
  if (!editingComponentId) return;

  const category = document.getElementById("editCategory").value;
  const componentName = document.getElementById("editComponentName").value;
  const description = document.getElementById("editDescription").value;
  const unitPrice = parseFloat(document.getElementById("editUnitPrice").value);

  if (!category || !componentName || !description || isNaN(unitPrice)) {
    alert("Please fill in all fields with valid values.");
    return;
  }

  // Update existing component
  const componentIndex = components.findIndex(
    (comp) => comp.id === editingComponentId
  );
  if (componentIndex !== -1) {
    components[componentIndex] = {
      id: editingComponentId,
      category: category,
      name: componentName,
      description: description,
      unitPrice: unitPrice,
    };
  }

  saveComponents();
  displayComponents();
  populateComponentSelects();
  cancelEdit();

  alert("Component updated successfully!");
}

function deleteComponent(id) {
  if (confirm("Are you sure you want to delete this component?")) {
    components = components.filter((comp) => comp.id !== id);
    saveComponents();
    displayComponents();
    populateComponentSelects();
    updateComponentCount();
  }
}

function updateComponentCount() {
  document.getElementById("componentCount").textContent = components.length;
}

// Modal Functions
function showAddComponentModal(category) {
  document.getElementById("modalCategoryTitle").textContent = category;
  document.getElementById("addComponentModal").classList.add("active");

  // Pre-fill category in admin panel if open
  if (document.getElementById("adminPanel").classList.contains("active")) {
    document.getElementById("category").value = category;
  }
}

function closeAddComponentModal() {
  document.getElementById("addComponentModal").classList.remove("active");
  clearModalForm();
}

function clearModalForm() {
  document.getElementById("modalComponentName").value = "";
  document.getElementById("modalDescription").value = "";
  document.getElementById("modalUnitPrice").value = "0";
  document.getElementById("modalAddButton").disabled = true;
}

function addComponentFromModal() {
  const category = document.getElementById("modalCategoryTitle").textContent;
  const componentName = document.getElementById("modalComponentName").value;
  const description = document.getElementById("modalDescription").value;
  const unitPrice = parseFloat(document.getElementById("modalUnitPrice").value);

  if (!componentName || !description || isNaN(unitPrice)) {
    alert("Please fill in all fields with valid values.");
    return;
  }

  const component = {
    id: Date.now(),
    category: category,
    name: componentName,
    description: description,
    unitPrice: unitPrice,
  };

  components.push(component);
  saveComponents();
  displayComponents();
  populateComponentSelects();
  updateComponentCount();

  // Close modal and clear form
  closeAddComponentModal();

  // Show success message
  alert(`New ${category} component added successfully!`);
}

// PCB Section Toggle Function
function togglePcbSection() {
  const form = document.getElementById("pcbComponentForm");
  const button = document.getElementById("addPcbToggleBtn");
  const icon = document.getElementById("addPcbIcon");
  const text = document.getElementById("addPcbText");

  if (form.style.display === "none") {
    // Show form
    form.style.display = "block";
    button.classList.remove("btn-primary");
    button.classList.add("btn-success");
    icon.className = "fas fa-check";
    text.textContent = "PCB Added";
  } else {
    // Hide form
    form.style.display = "none";
    button.classList.remove("btn-success");
    button.classList.add("btn-primary");
    icon.className = "fas fa-plus";
    text.textContent = "Add PCB";
  }
}

// Form Validation Functions
function updatePCBPrice() {
  const pcbSelect = document.getElementById("pcbSelect");
  const quantity = document.getElementById("pcbQuantity");
  const addPcbBtn = document.getElementById("addPcbBtn");

  if (pcbSelect.value && quantity.value && parseInt(quantity.value) > 0) {
    addPcbBtn.disabled = false;
    addPcbBtn.style.opacity = "1";
  } else {
    addPcbBtn.disabled = true;
    addPcbBtn.style.opacity = "0.5";
  }
}

function updatePowerPrice() {
  const powerSelect = document.getElementById("powerSelect");
  const quantity = document.getElementById("powerQuantity");
  const addPowerBtn = document.getElementById("addPowerBtn");

  if (powerSelect.value && quantity.value && parseInt(quantity.value) > 0) {
    addPowerBtn.disabled = false;
    addPowerBtn.style.opacity = "1";
  } else {
    addPowerBtn.disabled = true;
    addPowerBtn.style.opacity = "0.5";
  }
}

function updateControllerPrice() {
  const controllerSelect = document.getElementById("controllerSelect");
  const quantity = document.getElementById("controllerQuantity");
  const addControllerBtn = document.getElementById("addControllerBtn");

  if (
    controllerSelect.value &&
    quantity.value &&
    parseInt(quantity.value) > 0
  ) {
    addControllerBtn.disabled = false;
    addControllerBtn.style.opacity = "1";
  } else {
    addControllerBtn.disabled = true;
    addControllerBtn.style.opacity = "0.5";
  }
}

function updateAccessoryPrice() {
  const accessorySelect = document.getElementById("accessorySelect");
  const quantity = document.getElementById("accessoryQuantity");
  const addAccessoryBtn = document.getElementById("addAccessoryBtn");

  if (accessorySelect.value && quantity.value && parseInt(quantity.value) > 0) {
    addAccessoryBtn.disabled = false;
    addAccessoryBtn.style.opacity = "1";
  } else {
    addAccessoryBtn.disabled = true;
    addAccessoryBtn.style.opacity = "0.5";
  }
}

function updatePackagingPrice() {
  const packagingSelect = document.getElementById("packagingSelect");
  const quantity = document.getElementById("packagingQuantity");
  const addPackagingBtn = document.getElementById("addPackagingBtn");

  if (packagingSelect.value && quantity.value && parseInt(quantity.value) > 0) {
    addPackagingBtn.disabled = false;
    addPackagingBtn.style.opacity = "1";
  } else {
    addPackagingBtn.disabled = true;
    addPackagingBtn.style.opacity = "0.5";
  }
}

function populateComponentSelects() {
  const categories = [
    "7-Segment PCBs",
    "Power Supply",
    "Controller",
    "Accessories",
    "Packaging",
  ];
  const selects = [
    "pcbSelect",
    "powerSelect",
    "controllerSelect",
    "accessorySelect",
    "packagingSelect",
  ];

  selects.forEach((selectId, index) => {
    const select = document.getElementById(selectId);
    const category = categories[index];

    // Clear existing options
    select.innerHTML =
      '<option value="">Choose a ' + category.toLowerCase() + "...</option>";

    // Add components for this category
    const categoryComponents = components.filter(
      (comp) => comp.category === category
    );
    categoryComponents.forEach((comp) => {
      const option = document.createElement("option");
      option.value = comp.id;
      option.textContent = `${comp.name} - ₹${comp.unitPrice}`;
      option.dataset.price = comp.unitPrice;
      select.appendChild(option);
    });
  });
}

// Material Costs Functions
function updateMaterialCosts() {
  materialCosts.acpSheet =
    parseFloat(document.getElementById("acpSheetCost").value) || 0;
  materialCosts.acrylicSheet =
    parseFloat(document.getElementById("acrylicSheetCost").value) || 0;
  materialCosts.printedVinyl =
    parseFloat(document.getElementById("printedVinylCost").value) || 0;
  materialCosts.aluminum =
    parseFloat(document.getElementById("aluminumCost").value) || 0;
  materialCosts.hardware =
    parseFloat(document.getElementById("hardwareCost").value) || 0;

  saveMaterialCosts();
  calculateCabinetCost();
  updateTotalCosts();
}

// Component Selection Functions
function addPCB() {
  const pcbId = document.getElementById("pcbSelect").value;
  const quantity = parseInt(document.getElementById("pcbQuantity").value) || 1;

  if (!pcbId) {
    alert("Please select a PCB.");
    return;
  }

  const component = components.find((comp) => comp.id == pcbId);
  if (component) {
    const selectedPCB = {
      id: component.id,
      name: component.name,
      description: component.description,
      unitPrice: component.unitPrice,
      quantity: quantity,
      totalPrice: component.unitPrice * quantity,
    };

    selectedComponents.pcbs.push(selectedPCB);
    displaySelectedComponents("selectedPCBs", selectedComponents.pcbs);
    updateTotalCosts();
    updateProgress();

    // Show selected components section
    document.getElementById("selectedPCBs").style.display = "block";

    // Reset form
    document.getElementById("pcbSelect").value = "";
    document.getElementById("pcbQuantity").value = "1";
    document.getElementById("addPcbBtn").disabled = true;
    document.getElementById("addPcbBtn").style.opacity = "0.5";
  }
}

function addPowerSupply() {
  const powerId = document.getElementById("powerSelect").value;
  const quantity =
    parseInt(document.getElementById("powerQuantity").value) || 1;

  if (!powerId) {
    alert("Please select a power supply.");
    return;
  }

  const component = components.find((comp) => comp.id == powerId);
  if (component) {
    const selectedPower = {
      id: component.id,
      name: component.name,
      description: component.description,
      unitPrice: component.unitPrice,
      quantity: quantity,
      totalPrice: component.unitPrice * quantity,
    };

    selectedComponents.power.push(selectedPower);
    displaySelectedComponents("selectedPower", selectedComponents.power);
    updateTotalCosts();
    updateProgress();

    // Show selected components section
    document.getElementById("selectedPower").style.display = "block";

    // Reset form
    document.getElementById("powerSelect").value = "";
    document.getElementById("powerQuantity").value = "1";
    document.getElementById("addPowerBtn").disabled = true;
    document.getElementById("addPowerBtn").style.opacity = "0.5";
  }
}

function addController() {
  const controllerId = document.getElementById("controllerSelect").value;
  const quantity =
    parseInt(document.getElementById("controllerQuantity").value) || 1;

  if (!controllerId) {
    alert("Please select a controller.");
    return;
  }

  const component = components.find((comp) => comp.id == controllerId);
  if (component) {
    const selectedController = {
      id: component.id,
      name: component.name,
      description: component.description,
      unitPrice: component.unitPrice,
      quantity: quantity,
      totalPrice: component.unitPrice * quantity,
    };

    selectedComponents.controller.push(selectedController);
    displaySelectedComponents(
      "selectedController",
      selectedComponents.controller
    );
    updateTotalCosts();
    updateProgress();

    // Show selected components section
    document.getElementById("selectedController").style.display = "block";

    // Reset form
    document.getElementById("controllerSelect").value = "";
    document.getElementById("controllerQuantity").value = "1";
    document.getElementById("addControllerBtn").disabled = true;
    document.getElementById("addControllerBtn").style.opacity = "0.5";
  }
}

function addAccessory() {
  const accessoryId = document.getElementById("accessorySelect").value;
  const quantity =
    parseInt(document.getElementById("accessoryQuantity").value) || 1;

  if (!accessoryId) {
    alert("Please select an accessory.");
    return;
  }

  const component = components.find((comp) => comp.id == accessoryId);
  if (component) {
    const selectedAccessory = {
      id: component.id,
      name: component.name,
      description: component.description,
      unitPrice: component.unitPrice,
      quantity: quantity,
      totalPrice: component.unitPrice * quantity,
    };

    selectedComponents.accessories.push(selectedAccessory);
    displaySelectedComponents(
      "selectedAccessories",
      selectedComponents.accessories
    );
    updateTotalCosts();
    updateProgress();

    // Show selected components section
    document.getElementById("selectedAccessories").style.display = "block";

    // Reset form
    document.getElementById("accessorySelect").value = "";
    document.getElementById("accessoryQuantity").value = "1";
    document.getElementById("addAccessoryBtn").disabled = true;
    document.getElementById("addAccessoryBtn").style.opacity = "0.5";
  }
}

function addPackaging() {
  const packagingId = document.getElementById("packagingSelect").value;
  const quantity =
    parseInt(document.getElementById("packagingQuantity").value) || 1;

  if (!packagingId) {
    alert("Please select packaging.");
    return;
  }

  const component = components.find((comp) => comp.id == packagingId);
  if (component) {
    const selectedPackaging = {
      id: component.id,
      name: component.name,
      description: component.description,
      unitPrice: component.unitPrice,
      quantity: quantity,
      totalPrice: component.unitPrice * quantity,
    };

    selectedComponents.packaging.push(selectedPackaging);
    displaySelectedComponents(
      "selectedPackaging",
      selectedComponents.packaging
    );
    updateTotalCosts();
    updateProgress();

    // Show selected components section
    document.getElementById("selectedPackaging").style.display = "block";

    // Reset form
    document.getElementById("packagingSelect").value = "";
    document.getElementById("packagingQuantity").value = "1";
    document.getElementById("addPackagingBtn").disabled = true;
    document.getElementById("addPackagingBtn").style.opacity = "0.5";
  }
}

function displaySelectedComponents(containerId, components) {
  const container = document.getElementById(containerId);
  const componentsList = container.querySelector(".components-list");

  if (components.length === 0) {
    componentsList.innerHTML =
      '<p class="no-components">No components selected.</p>';
    return;
  }

  componentsList.innerHTML = components
    .map(
      (comp, index) => `
    <div class="selected-component">
      <div class="selected-component-info">
        <div class="selected-component-name">${comp.name}</div>
        <div class="selected-component-details">Quantity: ${comp.quantity} × ₹${comp.unitPrice} = ₹${comp.totalPrice}</div>
      </div>
      <div class="selected-component-controls">
        <div class="quantity-control">
          <label>Qty:</label>
          <input 
            type="number" 
            min="1" 
            value="${comp.quantity}" 
            onchange="updateComponentQuantity('${containerId}', ${index}, this.value)"
            class="quantity-input"
          />
        </div>
        <div class="selected-component-price">₹${comp.totalPrice}</div>
        <button class="remove-component" onclick="removeComponent('${containerId}', ${index})" title="Remove">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `
    )
    .join("");
}

function updateComponentQuantity(containerId, index, newQuantity) {
  const containerType = containerId.replace("selected", "").toLowerCase();
  const newQty = parseInt(newQuantity) || 1;

  if (newQty < 1) return;

  selectedComponents[containerType][index].quantity = newQty;
  selectedComponents[containerType][index].totalPrice =
    selectedComponents[containerType][index].unitPrice * newQty;

  displaySelectedComponents(containerId, selectedComponents[containerType]);
  updateTotalCosts();
  updateProgress();
}

function removeComponent(containerId, index) {
  const containerType = containerId.replace("selected", "").toLowerCase();
  selectedComponents[containerType].splice(index, 1);
  displaySelectedComponents(containerId, selectedComponents[containerType]);
  updateTotalCosts();
  updateProgress();
}

// Cabinet Cost Calculation
function calculateCabinetCost() {
  const height =
    parseFloat(document.getElementById("cabinetHeight").value) || 0;
  const width = parseFloat(document.getElementById("cabinetWidth").value) || 0;

  if (height <= 0 || width <= 0) {
    document.getElementById("cabinetCostBreakdown").innerHTML =
      "<p>Please enter valid dimensions.</p>";
    return;
  }

  const area = (height * width) / 144; // Convert to square feet
  const perimeter = (2 * (height + width)) / 12; // Convert to linear feet

  const acpSheetCost = area * materialCosts.acpSheet;
  const acrylicSheetCost = area * materialCosts.acrylicSheet;
  const printedVinylCost = area * materialCosts.printedVinyl;
  const aluminumCost = perimeter * materialCosts.aluminum;
  const hardwareCost = materialCosts.hardware;

  const totalCabinetCost =
    acpSheetCost +
    acrylicSheetCost +
    printedVinylCost +
    aluminumCost +
    hardwareCost;

  document.getElementById("cabinetCostBreakdown").innerHTML = `
      <h4>Material Costs</h4>
      <div class="cabinet-cost-item">
        <span>Aluminum Frame (${perimeter.toFixed(1)} linear feet):</span>
        <span>₹${Math.round(aluminumCost)}</span>
      </div>
      <div class="cabinet-cost-item">
        <span>ACP Sheet (${area.toFixed(1)} sq ft):</span>
        <span>₹${Math.round(acpSheetCost)}</span>
      </div>
      <div class="cabinet-cost-item">
        <span>Acrylic Sheet (${area.toFixed(1)} sq ft):</span>
        <span>₹${Math.round(acrylicSheetCost)}</span>
      </div>
      <div class="cabinet-cost-item">
        <span>Printed Vinyl (${area.toFixed(1)} sq ft):</span>
        <span>₹${Math.round(printedVinylCost)}</span>
      </div>
      <div class="cabinet-cost-item">
        <span>Hardware & Assembly:</span>
        <span>₹${Math.round(hardwareCost)}</span>
      </div>
      <div class="cabinet-cost-item">
        <span>Cabinet Subtotal:</span>
        <span>₹${Math.round(totalCabinetCost)}</span>
      </div>
    `;

  updateTotalCosts();
}

// Progress and Navigation
function updateProgress() {
  const totalSteps = 6;
  let completedSteps = 0;

  if (selectedComponents.pcbs.length > 0) completedSteps++;
  if (selectedComponents.power.length > 0) completedSteps++;
  if (selectedComponents.controller.length > 0) completedSteps++;
  if (document.getElementById("cabinetHeight").value > 0) completedSteps++;
  if (selectedComponents.accessories.length > 0) completedSteps++;
  if (selectedComponents.packaging.length > 0) completedSteps++;

  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  const progressStep = `Step ${completedSteps} of ${totalSteps}`;

  document.getElementById("progressFill").style.width = progressPercent + "%";
  document.getElementById("progressStep").textContent = progressStep;
  document.getElementById("progressPercent").textContent =
    progressPercent + "%";

  // Update active step
  updateActiveStep();
}

function updateActiveStep() {
  const steps = document.querySelectorAll(".category-step");
  steps.forEach((step) => step.classList.remove("active"));

  // Find the first incomplete step
  if (selectedComponents.pcbs.length === 0) {
    document.querySelector('[data-step="pcbs"]').classList.add("active");
  } else if (selectedComponents.power.length === 0) {
    document.querySelector('[data-step="power"]').classList.add("active");
  } else if (selectedComponents.controller.length === 0) {
    document.querySelector('[data-step="controller"]').classList.add("active");
  } else if (document.getElementById("cabinetHeight").value <= 0) {
    document.querySelector('[data-step="cabinet"]').classList.add("active");
  } else if (selectedComponents.accessories.length === 0) {
    document.querySelector('[data-step="accessories"]').classList.add("active");
  } else if (selectedComponents.packaging.length === 0) {
    document.querySelector('[data-step="packaging"]').classList.add("active");
  } else {
    document.querySelector('[data-step="packaging"]').classList.add("active");
  }
}

// Cost Calculations
function updateTotalCosts() {
  const pcbsCost = selectedComponents.pcbs.reduce(
    (sum, comp) => sum + comp.totalPrice,
    0
  );
  const powerCost = selectedComponents.power.reduce(
    (sum, comp) => sum + comp.totalPrice,
    0
  );
  const controllerCost = selectedComponents.controller.reduce(
    (sum, comp) => sum + comp.totalPrice,
    0
  );
  const accessoriesCost = selectedComponents.accessories.reduce(
    (sum, comp) => sum + comp.totalPrice,
    0
  );
  const packagingCost = selectedComponents.packaging.reduce(
    (sum, comp) => sum + comp.totalPrice,
    0
  );

  // Calculate cabinet cost
  const height =
    parseFloat(document.getElementById("cabinetHeight").value) || 0;
  const width = parseFloat(document.getElementById("cabinetWidth").value) || 0;
  let cabinetCost = 0;

  if (height > 0 && width > 0) {
    const area = (height * width) / 144;
    const perimeter = (2 * (height + width)) / 12;
    cabinetCost =
      area * materialCosts.acpSheet +
      area * materialCosts.acrylicSheet +
      area * materialCosts.printedVinyl +
      perimeter * materialCosts.aluminum +
      materialCosts.hardware;
  }

  const subtotal =
    pcbsCost +
    powerCost +
    controllerCost +
    cabinetCost +
    accessoriesCost +
    packagingCost;
  const tax = subtotal * 0.085;
  const total = subtotal + tax;

  // Update display
  document.getElementById("pcbsCost").textContent = `₹${Math.round(pcbsCost)}`;
  document.getElementById("powerCost").textContent = `₹${Math.round(
    powerCost
  )}`;
  document.getElementById("controllerCost").textContent = `₹${Math.round(
    controllerCost
  )}`;
  document.getElementById("cabinetCost").textContent = `₹${Math.round(
    cabinetCost
  )}`;
  document.getElementById("accessoriesCost").textContent = `₹${Math.round(
    accessoriesCost
  )}`;
  document.getElementById("packagingCost").textContent = `₹${Math.round(
    packagingCost
  )}`;
  document.getElementById("subtotal").textContent = `₹${Math.round(subtotal)}`;
  document.getElementById("taxAmount").textContent = `₹${Math.round(tax)}`;
  document.getElementById("totalAmount").textContent = `₹${Math.round(total)}`;
}

// Final Actions
function generateQuote() {
  const total = parseFloat(
    document.getElementById("totalAmount").textContent.replace("₹", "")
  );
  if (total === 0) {
    alert("Please add components before generating a quote.");
    return;
  }

  const quoteData = {
    date: new Date().toLocaleDateString(),
    components: selectedComponents,
    materialCosts: materialCosts,
    cabinetDimensions: {
      height: document.getElementById("cabinetHeight").value,
      width: document.getElementById("cabinetWidth").value,
    },
    total: total,
  };

  // Create and download quote
  const quoteText = generateQuoteText(quoteData);
  const blob = new Blob([quoteText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quote-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  alert("Quote generated and downloaded!");
}

function generateQuoteText(data) {
  let quote = `PRODUCT COST CALCULATOR - QUOTE\n`;
  quote += `Generated on: ${data.date}\n`;
  quote += `\nCOMPONENTS:\n`;

  Object.entries(data.components).forEach(([category, components]) => {
    if (components.length > 0) {
      quote += `\n${category.toUpperCase()}:\n`;
      components.forEach((comp) => {
        quote += `  ${comp.name} - Qty: ${comp.quantity} × ₹${comp.unitPrice} = ₹${comp.totalPrice}\n`;
      });
    }
  });

  quote += `\nCABINET DIMENSIONS:\n`;
  quote += `  Height: ${data.cabinetDimensions.height}"\n`;
  quote += `  Width: ${data.cabinetDimensions.width}"\n`;

  quote += `\nTOTAL: ₹${Math.round(data.total)}\n`;

  return quote;
}

function saveEstimate() {
  const estimateData = {
    components: selectedComponents,
    materialCosts: materialCosts,
    cabinetDimensions: {
      height: document.getElementById("cabinetHeight").value,
      width: document.getElementById("cabinetWidth").value,
    },
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem("savedEstimate", JSON.stringify(estimateData));
  alert("Estimate saved successfully!");
}

function resetConfiguration() {
  if (
    confirm(
      "Are you sure you want to reset the entire configuration? This cannot be undone."
    )
  ) {
    selectedComponents = {
      pcbs: [],
      power: [],
      controller: [],
      accessories: [],
      packaging: [],
    };

    document.getElementById("cabinetHeight").value = "";
    document.getElementById("cabinetWidth").value = "";

    // Hide all selected component sections
    const selectedSections = [
      "selectedPCBs",
      "selectedPower",
      "selectedController",
      "selectedAccessories",
      "selectedPackaging",
    ];

    selectedSections.forEach((id) => {
      document.getElementById(id).style.display = "none";
    });

    // Reset all form inputs
    const formInputs = [
      "pcbSelect",
      "pcbQuantity",
      "powerSelect",
      "powerQuantity",
      "controllerSelect",
      "controllerQuantity",
      "accessorySelect",
      "accessoryQuantity",
      "packagingSelect",
      "packagingQuantity",
    ];

    formInputs.forEach((id) => {
      const element = document.getElementById(id);
      if (element.tagName === "SELECT") {
        element.value = "";
      } else if (element.tagName === "INPUT") {
        element.value = element.id.includes("Quantity") ? "1" : "";
      }
    });

    // Disable all add buttons
    const addButtons = [
      "addPcbBtn",
      "addPowerBtn",
      "addControllerBtn",
      "addAccessoryBtn",
      "addPackagingBtn",
    ];

    addButtons.forEach((id) => {
      const button = document.getElementById(id);
      if (button) {
        button.disabled = true;
        button.style.opacity = "0.5";
      }
    });

    document.getElementById("cabinetCostBreakdown").innerHTML = "";

    updateTotalCosts();
    updateProgress();
  }
}

// Local Storage Functions
function saveComponents() {
  localStorage.setItem("components", JSON.stringify(components));
}

function loadComponents() {
  const saved = localStorage.getItem("components");
  if (saved) {
    components = JSON.parse(saved);
    displayComponents();
    updateComponentCount();
  }
}

function saveMaterialCosts() {
  localStorage.setItem("materialCosts", JSON.stringify(materialCosts));
}

function loadMaterialCosts() {
  const saved = localStorage.getItem("materialCosts");
  if (saved) {
    materialCosts = JSON.parse(saved);

    // Update form values
    document.getElementById("acpSheetCost").value = materialCosts.acpSheet;
    document.getElementById("acrylicSheetCost").value =
      materialCosts.acrylicSheet;
    document.getElementById("printedVinylCost").value =
      materialCosts.printedVinyl;
    document.getElementById("aluminumCost").value = materialCosts.aluminum;
    document.getElementById("hardwareCost").value = materialCosts.hardware;
  }
}

// Event Listeners for Category Steps
document.addEventListener("DOMContentLoaded", function () {
  const categorySteps = document.querySelectorAll(".category-step");
  categorySteps.forEach((step) => {
    step.addEventListener("click", function () {
      const stepName = this.dataset.step;

      // Update active step
      categorySteps.forEach((s) => s.classList.remove("active"));
      this.classList.add("active");

      // Scroll to section
      const section = document.getElementById(stepName + "Section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case "s":
        e.preventDefault();
        saveEstimate();
        break;
      case "r":
        e.preventDefault();
        resetConfiguration();
        break;
      case "q":
        e.preventDefault();
        generateQuote();
        break;
    }
  }

  // Escape key to close modal
  if (e.key === "Escape") {
    closeAddComponentModal();
  }
});

// Modal form validation
function validateModalForm() {
  const name = document.getElementById("modalComponentName").value.trim();
  const price = document.getElementById("modalUnitPrice").value;
  const addButton = document.getElementById("modalAddButton");

  // Enable button only if both name and price are provided
  if (name && price && parseFloat(price) > 0) {
    addButton.disabled = false;
  } else {
    addButton.disabled = true;
  }
}

// Close modal when clicking outside
document.addEventListener("click", function (e) {
  const modal = document.getElementById("addComponentModal");
  if (e.target === modal) {
    closeAddComponentModal();
  }
});
