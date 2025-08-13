import React, { useState } from 'react';
import { Component, MaterialCost } from '../App';
import { X, Plus, Edit, Trash2, Save, X as Close } from 'lucide-react';

interface AdminPanelProps {
  components: Component[];
  materialCosts: MaterialCost[];
  onComponentsChange: (components: Component[]) => void;
  onMaterialCostsChange: (materialCosts: MaterialCost[]) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  components, 
  materialCosts, 
  onComponentsChange, 
  onMaterialCostsChange, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'components' | 'material-costs'>('components');
  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);
  const [editingMaterialCostId, setEditingMaterialCostId] = useState<string | null>(null);
  const [componentForm, setComponentForm] = useState({
    category: '',
    name: '',
    description: '',
    price: '',
  });
  const [materialCostForm, setMaterialCostForm] = useState({
    material: '',
    costPerUnit: '',
    unit: '',
  });

  const handleAddComponent = () => {
    if (!componentForm.category || !componentForm.name || !componentForm.description || !componentForm.price) {
      return;
    }

    const newComponent: Component = {
      id: Date.now().toString(),
      category: componentForm.category,
      name: componentForm.name,
      description: componentForm.description,
      price: parseFloat(componentForm.price),
      isActive: true,
    };

    onComponentsChange([...components, newComponent]);
    setComponentForm({ category: '', name: '', description: '', price: '' });
  };

  const handleUpdateComponent = () => {
    if (!editingComponentId || !componentForm.category || !componentForm.name || !componentForm.description || !componentForm.price) {
      return;
    }

    const updatedComponents = components.map(component =>
      component.id === editingComponentId
        ? {
            ...component,
            category: componentForm.category,
            name: componentForm.name,
            description: componentForm.description,
            price: parseFloat(componentForm.price),
          }
        : component
    );

    onComponentsChange(updatedComponents);
    setEditingComponentId(null);
    setComponentForm({ category: '', name: '', description: '', price: '' });
  };

  const handleDeleteComponent = (id: string) => {
    const updatedComponents = components.filter(component => component.id !== id);
    onComponentsChange(updatedComponents);
  };

  const handleEditComponent = (component: Component) => {
    setEditingComponentId(component.id);
    setComponentForm({
      category: component.category,
      name: component.name,
      description: component.description,
      price: component.price.toString(),
    });
  };

  const handleUpdateMaterialCost = () => {
    if (!editingMaterialCostId || !materialCostForm.material || !materialCostForm.costPerUnit || !materialCostForm.unit) {
      return;
    }

    const updatedMaterialCosts = materialCosts.map(cost =>
      cost.id === editingMaterialCostId
        ? {
            ...cost,
            material: materialCostForm.material,
            costPerUnit: parseFloat(materialCostForm.costPerUnit),
            unit: materialCostForm.unit,
          }
        : cost
    );

    onMaterialCostsChange(updatedMaterialCosts);
    setEditingMaterialCostId(null);
    setMaterialCostForm({ material: '', costPerUnit: '', unit: '' });
  };

  const handleEditMaterialCost = (cost: MaterialCost) => {
    setEditingMaterialCostId(cost.id);
    setMaterialCostForm({
      material: cost.material,
      costPerUnit: cost.costPerUnit.toString(),
      unit: cost.unit,
    });
  };

  const categories = ['7-Segment PCBs', 'Power Supply', 'Controller', 'Accessories', 'Packaging'];
  const units = ['square_foot', 'linear_foot', 'fixed'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel - Parts Management</h1>
        <button
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <X className="h-4 w-4 mr-2" />
          Close
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('components')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'components'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Components
          </button>
          <button
            onClick={() => setActiveTab('material-costs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'material-costs'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Material Costs
          </button>
        </nav>
      </div>

      {activeTab === 'components' && (
        <div>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingComponentId ? 'Edit Component' : 'Add New Component'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={componentForm.category}
                  onChange={(e) => setComponentForm({ ...componentForm, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select category...</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Component Name
                </label>
                <input
                  type="text"
                  value={componentForm.name}
                  onChange={(e) => setComponentForm({ ...componentForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter component name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={componentForm.description}
                  onChange={(e) => setComponentForm({ ...componentForm, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter component description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={componentForm.price}
                  onChange={(e) => setComponentForm({ ...componentForm, price: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              {editingComponentId ? (
                <>
                  <button
                    onClick={handleUpdateComponent}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Component
                  </button>
                  <button
                    onClick={() => {
                      setEditingComponentId(null);
                      setComponentForm({ category: '', name: '', description: '', price: '' });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Close className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAddComponent}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Component
                  </button>
                  <button
                    onClick={() => setComponentForm({ category: '', name: '', description: '', price: '' })}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Components</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {components.map((component) => (
                    <tr key={component.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {component.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {component.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {component.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{component.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditComponent(component)}
                            className="text-primary hover:text-primary/80"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteComponent(component.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'material-costs' && (
        <div>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingMaterialCostId ? 'Edit Material Cost' : 'Add New Material Cost'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  value={materialCostForm.material}
                  onChange={(e) => setMaterialCostForm({ ...materialCostForm, material: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., ACP Sheet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Per Unit (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={materialCostForm.costPerUnit}
                  onChange={(e) => setMaterialCostForm({ ...materialCostForm, costPerUnit: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  value={materialCostForm.unit}
                  onChange={(e) => setMaterialCostForm({ ...materialCostForm, unit: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select unit...</option>
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              {editingMaterialCostId ? (
                <>
                  <button
                    onClick={handleUpdateMaterialCost}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Material Cost
                  </button>
                  <button
                    onClick={() => {
                      setEditingMaterialCostId(null);
                      setMaterialCostForm({ material: '', costPerUnit: '', unit: '' });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Close className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    const newMaterialCost: MaterialCost = {
                      id: Date.now().toString(),
                      material: materialCostForm.material,
                      costPerUnit: parseFloat(materialCostForm.costPerUnit),
                      unit: materialCostForm.unit,
                    };
                    onMaterialCostsChange([...materialCosts, newMaterialCost]);
                    setMaterialCostForm({ material: '', costPerUnit: '', unit: '' });
                  }}
                  disabled={!materialCostForm.material || !materialCostForm.costPerUnit || !materialCostForm.unit}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material Cost
                </button>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Material Costs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost Per Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {materialCosts.map((cost) => (
                    <tr key={cost.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cost.material}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{cost.costPerUnit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cost.unit.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditMaterialCost(cost)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
