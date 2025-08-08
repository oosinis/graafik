"use client"

import { useState } from "react"
import { Pencil, Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

export function RuleDetailsStep(){
    const [activeRule, setActiveRule] = useState<string>("Tööpäevadel")
    
    const rules = [
        { id: "1", name: "Tööpäevadel", active: true },
        { id: "2", name: "Reedeti", active: false },
        { id: "3", name: "Puhkepäevadel", active: false },
      ]
    return(
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Rules</h3>
                <div className="flex space-x-2 mb-4">
                  {rules.map((rule) => (
                    <Button
                      key={rule.id}
                      variant={rule.active ? "default" : "outline"}
                      className={rule.active ? "bg-purple-600 hover:bg-purple-700" : ""}
                      onClick={() => setActiveRule(rule.name)}
                    >
                      {rule.name} <Pencil className="ml-2 h-4 w-4" />
                    </Button>
                  ))}
                  <Button variant="outline">
                    Add Rule <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <Card className="p-6 bg-gray-50">
                  <div className="flex justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rule Title</label>
                      <Input value={activeRule} onChange={(e) => setActiveRule(e.target.value)} className="max-w-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Low
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                          Medium
                        </Button>
                        <Button variant="outline" size="sm">
                          High
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Days Applied</label>
                    <div className="flex space-x-2">
                      <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                        Mo
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                        Tu
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                        We
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                        Th
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                        Fr
                      </Button>
                      <Button variant="outline" size="sm">
                        Sa
                      </Button>
                      <Button variant="outline" size="sm">
                        Su
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Shifts Per Day</label>
                      <Input type="number" value="3" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Off-Days After</label>
                      <Input type="number" value="2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Continuous Days</label>
                      <Input type="number" value="3" />
                    </div>
                  </div>
                </Card>
              </div>
        </Card>
    )
}