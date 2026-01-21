import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
import { Share2 } from "lucide-react";
import "./App.css";
import { CreateBlogDialog } from "@/components/CreateBlogDialog";

//  Types
interface BlogPost {
  id: number;
  title: string;
  category: string[];
  description: string;
  date: string;
  coverImage: string;
  content: string;
  readTime?: string;
}

//  API Fetch Function
const fetchBlogs = async (): Promise<BlogPost[]> => {
  // This URL must match your json-server port
  const response = await axios.get("http://localhost:3001/blogs");
  return response.data;
};

function App() {
  // I. TanStack Query Hook
  const {
    data: blogs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  // II. State for selected blog
  // Initially, initialize as null because we don't have data yet
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // format Date
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // III. Loading State
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 w-96">
          <h2 className="text-xl font-bold text-center">
            Loading Blog Data...
          </h2>
          <Skeleton className="h-4 w-full  bg-indigo-600" />
        </div>
      </div>
    );
  }

  // IV. Error State
  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error.message}. Is the JSON Server running?
      </div>
    );
  }

  // V. Determine which blog to show (Focused on 'Selected' OR 'the first one' by default)
  const safeBlogs = blogs || [];
  const activeBlog = selectedId
    ? safeBlogs.find((b) => b.id === selectedId) // If blogs is undefined, default to empty array to prevent crash
    : safeBlogs[0];

  if (!activeBlog) return <div>No blogs found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            CA
          </div>
          <span className="font-bold text-xl tracking-tight">CA MONK</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
          {["Tools", "Practice", "Events", "Job Board", "Points"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="hover:text-indigo-600 transition-colors"
              >
                {item}
              </a>
            ),
          )}
        </div>
        <div className="flex items-center gap-4">
          <CreateBlogDialog />
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6">
            Profile
          </Button>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center py-12 bg-white border-b mb-8">
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight text-gray-900">
          CA Monk Blog
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Stay updated with the latest trends in finance, accounting, and career
          growth
        </p>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h2 className="font-bold text-lg text-gray-900 mb-2">
              Latest Articles
            </h2>

            {safeBlogs.map((blog) => (
              <Card
                key={blog.id}
                onClick={() => setSelectedId(blog.id)}
                className={`cursor-pointer border transition-all duration-200 hover:shadow-md group relative overflow-hidden ${
                  activeBlog.id === blog.id
                    ? "border-l-4 border-l-indigo-600 bg-white ring-1 ring-indigo-50 shadow-sm"
                    : "border-l-4 border-l-transparent border-gray-100 hover:border-gray-200"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-sm">
                        {blog.category[0]}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {formatDate(blog.date)}
                    </span>
                  </div>

                  <h3
                    className={`font-bold text-base mb-2 leading-snug group-hover:text-indigo-600 transition-colors ${
                      activeBlog.id === blog.id
                        ? "text-indigo-900"
                        : "text-gray-800"
                    }`}
                  >
                    {blog.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {blog.description}
                  </p>

                  {blog.category.length > 1 && (
                    <div className="mt-3">
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-5 font-normal text-gray-500 bg-gray-100 hover:bg-gray-200"
                      >
                        {blog.category[1]}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-8">
            <div className="sticky top-24">
              <div className="w-full h-64 md:h-[400px] rounded-xl overflow-hidden mb-8 shadow-sm">
                <img
                  src={activeBlog.coverImage}
                  alt={activeBlog.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-indigo-600 font-bold uppercase text-xs tracking-wider">
                    {activeBlog.category.join(" & ")}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-gray-500 text-xs font-medium">
                    {activeBlog.readTime || "5 Min"} read
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                  {activeBlog.title}
                </h1>

                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-6 rounded-full shadow-lg shadow-indigo-200">
                  <Share2 className="w-4 h-4" /> Share Article
                </Button>
              </div>

              <div className="grid grid-cols-3 bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100">
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
                    Category
                  </p>
                  <p className="font-bold text-sm text-gray-800">
                    {activeBlog.category[0]}
                  </p>
                </div>
                <div className="text-center border-l border-gray-200">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
                    Read Time
                  </p>
                  <p className="font-bold text-sm text-gray-800">
                    {activeBlog.readTime || "5 Min"}
                  </p>
                </div>
                <div className="text-center border-l border-gray-200">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
                    Date
                  </p>
                  <p className="font-bold text-sm text-gray-800">
                    {formatDate(activeBlog.date)}
                  </p>
                </div>
              </div>

              <article
                className="prose prose-lg prose-indigo max-w-none text-gray-600 leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: activeBlog.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
