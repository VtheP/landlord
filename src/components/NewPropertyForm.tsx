import React, { useState } from 'react';

export type NewPropertyFormProps = {
  onSave: (property: { address: string }) => Promise<void>;
  onCancel: () => void;
};

const NewPropertyForm: React.FC<NewPropertyFormProps> = ({ onSave, onCancel }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ address });
    setAddress('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
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
          Add Property
        </button>
      </div>
    </form>
  );
};

export default NewPropertyForm;