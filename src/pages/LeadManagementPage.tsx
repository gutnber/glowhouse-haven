// src/pages/LeadManagementPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import LeadList from '@/components/leads/LeadList';
import LeadForm from '@/components/leads/LeadForm';
import LeadImportDialog from '@/components/leads/LeadImportDialog';
import { Button } from '@/components/ui/button';
import { Lead } from '@/components/leads/types';
import { Property } from '@/components/tasks/types'; // Assuming shared type from tasks module
import { PlusCircle, Upload } from 'lucide-react'; // Icons
// import { supabase } from '@/integrations/supabase/client'; // For actual Supabase calls

// Mock data - replace with Supabase fetching
const MOCK_PROPERTIES_DATA: Property[] = [
  { id: 'prop1', name: 'Sunset Villa Estates' },
  { id: 'prop2', name: 'Downtown Central Condos' },
  { id: 'prop3', name: 'Lakeside Apartments' },
];

const MOCK_LEADS_DATA: Lead[] = [
  { id: 'lead1', name: 'Alice Wonderland', email: 'alice.wonder@example.com', phone: '555-1234', property_id: 'prop1', status: 'New', source: 'website_form', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), notes: 'Interested in 2-bedroom units.' },
  { id: 'lead2', name: 'Bob The Builder', email: 'bob.builder@example.com', phone: '555-5678', property_id: 'prop2', status: 'Contacted', source: 'referral', created_at: new Date(Date.now() - 86400000 * 5).toISOString(), notes: 'Looking for a fixer-upper.' },
  { id: 'lead3', name: 'Charlie Brown', email: 'charlie.brown@example.com', phone: '555-9012', property_id: 'prop1', status: 'Qualified', source: 'manual_entry', created_at: new Date(Date.now() - 86400000 * 1).toISOString(), notes: 'Good credit score, pre-approved for mortgage.' },
  { id: 'lead4', name: 'Diana Prince', email: 'diana.prince@example.com', phone: '555-3456', property_id: null, status: 'Lost', source: 'csv_import', created_at: new Date(Date.now() - 86400000 * 10).toISOString(), notes: 'Decided to rent instead.' },
];


const LeadManagementPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For initial data load

  // Fetch initial data (leads and properties)
  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    console.log("Fetching initial leads and properties...");
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    // TODO: Replace with actual Supabase calls
    // const { data: leadsData, error: leadsError } = await supabase.from('leads').select('*, property:properties(id, name)');
    // const { data: propertiesData, error: propertiesError } = await supabase.from('properties').select('id, name');

    setLeads(MOCK_LEADS_DATA);
    setProperties(MOCK_PROPERTIES_DATA);
    // if (leadsError) console.error("Error fetching leads:", leadsError.message);
    // if (propertiesError) console.error("Error fetching properties:", propertiesError.message);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleCreateNew = () => {
    setEditingLead(null);
    setShowForm(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    console.log('Attempting to delete lead:', leadId);
    // TODO: Implement Supabase delete
    // const { error } = await supabase.from('leads').delete().eq('id', leadId);
    // if (error) {
    //   console.error('Error deleting lead:', error.message);
    //   alert(`Failed to delete lead: ${error.message}`);
    // } else {
    //   setLeads(prev => prev.filter(l => l.id !== leadId));
    //   alert('Lead deleted successfully.');
    // }
    // Mock deletion:
    setLeads(prev => prev.filter(l => l.id !== leadId));
    alert('Lead deleted (mock).');
  };

  const handleFormSubmit = async (data: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'property'>) => {
    console.log('Lead form submitted:', data);
    // TODO: Implement Supabase insert/update
    if (editingLead) {
      // const { data: updatedLead, error } = await supabase.from('leads').update(data).eq('id', editingLead.id).select('*, property:properties(id,name)').single();
      // if (error) console.error('Error updating lead:', error.message);
      // else setLeads(prev => prev.map(l => l.id === editingLead.id ? updatedLead : l));
      // Mock update:
      setLeads(prev => prev.map(l => l.id === editingLead.id ? {...editingLead, ...data, updated_at: new Date().toISOString()} : l));
      alert('Lead updated (mock).');
    } else {
      // const { data: newLead, error } = await supabase.from('leads').insert(data).select('*, property:properties(id,name)').single();
      // if (error) console.error('Error creating lead:', error.message);
      // else setLeads(prev => [newLead, ...prev]);
      // Mock create:
      const newLeadData = {id: `newlead_${Date.now()}`, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString()};
      setLeads(prev => [newLeadData, ...prev]);
      alert('Lead created (mock).');
    }
    setShowForm(false);
    setEditingLead(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingLead(null);
  };

  const handleImportLeads = async (importedLeads: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'property'>[]) => {
    console.log('Importing leads:', importedLeads);
    // TODO: Process and save importedLeads to Supabase, then refresh list
    // const leadsToInsert = importedLeads.map(lead => ({...lead, created_by: supabase.auth.user()?.id }));
    // const { data, error } = await supabase.from('leads').insert(leadsToInsert).select('*, property:properties(id,name)');
    // if (error) {
    //   console.error('Error batch inserting leads:', error.message);
    //   alert(`Failed to import leads: ${error.message}`);
    // } else {
    //   fetchInitialData(); // or optimistically update: setLeads(prev => [...data, ...prev]);
    //   alert(`${data?.length || 0} leads imported successfully.`);
    // }
    // Mock import:
    const newLeads = importedLeads.map((lead, index) => ({
        ...lead,
        id: `imported_${Date.now()}_${index}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));
    setLeads(prev => [...newLeads, ...prev]);
    alert(`${newLeads.length} leads imported (mock).`);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading Lead Management...</div>;
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
        {!showForm && (
            <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => setShowImportDialog(true)} variant="outline" className="flex items-center gap-2">
                    <Upload size={18} /> Import Leads
                </Button>
                <Button onClick={handleCreateNew} className="flex items-center gap-2">
                    <PlusCircle size={18} /> Add New Lead
                </Button>
            </div>
        )}
      </div>

      {showForm ? (
        <div className="max-w-3xl mx-auto bg-card p-6 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            {editingLead ? 'Edit Lead' : 'Create New Lead'}
          </h2>
          <LeadForm
            initialData={editingLead}
            properties={properties}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <LeadList
          leads={leads}
          properties={properties}
          onEditLead={handleEditLead}
          onDeleteLead={handleDeleteLead}
        />
      )}
      <LeadImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImportLeads}
      />
    </div>
  );
};

export default LeadManagementPage;
