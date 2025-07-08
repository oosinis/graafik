"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const suggestions = [
  "Vahetusevanem",
  "Ettekandjad",
  "Kokad",
  "Hooldustöötaja",
] as const;

export default function Step4() {
  const router = useRouter();

  const [available, setAvailable] = useState<string[]>([...suggestions]);
  const [selected, setSelected] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");

  const addRole = (role: string) => {
    if (!selected.includes(role)) setSelected([...selected, role]);
    setAvailable(avail => avail.filter(r => r !== role));
  };

  const removeRole = (role: string) => {
    setSelected(sel => sel.filter(r => r !== role));
    setAvailable(avail => [...avail, role]);
  };

  const handleCustomAdd = () => {
    const r = newRole.trim();
    if (r && !selected.includes(r)) {
      setSelected([...selected, r]);
      setNewRole("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: persist templates...
    router.replace("/dashboard");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl">
        {/* 75% progress bar */}
        <div className="h-1 w-3/4 bg-purple-600 mb-4 rounded" />

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-2">
              <h2 className="text-3xl font-bold">Role Templates</h2>
              <p className="text-gray-600">
                Define your team’s roles for automatic assignment
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Suggested */}
              <div>
                <h3 className="text-sm font-medium mb-1">Suggested</h3>
                <div className="flex flex-wrap gap-2">
                  {available.map(role => (
                    <Button
                      key={role}
                      size="sm"
                      variant="outline"
                      onClick={() => addRole(role)}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selected */}
              <div>
                <h3 className="text-sm font-medium mb-1">Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.map(role => (
                    <span
                      key={role}
                      className="inline-flex items-center space-x-1 bg-purple-600 text-white rounded px-2 py-1 text-sm"
                    >
                      <span>{role}</span>
                      <X
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => removeRole(role)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              {/* Add custom */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add another…"
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  onKeyDown={e =>
                    e.key === "Enter" && (e.preventDefault(), handleCustomAdd())
                  }
                />
                <Button size="sm" onClick={handleCustomAdd}>
                  Add
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Complete Setup
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
