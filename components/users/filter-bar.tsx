"use client";

import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/debounce";
import { useUpdateQuery } from "@/hooks/update-query";
import { SearchParams } from "@/types";

import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function FilterBar({
  searchParams,
  search,
  role,
  isActive,
}: {
  searchParams: SearchParams;
  search: string | undefined;
  role: "MANAGER" | "EMPLOYEE" | undefined;
  isActive: boolean | undefined;
}) {
  const [searchTerm, setSearchTerm] = useState(search ?? "");
  const debouncedSearch = useDebounce(searchTerm);
  const updateQuery = useUpdateQuery(searchParams);

  useEffect(() => {
    if (debouncedSearch !== (search ?? "")) {
      updateQuery({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, search, updateQuery]);

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <Input
        type="search"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Select
        value={role ?? ""}
        onValueChange={(val) =>
          updateQuery({ role: val === "none" ? "" : val, page: 1 })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Vai trò" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="none">Vai trò</SelectItem>
            <SelectItem value="MANAGER">MANAGER</SelectItem>
            <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={isActive === true ? "true" : isActive === false ? "false" : ""}
        onValueChange={(val) =>
          updateQuery({ isActive: val === "none" ? "" : val, page: 1 })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="none">Trạng thái</SelectItem>
            <SelectItem value="true">Đang hoạt động</SelectItem>
            <SelectItem value="false">Không hoạt động</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
