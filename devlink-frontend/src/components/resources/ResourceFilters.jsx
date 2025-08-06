import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, Filter, X } from "lucide-react";

const categories = [
  "All Categories",
  "Documentation",
  "Tutorial",
  "Tool",
  "Library",
  "Framework",
  "Blog",
  "Video",
  "Course",
  "Repository",
  "Article",
  "Reference",
  "Other",
];

export default function ResourceFilters({ onFilter, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    category: initialFilters.category || "",
    tags: initialFilters.tags || "",
    is_public: initialFilters.is_public || null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value === "All Categories" ? "" : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      category: "",
      tags: "",
      is_public: null,
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.tags ||
    filters.is_public !== null;

  return (
    <div className="bg p-4 rounded-lg border mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                name="search"
                value={filters.search}
                onChange={handleInputChange}
                placeholder="Search resources..."
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Select
              value={filters.category || "All Categories"}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              name="tags"
              value={filters.tags}
              onChange={handleInputChange}
              placeholder="Filter by tags..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select
              value={
                filters.is_public === null
                  ? "all"
                  : filters.is_public
                  ? "public"
                  : "private"
              }
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  is_public: value === "all" ? null : value === "public",
                }))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            {hasActiveFilters && (
              <Button type="button" variant="outline" onClick={handleReset}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
            <Button type="submit">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}