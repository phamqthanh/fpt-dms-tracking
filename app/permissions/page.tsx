"use client";
import permissionMatrix from "@/src/constants/permission-matrix.json";
import { ChangeEventHandler, useEffect, useMemo, useReducer, useState } from "react";

export default function UsersPage() {
  const [checkedSet] = useState(() => new Set<string>());
  const [flag, rerender] = useReducer((x) => x + 1, 0);
  const permissions = useMemo(() => {
    const permissions = new Set(
      Object.values(permissionMatrix).flatMap((perm) => Object.keys(perm))
    );
    return Array.from(permissions);
  }, []);
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value, checked } = e.target;
    if (checked) checkedSet.add(value);
    else checkedSet.delete(value);
    rerender();
  };
  useEffect(() => {
    localStorage.setItem("permissions", JSON.stringify(Array.from(checkedSet)));
  }, [checkedSet, flag]);
  return (
    <main className="container mx-auto">
      <div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-3 py-3.5 pl-0">Permission</th>
              <th className="px-3 py-3.5 pr-0">Action</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr key={permission}>
                <td className="border-t border-slate-300 px-3 py-3.5 pl-0">
                  <p className="font-medium">{permission || "N/A"}</p>
                </td>
                <td className="border-t border-slate-300 px-3 py-3.5 pr-0">
                  <input
                    type="checkbox"
                    checked={checkedSet.has(permission)}
                    value={permission}
                    onChange={onChange}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
