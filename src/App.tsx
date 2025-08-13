import { useState, useEffect } from "react";
import { Calculator } from "./components/Calculator";
import { AdminPanel } from "./components/AdminPanel";
import { Header } from "./components/Header";

// Types for local storage
export interface Component {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
}

export interface MaterialCost {
  id: string;
  material: string;
  costPerUnit: number;
  unit: string;
}

export interface SelectedComponent {
  componentId: string;
  quantity: number;
  component: Component;
}

export interface SelectedComponents {
  pcbs: SelectedComponent[];
  power: SelectedComponent[];
  controller: SelectedComponent[];
  accessories: SelectedComponent[];
  packaging: SelectedComponent[];
}

export interface CabinetDimensions {
  height: number;
  width: number;
}

function App() {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [components, setComponents] = useState<Component[]>([]);
  const [materialCosts, setMaterialCosts] = useState<MaterialCost[]>([]);
  const [selectedComponents, setSelectedComponents] =
    useState<SelectedComponents>({
      pcbs: [],
      power: [],
      controller: [],
      accessories: [],
      packaging: [],
    });
  const [cabinetDimensions, setCabinetDimensions] = useState<CabinetDimensions>(
    {
      height: 0,
      width: 0,
    }
  );
  const [totalCost, setTotalCost] = useState(0);

  // Load data from local storage on startup
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Calculate total cost whenever selections change
  useEffect(() => {
    calculateTotalCost();
  }, [selectedComponents, cabinetDimensions]);

  const loadFromLocalStorage = () => {
    try {
      // Load components
      const savedComponents = localStorage.getItem("calculator-components");
      if (savedComponents) {
        setComponents(JSON.parse(savedComponents));
      } else {
        // Set default components
        const defaultComponents: Component[] = [
          {
            id: "1",
            category: "7-Segment PCBs",
            name: "7-Segment Blue LED - 6 inch",
            description: "Standard 6-inch blue LED display",
            price: 85.0,
            isActive: true,
          },
          {
            id: "2",
            category: "Power Supply",
            name: "12V 5A Power Supply",
            description: "12V 5A switching power supply",
            price: 25.0,
            isActive: true,
          },
          {
            id: "3",
            category: "Controller",
            name: "Arduino Uno R3",
            description: "Arduino Uno microcontroller board",
            price: 15.0,
            isActive: true,
          },
        ];
        setComponents(defaultComponents);
        localStorage.setItem(
          "calculator-components",
          JSON.stringify(defaultComponents)
        );
      }

      // Load material costs
      const savedMaterialCosts = localStorage.getItem(
        "calculator-material-costs"
      );
      if (savedMaterialCosts) {
        setMaterialCosts(JSON.parse(savedMaterialCosts));
      } else {
        // Set default material costs
        const defaultMaterialCosts: MaterialCost[] = [
          {
            id: "1",
            material: "ACP Sheet",
            costPerUnit: 8.75,
            unit: "square_foot",
          },
          {
            id: "2",
            material: "Acrylic Sheet",
            costPerUnit: 15.0,
            unit: "square_foot",
          },
          {
            id: "3",
            material: "Printed Vinyl",
            costPerUnit: 8.0,
            unit: "square_foot",
          },
          {
            id: "4",
            material: "Aluminum",
            costPerUnit: 12.5,
            unit: "linear_foot",
          },
          { id: "5", material: "Hardware", costPerUnit: 45.0, unit: "fixed" },
        ];
        setMaterialCosts(defaultMaterialCosts);
        localStorage.setItem(
          "calculator-material-costs",
          JSON.stringify(defaultMaterialCosts)
        );
      }

      // Load selected components
      const savedSelectedComponents = localStorage.getItem(
        "calculator-selected-components"
      );
      if (savedSelectedComponents) {
        setSelectedComponents(JSON.parse(savedSelectedComponents));
      }

      // Load cabinet dimensions
      const savedCabinetDimensions = localStorage.getItem(
        "calculator-cabinet-dimensions"
      );
      if (savedCabinetDimensions) {
        setCabinetDimensions(JSON.parse(savedCabinetDimensions));
      }
    } catch (error) {
      console.error("Error loading from local storage:", error);
    }
  };

  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  const addComponent = (
    category: keyof SelectedComponents,
    componentId: string,
    quantity: number
  ) => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    const newSelectedComponent: SelectedComponent = {
      componentId,
      quantity,
      component,
    };

    setSelectedComponents((prev) => {
      const updated = {
        ...prev,
        [category]: [...prev[category], newSelectedComponent],
      };
      saveToLocalStorage("calculator-selected-components", updated);
      return updated;
    });
  };

  const removeComponent = (
    category: keyof SelectedComponents,
    componentId: string
  ) => {
    setSelectedComponents((prev) => {
      const updated = {
        ...prev,
        [category]: prev[category].filter(
          (sc) => sc.componentId !== componentId
        ),
      };
      saveToLocalStorage("calculator-selected-components", updated);
      return updated;
    });
  };

  const updateComponentQuantity = (
    category: keyof SelectedComponents,
    componentId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      removeComponent(category, componentId);
      return;
    }

    setSelectedComponents((prev) => {
      const updated = {
        ...prev,
        [category]: prev[category].map((sc) =>
          sc.componentId === componentId ? { ...sc, quantity: newQuantity } : sc
        ),
      };
      saveToLocalStorage("calculator-selected-components", updated);
      return updated;
    });
  };

  const calculateTotalCost = () => {
    let total = 0;

    // Calculate component costs
    Object.values(selectedComponents).forEach(
      (categoryComponents: SelectedComponent[]) => {
        categoryComponents.forEach((selectedComponent: SelectedComponent) => {
          total +=
            selectedComponent.component.price * selectedComponent.quantity;
        });
      }
    );

    // Calculate cabinet cost
    if (cabinetDimensions.height > 0 && cabinetDimensions.width > 0) {
      const aluminumCost = materialCosts.find((m) => m.material === "Aluminum");
      const acpSheetCost = materialCosts.find(
        (m) => m.material === "ACP Sheet"
      );
      const acrylicCost = materialCosts.find(
        (m) => m.material === "Acrylic Sheet"
      );
      const vinylCost = materialCosts.find(
        (m) => m.material === "Printed Vinyl"
      );
      const hardwareCost = materialCosts.find((m) => m.material === "Hardware");

      if (
        aluminumCost &&
        acpSheetCost &&
        acrylicCost &&
        vinylCost &&
        hardwareCost
      ) {
        const linearFeet =
          (2 * (cabinetDimensions.height + cabinetDimensions.width)) / 12;
        const squareFeet =
          (cabinetDimensions.height * cabinetDimensions.width) / 144;

        const cabinetCost =
          aluminumCost.costPerUnit * linearFeet +
          acpSheetCost.costPerUnit * squareFeet +
          acrylicCost.costPerUnit * squareFeet +
          vinylCost.costPerUnit * squareFeet +
          hardwareCost.costPerUnit;

        total += cabinetCost;
      }
    }

    setTotalCost(total);
  };

  const handleComponentsChange = (newComponents: Component[]) => {
    setComponents(newComponents);
    saveToLocalStorage("calculator-components", newComponents);
  };

  const handleMaterialCostsChange = (newMaterialCosts: MaterialCost[]) => {
    setMaterialCosts(newMaterialCosts);
    saveToLocalStorage("calculator-material-costs", newMaterialCosts);
  };

  const handleCabinetDimensionsChange = (dimensions: CabinetDimensions) => {
    setCabinetDimensions(dimensions);
    saveToLocalStorage("calculator-cabinet-dimensions", dimensions);
  };

  return (
    <div className="min-h-screen">
      <Header
        onAdminClick={() => setIsAdminPanelOpen(true)}
        onHomeClick={() => setIsAdminPanelOpen(false)}
      />
      <div className="min-h-screen pt-4 pb-16">
        {isAdminPanelOpen ? (
          <AdminPanel
            components={components}
            materialCosts={materialCosts}
            onComponentsChange={handleComponentsChange}
            onMaterialCostsChange={handleMaterialCostsChange}
            onClose={() => setIsAdminPanelOpen(false)}
          />
        ) : (
          <Calculator
            components={components}
            materialCosts={materialCosts}
            selectedComponents={selectedComponents}
            cabinetDimensions={cabinetDimensions}
            totalCost={totalCost}
            onAddComponent={addComponent}
            onRemoveComponent={removeComponent}
            onUpdateQuantity={updateComponentQuantity}
            onCabinetDimensionsChange={handleCabinetDimensionsChange}
          />
        )}
      </div>
    </div>
  );
}

export default App;
