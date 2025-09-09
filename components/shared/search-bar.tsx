"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";

export default function SearchBar({
  placeholder,
  query,
}: {
  placeholder: string;
  query: string | string[] | undefined;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (query && typeof query === "string") {
      setSearchTerm(query);
    } else {
      setSearchTerm("");
    }
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    router.push(pathname + "?" + createQueryString("q", e.target.value));
  };

  return (
    <div className=" w-full relative">
      <Search className="absolute w-4 h-4 top-1/2 left-2 -translate-y-1/2 text-blue-600" />
      <Input
        className="focus-visible:ring-0 pl-8"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
}
