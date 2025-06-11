// src/components/leads/LeadForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Lead } from './types';
import { Property } from '@/components/tasks/types'; // Assuming shared type from tasks module

interface LeadFormProps {
  initialData?: Lead | null;
  properties: Property[]; // Pass properties for the select dropdown
  onSubmit: (data: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'property'>) => void;
  onCancel: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ initialData, properties, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [propertyId, setPropertyId] = useState(initialData?.property_id || '');
  const [source, setSource] = useState(initialData?.source || 'manual_entry');
  const [status, setStatus] = useState(initialData?.status || 'New');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email: email || null, // Ensure empty strings are submitted as null if desired by backend
      phone: phone || null,
      property_id: propertyId || null,
      source,
      status,
      notes: notes || null
    });
  };

  // Define standard options for select dropdowns
  const leadSourceOptions = ['manual_entry', 'csv_import', 'website_form', 'referral', 'advertisement', 'social_media', 'other'];
  const leadStatusOptions = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'On Hold'];

  // Helper to format option strings for display
  const formatOption = (option: string) => {
    return option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1"> {/* Increased spacing and minor padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Responsive grid */}
        <div>
          <Label htmlFor="leadName" className="font-medium">Name</Label>
          <Input id="leadName" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="leadEmail" className="font-medium">Email</Label>
          <Input id="leadEmail" type="email" value={email || ''} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="leadPhone" className="font-medium">Phone</Label>
          <Input id="leadPhone" value={phone || ''} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="property" className="font-medium">Property</Label>
          <Select value={propertyId || ''} onValueChange={setPropertyId}>
            <SelectTrigger id="property" className="mt-1"><SelectValue placeholder="Select property (optional)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {properties.map(prop => (
                <SelectItem key={prop.id} value={prop.id}>{prop.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="leadSource" className="font-medium">Source</Label>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger id="leadSource" className="mt-1"><SelectValue placeholder="Select source" /></SelectTrigger>
            <SelectContent>
              {leadSourceOptions.map(opt => <SelectItem key={opt} value={opt}>{formatOption(opt)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="leadStatus" className="font-medium">Status</Label>
           <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="leadStatus" className="mt-1"><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {leadStatusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="leadNotes" className="font-medium">Notes</Label>
        <Textarea id="leadNotes" value={notes || ''} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-1" />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update Lead' : 'Create Lead'}</Button>
      </div>
    </form>
  );
};
export default LeadForm;
