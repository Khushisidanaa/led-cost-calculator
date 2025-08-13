import React, { useState } from "react";
import { Component, SelectedComponent } from "../App";
import { Plus, X, Minus } from "lucide-react";

interface ComponentSectionProps {
  category: keyof import("../App").SelectedComponents;
  title: string;
  icon: string;
  components: Component[];
  selectedComponents: SelectedComponent[];
  onAddComponent: (
    category: keyof import("../App").SelectedComponents,
    componentId: string,
    quantity: number
  ) => void;
  onRemoveComponent: (
    category: keyof import("../App").SelectedComponents,
    componentId: string
  ) => void;
  onUpdateQuantity: (
    category: keyof import("../App").SelectedComponents,
    componentId: string,
    quantity: number
  ) => void;
}

export const ComponentSection: React.FC<ComponentSectionProps> = ({
  category,
  title,
  icon,
  components,
  selectedComponents,
  onAddComponent,
  onRemoveComponent,
  onUpdateQuantity,
}) => {
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddComponent = () => {
    if (!selectedComponentId || quantity <= 0) return;

    onAddComponent(category, selectedComponentId, quantity);

    // Reset form
    setSelectedComponentId("");
    setQuantity(1);
    setShowAddForm(false);
  };

  const handleRemoveComponent = (componentId: string) => {
    onRemoveComponent(category, componentId);
  };

  const handleQuantityChange = (componentId: string, newQuantity: number) => {
    onUpdateQuantity(category, componentId, newQuantity);
  };

  const isAddButtonDisabled = !selectedComponentId || quantity <= 0;

  return (
    <div className="card-modern">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "24px" }}>{icon}</div>
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "4px",
              }}
            >
              {title}
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b" }}>
              Choose from available {title.toLowerCase()}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`btn-modern transition-all ${
            showAddForm ? "btn-secondary" : ""
          }`}
        >
          <Plus
            className={`h-4 w-4 transition-transform ${
              showAddForm ? "rotate-45" : ""
            }`}
          />
          {showAddForm ? "Close" : `Add ${title.split(" ")[0]}`}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-effect rounded-xl p-6 mb-6 animate-slide-up">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-indigo-600" />
            Add {title.split(" ")[0]} Component
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select {title.split(" ")[0]}
              </label>
              <select
                value={selectedComponentId}
                onChange={(e) => setSelectedComponentId(e.target.value)}
                className="input-modern w-full"
              >
                <option value="">
                  Choose a {title.split(" ")[0].toLowerCase()} type...
                </option>
                {components.map((component) => (
                  <option
                    key={component.id}
                    value={component.id}
                    className="bg-gray-800 text-white"
                  >
                    {component.name} - ₹{component.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="input-modern w-full"
                />
              </div>
              <button
                onClick={handleAddComponent}
                disabled={isAddButtonDisabled}
                className={`btn-modern w-full ${
                  isAddButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Plus className="h-4 w-4" />
                Add Component
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedComponents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              Selected Components ({selectedComponents.length})
            </h4>
            <div className="cost-badge">
              Total: ₹
              {selectedComponents
                .reduce((sum, sc) => sum + sc.quantity * sc.component.price, 0)
                .toFixed(2)}
            </div>
          </div>
          <div className="grid gap-4">
            {selectedComponents.map((selectedComponent) => (
              <div
                key={selectedComponent.componentId}
                className="card-modern p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold text-gray-900">
                        {selectedComponent.component.name}
                      </h5>
                      <div className="cost-badge">
                        ₹{selectedComponent.component.price.toFixed(2)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedComponent.component.description}
                    </p>
                    <div className="text-sm font-medium text-indigo-600">
                      Total: {selectedComponent.quantity} × ₹
                      {selectedComponent.component.price.toFixed(2)} = ₹
                      {(
                        selectedComponent.quantity *
                        selectedComponent.component.price
                      ).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            selectedComponent.componentId,
                            selectedComponent.quantity - 1
                          )
                        }
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-2 text-sm font-medium text-gray-900 bg-white">
                        {selectedComponent.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            selectedComponent.componentId,
                            selectedComponent.quantity + 1
                          )
                        }
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveComponent(selectedComponent.componentId)
                      }
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
