// src/components/leads/LeadImportDialog.tsx
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose // Added DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // For error messages
import { UploadCloud, FileText, XCircle } from 'lucide-react'; // Icons
// import Papa from 'papaparse'; // Example CSV parsing library, uncomment when implementing

interface LeadImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (leads: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'property'>[]) => void; // Type for imported leads
}

// Define a simplified type for what we expect from CSV rows after parsing
// This can be expanded based on required/optional fields from CSV
interface CSVLeadData {
  name: string;
  email?: string;
  phone?: string;
  property_name?: string; // Or property_id if using IDs directly
  source?: string;
  status?: string;
  notes?: string;
  // Add other fields that might be in the CSV
}


const LeadImportDialog: React.FC<LeadImportDialogProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Reset error on new file selection
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        setError("Invalid file type. Please upload a CSV file.");
        setFile(null);
      }
    } else {
      setFile(null);
    }
  };

  const handleImport = useCallback(() => {
    if (!file) {
      setError("Please select a file to import.");
      return;
    }
    setIsParsing(true);
    setError(null);

    // TODO: Implement actual CSV parsing logic here (e.g., using papaparse)
    // Example with papaparse:
    /*
    Papa.parse<CSVLeadData>(file, {
      header: true, // Assumes first row is header
      skipEmptyLines: true,
      dynamicTyping: true, // Converts numbers and booleans
      complete: (results) => {
        if (results.errors.length) {
          console.error("Errors parsing CSV:", results.errors);
          setError(`Error parsing CSV: ${results.errors.map(e => e.message).join(', ')}`);
          setIsParsing(false);
          return;
        }

        // Filter out any rows that might be entirely empty or just headers if not skipped properly
        const validLeads = results.data.filter(row => row.name); // Example: require 'name' field

        // Transform CSVLeadData to the Lead submission type if necessary
        const leadsToImport: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'property'>[] = validLeads.map(csvLead => ({
          name: csvLead.name,
          email: csvLead.email || null,
          phone: csvLead.phone || null,
          // property_id: map property_name to ID if needed, or use csvLead.property_id
          source: csvLead.source || 'csv_import',
          status: csvLead.status || 'New',
          notes: csvLead.notes || null,
        }));

        onImport(leadsToImport);
        setIsParsing(false);
        onClose(); // Close dialog on successful import
        setFile(null); // Reset file input
      },
      error: (parseError) => {
        console.error("Fatal error parsing CSV:", parseError);
        setError(`Fatal error parsing CSV: ${parseError.message}`);
        setIsParsing(false);
      }
    });
    */

    // Simulating CSV import for now
    console.log("Simulating CSV import for file:", file.name);
    setTimeout(() => {
      // Example: create some mock leads based on file name or simple structure
      const mockImportedLeads = [
        { name: `${file.name} - Lead 1`, email: `csv1_${Date.now()}@example.com`, source: 'csv_import', status: 'New' },
        { name: `${file.name} - Lead 2`, phone: `123-456-${Date.now().toString().slice(-4)}`, source: 'csv_import', status: 'Contacted' }
      ];
      onImport(mockImportedLeads);
      setIsParsing(false);
      onClose();
      setFile(null);
    }, 1500);
  }, [file, onImport, onClose]);

  const currentOnClose = useCallback(() => {
    if (isParsing) return; // Prevent closing while parsing
    setFile(null);
    setError(null);
    onClose();
  }, [isParsing, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={currentOnClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Import Leads from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import leads. Ensure your file has columns like Name, Email, Phone, etc.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Import Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="csvFile" className="block text-sm font-medium mb-1">CSV File</Label>
            <div className="flex items-center space-x-2">
                <Input
                    id="csvFile"
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
            </div>
            {file && <p className="text-xs text-gray-500 mt-1.5">Selected: {file.name}</p>}
          </div>
          <p className="text-xs text-gray-500">
            Example CSV format: `name,email,phone,property_name,source,status,notes`
          </p>
        </div>
        <DialogFooter className="mt-2">
          <Button type="button" variant="outline" onClick={currentOnClose} disabled={isParsing}>Cancel</Button>
          <Button onClick={handleImport} disabled={!file || isParsing} className="min-w-[120px]">
            {isParsing ? (
              <div className="flex items-center"><UploadCloud className="mr-2 h-4 w-4 animate-pulse" /> Importing...</div>
            ) : (
              <div className="flex items-center"><FileText className="mr-2 h-4 w-4" /> Import Leads</div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default LeadImportDialog;
