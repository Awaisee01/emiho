"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Crown, Heart, Menu, X, Search } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // ✅ Search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    stories: [],
    events: [],
    communities: [],
  });
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // ✅ Prefetch routes
  useEffect(() => {
    const routesToPrefetch = [
      "/",
      "/stories",
      "/community",
      "/events",
      "/pricing",
      "/profile",
      "/auth/signin",
      "/auth/signup",
    ];
    routesToPrefetch.forEach((r) => router.prefetch(r));
  }, [router]);

  // ✅ Navigation
  const navigation = [
    { name: "Stories", href: "/stories" },
    { name: "Community", href: "/community" },
    { name: "Events", href: "/events" },
    {
      name: "Marketplace",
      href: "https://emiho-marketplace.vercel.app/",
      target: "_blank",
      rel: "noopener noreferrer",
    },
  ];

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Fetch search results from API
  useEffect(() => {
    if (!query.trim()) {
      setResults({ stories: [], events: [], communities: [] });
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleResultClick = useCallback((path: string) => {
    router.push(path);
    setQuery("");
    setShowDropdown(false);
    setIsMenuOpen(false);
  }, [router]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleSearchFocus = useCallback(() => {
    if (query.trim() && (results.stories.length > 0 || results.events.length > 0 || results.communities.length > 0)) {
      setShowDropdown(true);
    }
  }, [query, results]);

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Heart className="h-8 w-8 text-blue-600 fill-current group-hover:scale-110 transition-transform" />
              <Crown className="h-4 w-4 text-blue-400 absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
              Emiho
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.target}
                  rel={item.rel}
                  prefetch
                  onMouseEnter={() => router.prefetch(item.href)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 underline underline-offset-4"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Search + User Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div ref={searchRef} className="relative w-64 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className="pl-9 pr-3 py-1.5 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {showDropdown && query.trim() && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white border rounded-lg shadow-lg z-50 p-3 max-h-80 overflow-y-auto">
                  {loading ? (
                    <p className="text-sm text-gray-500">Searching...</p>
                  ) : (
                    <>
                      {results.stories.length === 0 &&
                      results.events.length === 0 &&
                      results.communities.length === 0 ? (
                        <p className="text-sm text-gray-500">No results found</p>
                      ) : (
                        <>
                          {results.stories.length > 0 && (
                            <div className="mb-3">
                              <h4 className="font-semibold text-gray-700 mb-1 text-xs">
                                Stories
                              </h4>
                              {results.stories.map((s: any) => (
                                <button
                                  key={s._id}
                                  onClick={() => handleResultClick(`/stories/${s._id}`)}
                                  className="block text-left w-full text-sm hover:bg-gray-100 p-2 rounded"
                                >
                                  {s.title}
                                </button>
                              ))}
                            </div>
                          )}

                          {results.events.length > 0 && (
                            <div className="mb-3">
                              <h4 className="font-semibold text-gray-700 mb-1 text-xs">
                                Events
                              </h4>
                              {results.events.map((e: any) => (
                                <button
                                  key={e._id}
                                  onClick={() => handleResultClick(`/events/${e._id}`)}
                                  className="block text-left w-full text-sm hover:bg-gray-100 p-2 rounded"
                                >
                                  {e.title}
                                </button>
                              ))}
                            </div>
                          )}

                          {results.communities.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-1 text-xs">
                                Communities
                              </h4>
                              {results.communities.map((c: any) => (
                                <button
                                  key={c._id}
                                  onClick={() => handleResultClick(`/community/${c._id}`)}
                                  className="block text-left w-full text-sm hover:bg-gray-100 p-2 rounded"
                                >
                                  {c.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* User Menu */}
            {status === "loading" ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || ""}
                      />
                      <AvatarFallback>
                        {session.user.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link
                      prefetch
                      href="/profile"
                      onMouseEnter={() => router.prefetch("/profile")}
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      prefetch
                      href="/pricing"
                      onMouseEnter={() => router.prefetch("/pricing")}
                    >
                      Upgrade
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await signOut({ callbackUrl: "/" });
                      } finally {
                        router.refresh();
                      }
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  prefetch
                  href="/auth/signin"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  prefetch
                  href="/auth/signup"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {/* Mobile Search */}
            <div className="px-2 pt-2 pb-3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  className="pl-9 pr-3 py-1.5 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {showDropdown && query.trim() && (
                  <div className="absolute top-full mt-2 left-0 w-full bg-white border rounded-lg shadow-lg z-50 p-3 max-h-80 overflow-y-auto">
                    {loading ? (
                      <p className="text-sm text-gray-500">Searching...</p>
                    ) : (
                      <>
                        {results.stories.length === 0 &&
                        results.events.length === 0 &&
                        results.communities.length === 0 ? (
                          <p className="text-sm text-gray-500">No results found</p>
                        ) : (
                          <>
                            {results.stories.length > 0 && (
                              <div className="mb-3">
                                <h4 className="font-semibold text-gray-700 mb-1 text-xs">
                                  Stories
                                </h4>
                                {results.stories.map((s: any) => (
                                  <button
                                    key={s._id}
                                    onClick={() => handleResultClick(`/stories/${s._id}`)}
                                    className="block text-left w-full text-sm hover:bg-gray-100 p-2 rounded"
                                  >
                                    {s.title}
                                  </button>
                                ))}
                              </div>
                            )}

                            {results.events.length > 0 && (
                              <div className="mb-3">
                                <h4 className="font-semibold text-gray-700 mb-1 text-xs">
                                  Events
                                </h4>
                                {results.events.map((e: any) => (
                                  <button
                                    key={e._id}
                                    onClick={() => handleResultClick(`/events/${e._id}`)}
                                    className="block text-left w-full text-sm hover:bg-gray-100 p-2 rounded"
                                  >
                                    {e.title}
                                  </button>
                                ))}
                              </div>
                            )}

                            {results.communities.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-1 text-xs">
                                  Communities
                                </h4>
                                {results.communities.map((c: any) => (
                                  <button
                                    key={c._id}
                                    onClick={() => handleResultClick(`/community/${c._id}`)}
                                    className="block text-left w-full text-sm hover:bg-gray-100 p-2 rounded"
                                  >
                                    {c.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    target={item.target}
                    rel={item.rel}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 text-base font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 underline underline-offset-4"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}