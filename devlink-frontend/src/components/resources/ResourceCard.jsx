import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  Lock,
} from "lucide-react";

export default function ResourceCard({ resource, onEdit, onDelete, onVisit }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setLoading(true);
      await onDelete(resource.id);
      setLoading(false);
    }
  };

  const handleVisit = () => {
    onVisit(resource.id);
    window.open(resource.url, "_blank");
  };

  const formatTags = (tags) => {
    if (!tags) return [];
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-6 truncate">
              {resource.title}
            </CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {resource.category || "Uncategorized"}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">
                  {resource.click_count} clicks
                </span>
                <div className="flex items-center">
                  {resource.is_public ? (
                    <Eye className="h-3 w-3 text-green-500 ml-2" />
                  ) : (
                    <Lock className="h-3 w-3 text-gray-400 ml-2" />
                  )}
                </div>
              </div>
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleVisit}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Resource
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(resource)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {resource.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {resource.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mb-3">
          {formatTags(resource.tags).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Added {formatDate(resource.created_at)}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVisit}
            className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}