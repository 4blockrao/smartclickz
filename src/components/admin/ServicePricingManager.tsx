
import React, { useState } from "react";
import {
  useServicePricing,
  useUpdateServicePricing,
  useCreateServicePricing,
} from "@/hooks/useServicePricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";

export function ServicePricingManager() {
  const { data: pricing, isLoading } = useServicePricing();
  const updatePricing = useUpdateServicePricing();
  const createPricing = useCreateServicePricing();

  const [newService, setNewService] = useState({
    service_name: "",
    display_label: "",
    point_cost: 0,
    is_active: true,
    notes: "",
  });

  const handleFieldChange = (id: string, field: string, value: any) => {
    updatePricing.mutate({ id, [field]: value });
  };

  const handleNewServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPricing.mutate(newService, {
      onSuccess: () => {
        setNewService({
          service_name: "",
          display_label: "",
          point_cost: 0,
          is_active: true,
          notes: "",
        });
      },
    });
  };

  if (isLoading) {
    return <div>Loading service pricing...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Service Pricing Management</h2>
      <Table>
        <TableCaption>Manage point cost for all user actions/services.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Service Name</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricing?.map((row: any) => (
            <TableRow key={row.id}>
              <TableCell>
                <Input
                  value={row.service_name}
                  disabled
                  className="w-36"
                  aria-label="Service name"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={row.display_label}
                  onChange={(e) =>
                    handleFieldChange(row.id, "display_label", e.target.value)
                  }
                  className="w-40"
                  aria-label="Label"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={row.point_cost}
                  onChange={(e) =>
                    handleFieldChange(row.id, "point_cost", Number(e.target.value))
                  }
                  min={0}
                  className="w-24"
                  aria-label="Points"
                />
              </TableCell>
              <TableCell>
                <input
                  type="checkbox"
                  checked={!!row.is_active}
                  onChange={(e) =>
                    handleFieldChange(row.id, "is_active", e.target.checked)
                  }
                  aria-label="Active"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={row.notes || ""}
                  onChange={(e) =>
                    handleFieldChange(row.id, "notes", e.target.value)
                  }
                  className="w-48"
                  aria-label="Notes"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <form onSubmit={handleNewServiceSubmit} className="mt-6 flex gap-2 flex-wrap items-end">
        <Input
          value={newService.service_name}
          onChange={(e) =>
            setNewService((s) => ({ ...s, service_name: e.target.value }))
          }
          placeholder="Service name (e.g. submit_task)"
          required
          className="w-36"
        />
        <Input
          value={newService.display_label}
          onChange={(e) =>
            setNewService((s) => ({ ...s, display_label: e.target.value }))
          }
          placeholder="Label"
          required
          className="w-40"
        />
        <Input
          type="number"
          value={newService.point_cost}
          onChange={(e) =>
            setNewService((s) => ({ ...s, point_cost: Number(e.target.value) }))
          }
          placeholder="Points"
          required
          min={0}
          className="w-24"
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={!!newService.is_active}
            onChange={(e) =>
              setNewService((s) => ({ ...s, is_active: e.target.checked }))
            }
          />
          Active
        </label>
        <Input
          value={newService.notes}
          onChange={(e) =>
            setNewService((s) => ({ ...s, notes: e.target.value }))
          }
          placeholder="Notes"
          className="w-48"
        />
        <Button type="submit" size="sm">
          Add Service
        </Button>
      </form>
    </div>
  );
}
