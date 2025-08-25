"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ShiftDetailsCard } from "@/components/shift-details-card";
import { MonthNavigation } from "@/components/month-navigation";
import { DayNavigation } from "@/components/day-navigation";
import { ViewModeToggle } from "@/components/view-mode-toggle";
import type { ScheduleResponse } from "@/models/ScheduleResponse";
import type { WorkerDto } from "@/models/WorkerDto";
import type { ShiftAssignment } from "@/models/ShiftAssignment";
import type { DaySchedule } from "@/models/DaySchedule";
import React from "react";

interface ScheduleGridViewProps {
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
}

// Mutable month names array
const monthNames: string[] = [
  "Jaanuar","Veebruar","Märts","Aprill",
  "Mai","Juuni","Juuli","August",
  "September","Oktoober","November","Detsember"
];

const shiftTypes = ["Hommik","Päev","Õhtu","Öö"] as const;
type ShiftType = typeof shiftTypes[number];

const shiftAbbrev: Record<ShiftType,string> = {
  Hommik:"H", Päev:"P", Õhtu:"Õ", Öö:"Ö"
};

const shiftColors: Record<ShiftType,string> = {
  Hommik:"bg-orange-200",
  Päev:"bg-teal-200",
  Õhtu:"bg-pink-200",
  Öö:"bg-purple-200"
};

const groupedRoles: Record<string,string[]> = {
  Vahetusevanem:["Sander Saar","Mirjam Laane"],
  Ettekandjad:["Gregor Ojamets","Jürgen Kask"],
  Kokad:["Andres Allik","Liis Lepp"]
};

export function ScheduleGridView({
  year, month, onMonthChange
}: ScheduleGridViewProps) {
  // modes & data
  const [viewMode, setViewMode] = useState<"monthly"|"weekly"|"daily">("monthly");
  const [schedule, setSchedule] = useState<ScheduleResponse|null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<number>(1);
  const [currentDate, setCurrentDate] = useState<Date>(
    () => new Date(year, month-1, 1)
  );
  const [selectedShift, setSelectedShift] = useState<{
    day:number;worker:string;shift:ShiftType;fte:string
  }|null>(null);

  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [selectedShiftType, setSelectedShiftType] = useState<ShiftType|"All">("All");

  // regenerate mock when year/month changes
  useEffect(() => {
    setSchedule(generateMockSchedule(year,month));
    setCurrentWeekStart(1);
    setSelectedShift(null);
    setCurrentDate(new Date(year,month-1,1));
  }, [year,month]);

  function generateMockSchedule(y:number,m:number):ScheduleResponse {
    const days = new Date(y,m,0).getDate();
    const workers:WorkerDto[] = Object.values(groupedRoles).flat().map(n=>({name:n}));
    const workerHours:Record<string,number> = {};
    workers.forEach(w=>workerHours[w.name]=140+Math.floor(Math.random()*40));
    const daySchedules:DaySchedule[] = Array.from({length:days},(_,i)=>{
      const assignments:ShiftAssignment[] = shiftTypes.map((type,idx)=>({
        shift:{
          id:`${y}-${m}-${i+1}-${type}`,
          type,
          start: type==="Hommik"?"08:00":type==="Päev"?"10:00":type==="Õhtu"?"14:00":"22:00",
          end:   type==="Hommik"?"16:00":type==="Päev"?"18:00":type==="Õhtu"?"22:00":"06:00",
          length:8,
          roles:[],
        },
        worker:workers[(i+idx)%workers.length]
      }));
      return {dayOfMonth:i+1,assignments,score:0};
    });
    return {year:y,month:m,daySchedules,workerHours,score:0};
  }

  const daysInMonth = new Date(year,month,0).getDate();

  // visible days based on mode
  const visibleDays = useMemo<number[]>(()=>{
    if(viewMode==="daily"){
      return [currentDate.getDate()];
    }
    if(viewMode==="weekly"){
      const end = Math.min(currentWeekStart+6,daysInMonth);
      return Array.from({length:end-currentWeekStart+1},(_,i)=>currentWeekStart+i);
    }
    return Array.from({length:daysInMonth},(_,i)=>i+1);
  },[viewMode,currentWeekStart,daysInMonth,currentDate]);

  // helper: find shift
  function shiftFor(worker:string,day:number):ShiftType|null {
    const rec = schedule
      ?.daySchedules
      .find(d=>d.dayOfMonth===day)
      ?.assignments
      .find(a=>a.worker.name===worker)
      ?.shift.type;
    return rec && shiftTypes.includes(rec as ShiftType) ? rec as ShiftType : null;
  }

  // week navigation
  const prevWeek=()=>setCurrentWeekStart(s=>Math.max(1,s-7));
  const nextWeek=()=>setCurrentWeekStart(s=>s+7<=daysInMonth?s+7:s);

  // filter roles & workers by selections
  const filteredRoles = Object.entries(groupedRoles).reduce((acc,[role,workers])=>{
    if(selectedRole!=="All"&&selectedRole!==role) return acc;
    const keep = workers.filter(w=>
      visibleDays.some(d=>{
        const s=shiftFor(w,d);
        return !!s&&(selectedShiftType==="All"||s===selectedShiftType);
      })
    );
    if(keep.length) acc[role]=keep;
    return acc;
  },{} as Record<string,string[]>);

  return (
    <div className="w-full space-y-4">
      {/* top bar */}
      <div className="flex justify-between items-center">
        <MonthNavigation
          month={month} year={year} monthNames={monthNames}
          onPrevious={()=>onMonthChange(month===1?year-1:year,month===1?12:month-1)}
          onNext={()=>onMonthChange(month===12?year+1:year,month===12?1:month+1)}
        />
        <div className="flex items-center space-x-6">
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode}/>
          <select
            value={selectedRole}
            onChange={e=>setSelectedRole(e.target.value)}
            className="border p-2 rounded shadow-sm"
          >
            <option value="All">All Roles</option>
            {Object.keys(groupedRoles).map(r=>(
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={selectedShiftType}
            onChange={e=>setSelectedShiftType(e.target.value as ShiftType|"All")}
            className="border p-2 rounded shadow-sm"
          >
            <option value="All">All Shifts</option>
            {shiftTypes.map(s=>(
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* weekly controls */}
      {viewMode==="weekly" && (
        <div className="flex justify-end gap-2">
          <Button onClick={prevWeek} disabled={currentWeekStart===1}>
            Eelmine nädal
          </Button>
          <span className="font-medium">
            {visibleDays[0]}–{visibleDays[visibleDays.length-1]}
          </span>
          <Button onClick={nextWeek} disabled={currentWeekStart+6>=daysInMonth}>
            Järgmine nädal
          </Button>
        </div>
      )}

      {/* daily navigation */}
      {viewMode==="daily" && (
        <DayNavigation
          date={currentDate}
          onPrevious={()=>setCurrentDate(d=>{d.setDate(d.getDate()-1); return new Date(d);} )}
          onNext={()=>setCurrentDate(d=>{d.setDate(d.getDate()+1); return new Date(d);} )}
        />
      )}

      {/* grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-gray-50 border p-2 w-40">Töötaja</th>
              {visibleDays.map(d=>(
                <th key={d} className="border p-2 text-center">{d}</th>
              ))}
              <th className="border p-2 w-24 text-center">Tunnid</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredRoles).map(([role,workers])=>(
              <React.Fragment key={role}>
                <tr>
                  <td
                    colSpan={visibleDays.length+2}
                    className="bg-purple-100 font-semibold text-left p-2"
                  >{role}</td>
                </tr>
                {workers.map(worker=>(
                  <tr key={worker}>
                    <td className="sticky left-0 bg-white border p-2 font-medium">
                      {worker}
                    </td>
                    {visibleDays.map(day=>{
                      const sft = shiftFor(worker,day);
                      const show = !!sft&&(selectedShiftType==="All"||sft===selectedShiftType);
                      return (
                        <td
                          key={day}
                          className={`border p-1 text-center ${show?shiftColors[sft!]:""}`}
                          onClick={()=>sft&&setSelectedShift({day,worker,shift:sft,fte:"1.0"})}
                        >
                          {show?shiftAbbrev[sft!]:""}
                        </td>
                      );
                    })}
                    <td className="border p-2 text-center">
                      {schedule?.workerHours[worker]??0}/180
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* shift details modal */}
      {selectedShift && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={()=>setSelectedShift(null)}
        >
          <div onClick={e=>e.stopPropagation()}>
            <ShiftDetailsCard
              day       = {`Day ${selectedShift.day}`}
              date      = {`${selectedShift.day} ${monthNames[month-1]}`}
              shiftType = {selectedShift.shift}
              startTime = "09:00"
              endTime   = "17:00"
              hours     = {8}
              worker    = {selectedShift.worker}
              department= "Intensiivosakond"
              fte       = {selectedShift.fte}
              onEdit    = {()=>console.log("edit",selectedShift)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
