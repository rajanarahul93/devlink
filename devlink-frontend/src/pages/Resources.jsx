import { useState } from "react";
import { useResources } from "../hooks/useResources";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import ResourceFilters from "../components/resources/ResourceFilters";
import ResourceCard from "../components/resources/ResourceCard";
import ResourceForm from "../components/resources/ResourceForm";
import { resourceAPI } from "../services/api";

export default function Resources() {
  const {
    resources,
    loading,
    pagination,
    createResource,
    updateResource,
    deleteResource,
    searchResources,
    changePage,
  } = useResources();

  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleAddResource = () => {
    setEditingResource(null);
    setShowForm(true);
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingResource(null);
  };

  const handleSubmitForm = async (formData) => {
    setFormLoading(true);

    let result;
    if (editingResource) {
      result = await updateResource(editingResource.id, formData);
    } else {
      result = await createResource(formData);
    }

    setFormLoading(false);
    return result;
  };

  const handleVisitResource = async (resourceId) => {
    try {
      await resourceAPI.clickResource(resourceId);
    } catch (error) {
      console.error("Failed to track click:", error);
    }
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= pagination.pages; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === pagination.page ? "default" : "outline"}
          size="sm"
          onClick={() => changePage(i)}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => changePage(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </Button>
        {pages}
        <Button
          variant="outline"
          size="sm"
          onClick={() => changePage(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Resources</h1>
          <p className="text-muted-foreground">
            {pagination.total} resource{pagination.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button onClick={handleAddResource}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <ResourceFilters onFilter={searchResources} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse rounded-lg h-48"
            />
          ))}
        </div>
      ) : Array.isArray(resources) && resources.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onEdit={handleEditResource}
                onDelete={deleteResource}
                onVisit={handleVisitResource}
              />
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No resources found
          </h3>
          <p className="text-gray-600 mb-4">
            Start building your developer resource collection
          </p>
          <Button onClick={handleAddResource}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Resource
          </Button>
        </div>
      )}

      <ResourceForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        initialData={editingResource}
        loading={formLoading}
      />
    </div>
  );
}