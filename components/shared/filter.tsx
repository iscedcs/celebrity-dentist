"use client";

import { Roles } from "@/lib/const";
import { Funnel } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function Filter({
  placeholder,
  role,
}: {
  placeholder: string;
  role: string | string[] | undefined;
}) {
  const [selected, setSelected] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value?: string) => {
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
    if (role && typeof role === "string") {
      setSelected(role);
    } else {
      setSelected("");
    }
  }, [role]);

  const handleChange = (value: string) => {
    if (value === "none") {
      setSelected("");
      router.push(pathname + "?" + createQueryString("role", undefined));
    } else {
      setSelected(value);
      router.push(pathname + "?" + createQueryString("role", value));
    }
  };

  return (
    <div>
      <Select value={selected} onValueChange={handleChange}>
        <SelectTrigger>
          <Funnel />
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Selection</SelectItem>
          {Roles.map((role, k) => (
            <SelectItem key={k} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
