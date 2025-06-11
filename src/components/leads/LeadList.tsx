// src/components/leads/LeadList.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'; // Icons
import { Lead } from './types';
import { Property } from '@/components/tasks/types';
import { Badge } from '@/components/ui/badge'; // For status visualization

interface LeadListProps {
  leads: Lead[];
  properties: Property[]; // To resolve property names
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

const getPropertyName = (propertyId: string | null | undefined, properties: Property[]): string => {
    if (!propertyId) return <span className="text-xs text-gray-500">N/A</span>;
    const prop = properties.find(p => p.id === propertyId);
    return prop ? prop.name : <span className="text-xs text-red-500">Unknown</span>;
};

// Helper to format source/status for display
const formatDisplayString = (str: string | undefined | null): string => {
    if (!str) return 'N/A';
    return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const LeadList: React.FC<LeadListProps> = ({ leads, properties, onEditLead, onDeleteLead }) => {
  if (leads.length === 0) {
    return <p className="text-center text-gray-500 py-8">No leads found. Get started by adding a new lead or importing from CSV.</p>;
  }
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
      <Table>
        <TableCaption>A list of your current leads.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>
                <div className="text-sm">{lead.email || <span className="text-xs text-gray-500">No Email</span>}</div>
                <div className="text-xs text-gray-500">{lead.phone || <span className="text-xs text-gray-500">No Phone</span>}</div>
              </TableCell>
              <TableCell>{getPropertyName(lead.property_id, properties)}</TableCell>
              <TableCell>
                <Badge variant={lead.status === 'New' ? 'default' : lead.status === 'Won' ? 'success' : 'secondary'} className="text-xs">
                  {formatDisplayString(lead.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">{formatDisplayString(lead.source)}</TableCell>
              <TableCell className="text-xs">{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditLead(lead)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteLead(lead.id)} className="text-red-600 hover:!text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default LeadList;
