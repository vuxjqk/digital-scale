"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function EmployeeCombobox({
  employees,
}: {
  employees: { id: number; fullName: string; username: string }[];
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedId) ?? null,
    [employees, selectedId],
  );

  const filteredEmployees = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) return employees.slice(0, 8);

    return employees.filter((employee) => {
      return (
        employee.fullName.toLowerCase().includes(keyword) ||
        employee.username.toLowerCase().includes(keyword)
      );
    });
  }, [employees, query]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSelect = (employee: {
    id: number;
    fullName: string;
    username: string;
  }) => {
    setSelectedId(employee.id);
    setQuery(employee.fullName);
    setIsOpen(false);
  };

  const inputValue = selectedEmployee ? selectedEmployee.fullName : query;

  return (
    <div
      ref={wrapperRef}
      className="relative text-sm text-slate-300 lg:col-span-2"
    >
      <label className="block">
        Nhân viên
        <div className="relative mt-2">
          <input
            value={inputValue}
            onChange={(event) => {
              setSelectedId(null);
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Chọn hoặc tìm nhân viên (không bắt buộc)"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 outline-none focus:border-cyan-400"
          />
          {isOpen && filteredEmployees.length > 0 ? (
            <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-1 shadow-lg">
              {filteredEmployees.map((employee) => (
                <button
                  key={employee.id}
                  type="button"
                  onClick={() => handleSelect(employee)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                >
                  <span>{employee.fullName}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {employee.username}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </label>

      <input
        type="hidden"
        name="employeeName"
        value={selectedEmployee?.fullName ?? query.trim()}
      />
      <input
        type="hidden"
        name="employeeCode"
        value={selectedEmployee?.username ?? ""}
      />

      <p className="mt-2 text-xs text-slate-400">
        {selectedEmployee
          ? `Đã chọn: ${selectedEmployee.fullName} (${selectedEmployee.username})`
          : "Có thể để trống nếu không gắn với nhân viên nào."}
      </p>
    </div>
  );
}
