'use client';

import React, { useState, useEffect } from 'react';
import PropertyForm from './PropertyForm';
import NewPropertyForm, { NewPropertyFormProps } from './NewPropertyForm';
import { useAuth } from '../contexts/AuthContext';

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

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        console.error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };



  const toggleExpand = (propertyId: string) => {
    setExpandedProperty(expandedProperty === propertyId ? null : propertyId);
  };

  const handleEditProperty = (propertyId: string) => {
    setEditingProperty(propertyId);
  };

  const handleSaveProperty = async (property: Property) => {
    await updateProperty(property);
    setEditingProperty(null);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    await fetch(`/api/properties?id=${propertyId}`, { method: 'DELETE' });
    await fetchProperties();
  };

  const updateProperty = async (property: Property) => {
    await fetch('/api/properties', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    });
    await fetchProperties();
  };

  const handleSaveNewProperty: NewPropertyFormProps['onSave'] = async (property) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      if (response.ok) {
        setShowNewPropertyForm(false);
        await fetchProperties();
      } else {
        console.error('Failed to create property');
      }
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {user ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Your Properties</h2>
          <button 
            onClick={() => setShowNewPropertyForm(true)}
            className="bg-green-500 text-white p-2 rounded mb-4"
          >
            Add New Property
          </button>
          {showNewPropertyForm && (
            <NewPropertyForm 
              onSave={handleSaveNewProperty}
              onCancel={() => setShowNewPropertyForm(false)}
            />
          )}
          {properties.length > 0 ? (
            <ul className="space-y-4">
              {properties.map((property) => (
          <li key={property.id} className="bg-white p-4 shadow rounded">
            {editingProperty === property.id ? (
              <PropertyForm
                property={property}
                onSave={handleSaveProperty}
                onCancel={() => setEditingProperty(null)}
              />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{property.address}</h3>
                  <div>
                    <button onClick={() => handleEditProperty(property.id)} className="text-blue-500 mr-2">Edit</button>
                    <button onClick={() => handleDeleteProperty(property.id)} className="text-red-500 mr-2">Delete</button>
                    <span className="cursor-pointer" onClick={() => toggleExpand(property.id)}>
                      {expandedProperty === property.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
                {expandedProperty === property.id && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Units</h4>
                    <ul className="space-y-2">
                      {property.units.map((unit) => (
                        <li key={unit.id} className="border p-2 rounded">
                          <p>Renter: {unit.renter}</p>
                          <p>Contact: {unit.contact}</p>
                          <p>Rent: €{unit.rent}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
        </ul>
      ) : (
        <p>You have not added any properties yet.</p>
      )}
    </>
  ) : (
    <p>Please sign in to view your properties.</p>
  )}
</div>
);
};
export default PropertyList;