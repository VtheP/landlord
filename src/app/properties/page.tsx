import PropertyList from '@/components/PropertyList';

export default function PropertiesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Property Management</h1>
      <PropertyList />
    </div>
  );
}