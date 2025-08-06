import { useState, useEffect } from "react";
import { resourceAPI } from "../services/api";

export function useResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    tags: "",
    is_public: null,
  });

  const fetchResources = async (newFilters = filters, newPage = 1) => {
    setLoading(true);
    try {
      const params = {
        ...newFilters,
        page: newPage,
        limit: pagination.limit,
      };

      const response = await resourceAPI.getResources(params);
      const { resources, total, page, pages, limit } = response.data;

      setResources(resources);
      setPagination({ page, limit, total, pages });
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const createResource = async (resourceData) => {
    try {
      const response = await resourceAPI.createResource(resourceData);
      await fetchResources(); // Refresh list
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to create resource",
      };
    }
  };

  const updateResource = async (id, resourceData) => {
    try {
      const response = await resourceAPI.updateResource(id, resourceData);
      await fetchResources(); // Refresh list
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to update resource",
      };
    }
  };

  const deleteResource = async (id) => {
    try {
      await resourceAPI.deleteResource(id);
      await fetchResources(); // Refresh list
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to delete resource",
      };
    }
  };

  const searchResources = (searchFilters) => {
    setFilters(searchFilters);
    fetchResources(searchFilters, 1);
  };

  const changePage = (newPage) => {
    fetchResources(filters, newPage);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return {
    resources,
    loading,
    pagination,
    filters,
    createResource,
    updateResource,
    deleteResource,
    searchResources,
    changePage,
    refreshResources: () => fetchResources(),
  };
}