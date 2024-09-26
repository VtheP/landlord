import React, { useState } from 'react';

type Unit = {
  id: string;
  renter: string;
  contact: string;
  rent: number;
};

type Property = {
  id: string;
  address: string;
  units: Unit[];
};

type PropertyFormProps = {
  property: Property;
  onSave: (property: Property) => void;
  onCancel: () => void;
};

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onSave, onCancel }) => {
  const [editedProperty, setEditedProperty] = useState<Property>(property);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProperty({ ...editedProperty, address: e.target.value });
  };

  const handleUnitChange = (unitId: string, field: keyof Unit, value: string | number) => {
    const updatedUnits = editedProperty.units.map(unit => 
      unit.id === unitId ? { ...unit, [field]: value } : unit
    );
    setEditedProperty({ ...editedProperty, units: updatedUnits });
  };

  const handleAddUnit = () => {
    const newUnit: Unit = {
      id: Date.now().toString(),
      renter: '',
      contact: '',
      rent: 0
    };
    setEditedProperty({
      ...editedProperty,
      units: [...editedProperty.units, newUnit]
    });
  };

  const handleRemoveUnit = (unitId: string) => {
    const updatedUnits = editedProperty.units.filter(unit => unit.id !== unitId);
    setEditedProperty({ ...editedProperty, units: updatedUnits });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedProperty);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          value={editedProperty.address}
          onChange={handleAddressChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <h4 className="text-lg font-medium text-gray-700">Units</h4>
        {editedProperty.units.map((unit) => (
          <div key={unit.id} className="mt-2 p-2 border rounded">
            <input
              type="text"
              value={unit.renter}
              onChange={(e) => handleUnitChange(unit.id, 'renter', e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Renter Name"
            />
            <input
              type="text"
              value={unit.contact}
              onChange={(e) => handleUnitChange(unit.id, 'contact', e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Contact Information"
            />
            <input
              type="number"
              value={unit.rent}
              onChange={(e) => handleUnitChange(unit.id, 'rent', Number(e.target.value))}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Rent Amount"
            />
            <button
              type="button"
              onClick={() => handleRemoveUnit(unit.id)}
              className="mt-2 px-2 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Remove Unit
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddUnit}
          className="mt-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          Add Unit
        </button>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Save Property
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;