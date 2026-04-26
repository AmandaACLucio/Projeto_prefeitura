"use client";

import { useQuery } from "@tanstack/react-query";
import { getChildren } from "@/services/children.service";
import Link from "next/link";

export default function ChildrenView() {
  const { data: children = [], isLoading } = useQuery({
    queryKey: ["children"],
    queryFn: getChildren,
  });

  if (isLoading) {
    return (
      <div className="p-6 text-gray-400">
        Carregando lista...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Crianças</h1>

      <div className="space-y-3">
        {children.map((c) => (
          <Link key={c.id} href={`/children/${c.id}`}>
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
              <p className="font-semibold text-gray-800">
                {c.nome}
              </p>

              <p className="text-sm text-gray-500">
                {c.bairro}
              </p>

              {c.alertas?.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {c.alertas.map((a: any, i: number) => (
                    <span
                      key={i}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                    >
                      {a.tipo}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}