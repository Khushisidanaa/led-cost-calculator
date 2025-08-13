import React from "react";
import { MaterialCost, CabinetDimensions } from "../App";

interface CabinetSectionProps {
  dimensions: CabinetDimensions;
  materialCosts: MaterialCost[];
  onDimensionsChange: (dimensions: CabinetDimensions) => void;
}

export const CabinetSection: React.FC<CabinetSectionProps> = ({
  dimensions,
  materialCosts,
  onDimensionsChange,
}) => {
  const calculateCabinetCost = () => {
    if (dimensions.height <= 0 || dimensions.width <= 0) return null;

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
      return null;
    }

    const linearFeet = (2 * (dimensions.height + dimensions.width)) / 12;
    const squareFeet = (dimensions.height * dimensions.width) / 144;

    const aluminumFrameCost = aluminumCost.costPerUnit * linearFeet;
    const acpSheetCostTotal = acpSheetCost.costPerUnit * squareFeet;
    const acrylicCostTotal = acrylicCost.costPerUnit * squareFeet;
    const vinylCostTotal = vinylCost.costPerUnit * squareFeet;
    const hardwareCostTotal = hardwareCost.costPerUnit;

    const totalCabinetCost =
      aluminumFrameCost +
      acpSheetCostTotal +
      acrylicCostTotal +
      vinylCostTotal +
      hardwareCostTotal;

    return {
      aluminumFrame: { cost: aluminumFrameCost, linearFeet },
      acpSheet: { cost: acpSheetCostTotal, squareFeet },
      acrylic: { cost: acrylicCostTotal, squareFeet },
      vinyl: { cost: vinylCostTotal, squareFeet },
      hardware: { cost: hardwareCostTotal },
      total: totalCabinetCost,
    };
  };

  const cabinetCost = calculateCabinetCost();

  return (
    <div className="card-modern">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "24px" }}>📦</div>
        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "4px",
            }}
          >
            Custom Cabinet Dimensions
          </h3>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Enter dimensions to calculate material costs
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Height (inches)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={dimensions.height || ""}
            onChange={(e) =>
              onDimensionsChange({
                ...dimensions,
                height: parseFloat(e.target.value) || 0,
              })
            }
            className="input-modern w-full"
            placeholder="Enter height"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Width (inches)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={dimensions.width || ""}
            onChange={(e) =>
              onDimensionsChange({
                ...dimensions,
                width: parseFloat(e.target.value) || 0,
              })
            }
            className="input-modern w-full"
            placeholder="Enter width"
          />
        </div>
      </div>

      {cabinetCost && (
        <div className="mt-8 glass-effect rounded-xl p-6 animate-slide-up">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="category-icon mr-3">💰</div>
            Cabinet Cost Breakdown
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg border border-white/20">
              <div>
                <span className="font-medium text-white">Aluminum Frame</span>
                <span className="block text-xs text-purple-200">
                  {cabinetCost.aluminumFrame.linearFeet.toFixed(1)} linear feet
                </span>
              </div>
              <div className="cost-badge">
                ₹{cabinetCost.aluminumFrame.cost.toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg border border-white/20">
              <div>
                <span className="font-medium text-white">ACP Sheet</span>
                <span className="block text-xs text-purple-200">
                  {cabinetCost.acpSheet.squareFeet.toFixed(1)} sq ft
                </span>
              </div>
              <div className="cost-badge">
                ₹{cabinetCost.acpSheet.cost.toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg border border-white/20">
              <div>
                <span className="font-medium text-white">Acrylic Sheet</span>
                <span className="block text-xs text-purple-200">
                  {cabinetCost.acrylic.squareFeet.toFixed(1)} sq ft
                </span>
              </div>
              <div className="cost-badge">
                ₹{cabinetCost.acrylic.cost.toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg border border-white/20">
              <div>
                <span className="font-medium text-white">Printed Vinyl</span>
                <span className="block text-xs text-purple-200">
                  {cabinetCost.vinyl.squareFeet.toFixed(1)} sq ft
                </span>
              </div>
              <div className="cost-badge">
                ₹{cabinetCost.vinyl.cost.toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg border border-white/20">
              <div>
                <span className="font-medium text-white">
                  Hardware & Assembly
                </span>
                <span className="block text-xs text-purple-200">
                  Fixed cost
                </span>
              </div>
              <div className="cost-badge">
                ₹{cabinetCost.hardware.cost.toFixed(2)}
              </div>
            </div>
            <div className="border-t-2 border-indigo-100 pt-4 mt-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <span className="text-lg font-bold text-gray-900">
                  Cabinet Subtotal:
                </span>
                <div className="text-xl font-bold text-indigo-600">
                  ₹{cabinetCost.total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
