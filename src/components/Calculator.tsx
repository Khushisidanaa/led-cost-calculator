import React from "react";
import {
  Component,
  MaterialCost,
  SelectedComponents,
  CabinetDimensions,
} from "../App";
import { ComponentSection } from "./ComponentSection";
import { CabinetSection } from "./CabinetSection";
import { CostBreakdown } from "./CostBreakdown";

interface CalculatorProps {
  components: Component[];
  materialCosts: MaterialCost[];
  selectedComponents: SelectedComponents;
  cabinetDimensions: CabinetDimensions;
  totalCost: number;
  onAddComponent: (
    category: keyof SelectedComponents,
    componentId: string,
    quantity: number
  ) => void;
  onRemoveComponent: (
    category: keyof SelectedComponents,
    componentId: string
  ) => void;
  onUpdateQuantity: (
    category: keyof SelectedComponents,
    componentId: string,
    quantity: number
  ) => void;
  onCabinetDimensionsChange: (dimensions: CabinetDimensions) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  components,
  materialCosts,
  selectedComponents,
  cabinetDimensions,
  totalCost,
  onAddComponent,
  onRemoveComponent,
  onUpdateQuantity,
  onCabinetDimensionsChange,
}) => {
  const categories = [
    { key: "pcbs", title: "7-Segment Digit PCBs", icon: "🔴" },
    { key: "power", title: "Power Supply", icon: "⚡" },
    { key: "controller", title: "Controller", icon: "🎮" },
    { key: "accessories", title: "Accessories", icon: "🔧" },
    { key: "packaging", title: "Packaging Options", icon: "📦" },
  ] as const;

  // Calculate progress based on selected components
  const totalCategories = categories.length;
  const completedCategories = categories.filter(
    (category) => selectedComponents[category.key].length > 0
  ).length;
  const progressPercentage = Math.round(
    (completedCategories / totalCategories) * 100
  );

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      {/* Simple Progress Section */}
      <div className="glass-effect" style={{ marginBottom: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              LED Cost Calculator
            </h2>
            <p style={{ color: "#64748b", fontSize: "16px" }}>
              Configure your LED display components
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "700", color: "#3b82f6" }}
            >
              {progressPercentage}% Complete
            </div>
            <div style={{ fontSize: "14px", color: "#64748b" }}>
              {completedCategories}/{totalCategories} sections
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "12px",
          }}
        >
          {categories.map((category) => {
            const isCompleted = selectedComponents[category.key].length > 0;
            return (
              <div
                key={category.key}
                style={{
                  textAlign: "center",
                  padding: "16px",
                  borderRadius: "8px",
                  border: isCompleted
                    ? "2px solid #10b981"
                    : "1px solid #e2e8f0",
                  backgroundColor: isCompleted ? "#f0fdf4" : "#f8fafc",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                  {category.icon}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  {category.title.split(" ")[0]}
                </div>
                {isCompleted && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#10b981",
                      marginTop: "4px",
                    }}
                  >
                    ✓ Done
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth > 1024 ? "1fr 350px" : "1fr",
          gap: "30px",
        }}
      >
        <div>
          {categories.map((category) => (
            <div key={category.key}>
              <ComponentSection
                category={category.key}
                title={category.title}
                icon={category.icon}
                components={components.filter(
                  (c) => c.category === category.title
                )}
                selectedComponents={selectedComponents[category.key]}
                onAddComponent={onAddComponent}
                onRemoveComponent={onRemoveComponent}
                onUpdateQuantity={onUpdateQuantity}
              />
            </div>
          ))}
          <CabinetSection
            dimensions={cabinetDimensions}
            materialCosts={materialCosts}
            onDimensionsChange={onCabinetDimensionsChange}
          />
        </div>
        <div>
          <div
            style={{
              position: window.innerWidth > 1024 ? "sticky" : "static",
              top: "20px",
            }}
          >
            <CostBreakdown
              selectedComponents={selectedComponents}
              cabinetDimensions={cabinetDimensions}
              materialCosts={materialCosts}
              totalCost={totalCost}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
