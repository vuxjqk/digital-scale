import DataPagination from "@/components/data-pagination";
import DialogDelete from "@/components/dialog-delete";
import DataTable from "@/components/users/data-table";
import DialogCreate from "@/components/users/dialog-create";
import DialogUpdate from "@/components/users/dialog-update";
import FilterBar from "@/components/users/filter-bar";

import UsersProvider from "@/contexts/users-context";
import { prisma } from "@/lib/prisma";
import { parseBoolean, parseEnum, parseString } from "@/lib/utils";
import { PageProps } from "@/types";

import { Prisma, Role } from "../generated/prisma/client";

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.max(Number(params.limit) || 10, 1);
  const search = parseString(params.search);
  const role = parseEnum(params.role, {
    MANAGER: "MANAGER",
    EMPLOYEE: "EMPLOYEE",
  } as const);
  const isActive = parseBoolean(params.isActive);

  const where: Prisma.UserWhereInput = {
    role: {
      not: Role.ADMIN,
    },
  };

  if (search !== undefined) {
    where.OR = [
      { fullName: { contains: search } },
      { username: { contains: search } },
    ];
  }

  if (role !== undefined) {
    where.role = role;
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [users, totalItems] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 1;

  return (
    <UsersProvider>
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold leading-none text-gray-800 dark:text-gray-200">
              Danh sách người dùng
            </h1>

            <DialogCreate />
          </div>

          <FilterBar
            searchParams={params}
            search={search}
            role={role}
            isActive={isActive}
          />

          <DataTable data={users} />

          <DataPagination
            searchParams={params}
            currentPage={page}
            totalPages={totalPages}
          />

          <DialogUpdate />
          <DialogDelete />
        </div>
      </div>
    </UsersProvider>
  );
}
