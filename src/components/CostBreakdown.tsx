import React from "react";
import { MaterialCost, SelectedComponents, CabinetDimensions } from "../App";
import { Download, Save, RotateCcw } from "lucide-react";

interface CostBreakdownProps {
  selectedComponents: SelectedComponents;
  cabinetDimensions: CabinetDimensions;
  materialCosts: MaterialCost[];
  totalCost: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  selectedComponents,
  cabinetDimensions,
  materialCosts,
  totalCost,
}) => {
  const calculateCategoryCost = (category: keyof SelectedComponents) => {
    return selectedComponents[category].reduce((sum, selectedComponent) => {
      return (
        sum + selectedComponent.component.price * selectedComponent.quantity
      );
    }, 0);
  };

  const calculateCabinetCost = () => {
    if (cabinetDimensions.height <= 0 || cabinetDimensions.width <= 0) return 0;

    const aluminumCost = materialCosts.find((m) => m.material === "Aluminum");
    const acpSheetCost = materialCosts.find((m) => m.material === "ACP Sheet");
    const acrylicCost = materialCosts.find(
      (m) => m.material === "Acrylic Sheet"
    );
    const vinylCost = materialCosts.find((m) => m.material === "Printed Vinyl");
    const hardwareCost = materialCosts.find((m) => m.material === "Hardware");

    if (
      !aluminumCost ||
      !acpSheetCost ||
      !acrylicCost ||
      !vinylCost ||
      !hardwareCost
    ) {
      return 0;
    }

    const linearFeet =
      (2 * (cabinetDimensions.height + cabinetDimensions.width)) / 12;
    const squareFeet =
      (cabinetDimensions.height * cabinetDimensions.width) / 144;

    return (
      aluminumCost.costPerUnit * linearFeet +
      acpSheetCost.costPerUnit * squareFeet +
      acrylicCost.costPerUnit * squareFeet +
      vinylCost.costPerUnit * squareFeet +
      hardwareCost.costPerUnit
    );
  };

  const subtotal =
    Object.keys(selectedComponents).reduce(
      (sum, category) =>
        sum + calculateCategoryCost(category as keyof SelectedComponents),
      0
    ) + calculateCabinetCost();
  const tax = subtotal * 0.085;

  const handleGenerateQuote = () => {
    const quoteText = generateQuoteText();
    const blob = new Blob([quoteText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `product-quote-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateQuoteText = () => {
    let quote = `PRODUCT COST QUOTE\n`;
    quote += `Generated: ${new Date().toLocaleDateString()}\n`;
    quote += `=====================================\n\n`;

    // Component costs
    quote += `COMPONENT COSTS:\n`;
    Object.entries(selectedComponents).forEach(([category, components]) => {
      if (components.length > 0) {
        quote += `\n${category.toUpperCase()}:\n`;
        components.forEach((selectedComponent: any) => {
          quote += `  ${selectedComponent.component.name}\n`;
          quote += `    Quantity: ${selectedComponent.quantity}\n`;
          quote += `    Unit Price: ₹${selectedComponent.component.price.toFixed(
            2
          )}\n`;
          quote += `    Total: ₹${(
            selectedComponent.component.price * selectedComponent.quantity
          ).toFixed(2)}\n`;
        });
        quote += `  Category Total: ₹${calculateCategoryCost(
          category as keyof SelectedComponents
        ).toFixed(2)}\n`;
      }
    });

    // Cabinet cost
    const cabinetCost = calculateCabinetCost();
    if (cabinetCost > 0) {
      quote += `\nCABINET COST:\n`;
      quote += `  Dimensions: ${cabinetDimensions.height}" × ${cabinetDimensions.width}"\n`;
      quote += `  Total: ₹${cabinetCost.toFixed(2)}\n`;
    }

    // Summary
    quote += `\n=====================================\n`;
    quote += `Subtotal: ₹${subtotal.toFixed(2)}\n`;
    quote += `Tax (8.5%): ₹${tax.toFixed(2)}\n`;
    quote += `TOTAL: ₹${totalCost.toFixed(2)}\n`;

    return quote;
  };

  const handleSaveEstimate = () => {
    try {
      const estimate = {
        selectedComponents,
        cabinetDimensions,
        totalCost,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("calculator-estimate", JSON.stringify(estimate));
      alert("Estimate saved successfully!");
    } catch (error) {
      alert("Failed to save estimate");
    }
  };

  const handleResetConfiguration = () => {
    if (
      confirm(
        "Are you sure you want to reset the configuration? This will clear all selected components and dimensions."
      )
    ) {
      // Reset selected components
      Object.keys(selectedComponents).forEach((category) => {
        (selectedComponents as any)[category] = [];
      });

      // Reset cabinet dimensions
      Object.assign(cabinetDimensions, { height: 0, width: 0 });

      // Clear local storage
      localStorage.removeItem("calculator-selected-components");
      localStorage.removeItem("calculator-cabinet-dimensions");

      // Reload page to reset state
      window.location.reload();
    }
  };

  return (
    <div className="card-modern">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div style={{ fontSize: "24px" }}>💰</div>
        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "4px",
            }}
          >
            Cost Breakdown
          </h3>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Real-time cost calculation
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🔴</span>
            <span className="font-medium text-gray-700">PCBs</span>
          </div>
          <div className="cost-badge">
            ₹{calculateCategoryCost("pcbs").toFixed(2)}
          </div>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center space-x-3">
            <span className="text-xl">⚡</span>
            <span className="font-medium text-white/90">Power Supply</span>
          </div>
          <div className="cost-badge">
            ₹{calculateCategoryCost("power").toFixed(2)}
          </div>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🎮</span>
            <span className="font-medium text-white/90">Controller</span>
          </div>
          <div className="cost-badge">
            ₹{calculateCategoryCost("controller").toFixed(2)}
          </div>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center space-x-3">
            <span className="text-xl">📦</span>
            <span className="font-medium text-white/90">Cabinet</span>
          </div>
          <div className="cost-badge">₹{calculateCabinetCost().toFixed(2)}</div>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🔧</span>
            <span className="font-medium text-white/90">Accessories</span>
          </div>
          <div className="cost-badge">
            ₹{calculateCategoryCost("accessories").toFixed(2)}
          </div>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center space-x-3">
            <span className="text-xl">📦</span>
            <span className="font-medium text-white/90">Packaging</span>
          </div>
          <div className="cost-badge">
            ₹{calculateCategoryCost("packaging").toFixed(2)}
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 mt-6 space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/8 rounded-xl border border-white/15">
            <span className="font-semibold text-white">Subtotal:</span>
            <span className="font-semibold text-white text-lg">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/8 rounded-xl border border-white/15">
            <span className="text-gray-300">Tax (8.5%):</span>
            <span className="font-medium text-gray-300">₹{tax.toFixed(2)}</span>
          </div>
          <div className="relative p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="relative flex justify-between items-center">
              <span className="text-xl font-bold">Total Cost:</span>
              <span className="text-3xl font-bold drop-shadow-lg">
                ₹{totalCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={handleGenerateQuote} className="btn-modern w-full">
          <Download className="h-4 w-4" />
          Generate Quote
        </button>
        <button
          onClick={handleSaveEstimate}
          className="btn-modern btn-secondary w-full"
        >
          <Save className="h-4 w-4" />
          Save Estimate
        </button>
        <button
          onClick={handleResetConfiguration}
          className="btn-modern btn-secondary w-full text-red-600 hover:text-red-700"
        >
          <RotateCcw className="h-4 w-4" />
          Reset All
        </button>
      </div>
    </div>
  );
};
