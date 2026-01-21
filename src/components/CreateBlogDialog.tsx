import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2 } from "lucide-react";

// Types
interface NewBlogData {
  title: string;
  category: string[];
  description: string;
  date: string;
  coverImage: string;
  content: string;
  readTime: string;
}

// API Function
const createBlog = async (newBlog: NewBlogData) => {
  const response = await axios.post("http://localhost:3001/blogs", newBlog);
  return response.data;
};

export function CreateBlogDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    category: "", // We'll split this string into an array later
    description: "",
    coverImage: "",
    readTime: "",
    content: "",
  });

  // TanStack Mutation
  const mutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["blogs"] });

      setOpen(false); // THIS LINE CLOSES THE MODAL

      setFormData({
        // Reset form
        title: "",
        category: "",
        description: "",
        coverImage: "",
        readTime: "",
        content: "",
      });
    },
    // It helps to handle errors during create a blog
    onError: (error) => {
      console.error("Failed to create blog:", error);
      alert("Failed to create blog. Check console for details.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the object
    const newBlogPayload: NewBlogData = {
      title: formData.title,
      // Split comma-separated string into array
      // (Like- "Tech, Finance" -> ["Tech", "Finance"])
      category: formData.category
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c !== ""),
      description: formData.description,

      // Auto-generate ISO Date
      date: new Date().toISOString(),
      coverImage:
        formData.coverImage ||
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d", // Default fallback
      readTime: formData.readTime || "5 Mins",
      content: formData.content,
    };

    mutation.mutate(newBlogPayload);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
          <PlusCircle className="w-4 h-4" /> New Blog
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog</DialogTitle>
          <DialogDescription>
            Fill in the details below to post a new article.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. The Future of AI"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Categories (comma separated)</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Tech, Finance"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="readTime">Read Time</Label>
              <Input
                id="readTime"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="5 Mins"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Summary of the post..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Full Content (HTML allowed)</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="h-32"
              required
              placeholder="<p>Write your article content here...</p>"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {mutation.isPending ? "Creating..." : "Create Blog"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
