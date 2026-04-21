
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  filters: any;
  setFilters: (updater: (f: any) => any) => void;
  searchingCompanyName?: boolean;
  onCompanyNameChange?: (companyName: string) => void;
}

export default function NetworkerFilterBar({
  filters,
  setFilters,
  searchingCompanyName,
  onCompanyNameChange,
}: Props) {
  const [companyName, setCompanyName] = useState("");
  return (
    <form className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs mb-1">Name</label>
        <Input
          className="w-44"
          type="text"
          value={filters.name}
          onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Amit"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">ID</label>
        <Input
          className="w-36"
          type="text"
          value={filters.id}
          onChange={e => setFilters(f => ({ ...f, id: e.target.value }))}
          placeholder="Profile ID"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">City</label>
        <Input
          className="w-36"
          type="text"
          value={filters.city}
          onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
          placeholder="e.g. Mumbai"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Country</label>
        <Input
          className="w-36"
          type="text"
          value={filters.country}
          onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}
          placeholder="e.g. India"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Company</label>
        <Input
          className="w-44"
          type="text"
          value={filters.companyName || ""}
          autoComplete="off"
          onChange={e => {
            setFilters(f => ({ ...f, companyName: e.target.value, company: "" }));
            if (onCompanyNameChange) onCompanyNameChange(e.target.value);
          }}
          placeholder="Type company name"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Skill</label>
        <Input
          className="w-40"
          type="text"
          value={filters.skill}
          onChange={e => setFilters(f => ({ ...f, skill: e.target.value }))}
          placeholder="e.g. marketing"
        />
      </div>
    </form>
  );
}
