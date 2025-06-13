
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Upload, FileText, Split } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
}

interface QCFlag {
  id: string;
  name: string;
}

interface ReferenceData {
  id: string;
  pdfFile: File | null;
  pdfUrl: string;
  currentPage: number;
  totalPages: number;
  quality: string;
  serviceType: string;
  selectedServiceItems: string[];
  demographics: {
    uhidCorrect: boolean;
    flagged: boolean;
  };
  qcFlags: string[];
  labPartner: string;
  expectedCount: number;
  comments: string;
}

const Utilization = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [references, setReferences] = useState<Record<string, ReferenceData>>({});
  const [activeReference, setActiveReference] = useState<string>('');
  const { toast } = useToast();

  const qualityOptions = [
    'Skewed',
    'Dewarped', 
    'Low Resolution',
    'Hand written',
    'Digital Print',
    'Scanned'
  ];

  const serviceTypes = [
    'Pathology',
    'Radiology & Imaging',
    'Cardiology',
    'Cytogenetics',
    'Advanced Cytogenetics',
    'Neurology Diagnostics',
    'Pulmonology',
    'Molecular Diagnostics',
    'Vaccination',
    'Other Service',
    'Consult'
  ];

  const serviceItems: ServiceItem[] = [
    // Radiology & Imaging
    { id: 'xray', name: 'X-Ray', category: 'Radiology & Imaging' },
    { id: 'usg', name: 'Ultrasound (USG)', category: 'Radiology & Imaging' },
    { id: 'ct', name: 'CT Scan', category: 'Radiology & Imaging' },
    { id: 'mri', name: 'MRI', category: 'Radiology & Imaging' },
    { id: 'echo', name: 'ECHO', category: 'Radiology & Imaging' },
    
    // Cardiology
    { id: 'ecg', name: 'ECG', category: 'Cardiology' },
    { id: 'tmt', name: 'TMT', category: 'Cardiology' },
    { id: 'holter', name: 'Holter', category: 'Cardiology' },
    
    // Neurology Diagnostics
    { id: 'eeg', name: 'EEG (Electroencephalogram)', category: 'Neurology Diagnostics' },
    { id: 'ncv', name: 'NCV (Nerve Conduction Velocity)', category: 'Neurology Diagnostics' },
    { id: 'emg', name: 'EMG (Electromyography)', category: 'Neurology Diagnostics' },
    
    // Pulmonology
    { id: 'pft', name: 'PFT (Pulmonary Function Test)', category: 'Pulmonology' },
    { id: 'sleep', name: 'Sleep Study (Polysomnography)', category: 'Pulmonology' },
    
    // Molecular Diagnostics
    { id: 'pcr', name: 'PCR-based tests (COVID-19, TB, HPV)', category: 'Molecular Diagnostics' },
    { id: 'genetic', name: 'Genetic testing', category: 'Molecular Diagnostics' },
    
    // Vaccination
    { id: 'routine', name: 'Routine Vaccines', category: 'Vaccination' },
    { id: 'travel', name: 'Travel Vaccines', category: 'Vaccination' },
    { id: 'corporate', name: 'Corporate Vaccines', category: 'Vaccination' },
  ];

  const qcFlags: QCFlag[] = [
    { id: 'pending_radiology', name: 'Pending Radiology' },
    { id: 'incorrect_demographics', name: 'Incorrect Demographics' },
    { id: 'partial_reports_radiology', name: 'Partial Reports - Radiology' },
    { id: 'partial_reports_cardiology', name: 'Partial Reports - Cardiology' }
  ];

  const labPartners = [
    'Lab Partner A',
    'Lab Partner B', 
    'Lab Partner C',
    'External Lab'
  ];

  const handlePdfUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const refId = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const url = URL.createObjectURL(file);
      
      setReferences(prev => ({
        ...prev,
        [refId]: {
          id: refId,
          pdfFile: file,
          pdfUrl: url,
          currentPage: 1,
          totalPages: 1, // Would be calculated from actual PDF
          quality: '',
          serviceType: '',
          selectedServiceItems: [],
          demographics: { uhidCorrect: true, flagged: false },
          qcFlags: [],
          labPartner: '',
          expectedCount: 0,
          comments: ''
        }
      }));
      
      if (!activeReference) {
        setActiveReference(refId);
      }
    });
    
    toast({
      title: "Files uploaded successfully",
      description: `${files.length} PDF(s) uploaded`
    });
  }, [activeReference, toast]);

  const handleServiceItemToggle = (itemId: string, category: string) => {
    if (!activeReference) return;
    
    setReferences(prev => {
      const current = prev[activeReference];
      const isSelected = current.selectedServiceItems.includes(itemId);
      let newSelected;
      
      if (isSelected) {
        newSelected = current.selectedServiceItems.filter(id => id !== itemId);
      } else {
        newSelected = [...current.selectedServiceItems, itemId];
      }
      
      // Auto-select category if all items in category are selected
      const categoryItems = serviceItems.filter(item => item.category === category);
      const selectedCategoryItems = newSelected.filter(id => 
        categoryItems.some(item => item.id === id)
      );
      
      return {
        ...prev,
        [activeReference]: {
          ...current,
          selectedServiceItems: newSelected
        }
      };
    });
  };

  const handleCategoryToggle = (category: string) => {
    if (!activeReference) return;
    
    setReferences(prev => {
      const current = prev[activeReference];
      const categoryItems = serviceItems.filter(item => item.category === category);
      const categoryItemIds = categoryItems.map(item => item.id);
      
      const allSelected = categoryItemIds.every(id => 
        current.selectedServiceItems.includes(id)
      );
      
      let newSelected;
      if (allSelected) {
        // Deselect all items in category
        newSelected = current.selectedServiceItems.filter(id => 
          !categoryItemIds.includes(id)
        );
      } else {
        // Select all items in category
        newSelected = [...new Set([...current.selectedServiceItems, ...categoryItemIds])];
      }
      
      return {
        ...prev,
        [activeReference]: {
          ...current,
          selectedServiceItems: newSelected
        }
      };
    });
  };

  const filteredServiceItems = serviceItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedServiceItems = filteredServiceItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ServiceItem[]>);

  const currentReference = activeReference ? references[activeReference] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Utilization</h1>
          <p className="text-gray-600 mt-2">PDF Processing and Service Item Tagging</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - PDF Upload and Preview */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PDF Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Upload Section */}
              <div className="mb-4">
                <Label htmlFor="pdf-upload" className="block mb-2">Upload PDF Files</Label>
                <input
                  id="pdf-upload"
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={(e) => handlePdfUpload(e.target.files)}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById('pdf-upload')?.click()}
                  className="w-full"
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PDF Files
                </Button>
              </div>

              {/* Reference ID Selection */}
              {Object.keys(references).length > 0 && (
                <div className="mb-4">
                  <Label className="block mb-2">Reference ID</Label>
                  <Select value={activeReference} onValueChange={setActiveReference}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Reference ID" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(references).map(refId => (
                        <SelectItem key={refId} value={refId}>{refId}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentReference && (
                <>
                  {/* PDF Preview */}
                  <div className="mb-4 flex-1 min-h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <iframe
                      src={currentReference.pdfUrl}
                      className="w-full h-full rounded-lg"
                      title="PDF Preview"
                    />
                  </div>

                  {/* PDF Controls */}
                  <div className="mb-4 flex items-center gap-2">
                    <Button size="sm" variant="outline">Previous Page</Button>
                    <span className="text-sm">Page {currentReference.currentPage} of {currentReference.totalPages}</span>
                    <Button size="sm" variant="outline">Next Page</Button>
                    <Button size="sm" variant="outline">
                      <Split className="h-4 w-4 mr-1" />
                      Split PDF
                    </Button>
                  </div>

                  {/* Tagging Section */}
                  <div className="space-y-4">
                    <div>
                      <Label className="block mb-2">PDF Quality *</Label>
                      <Select
                        value={currentReference.quality}
                        onValueChange={(value) => setReferences(prev => ({
                          ...prev,
                          [activeReference]: { ...prev[activeReference], quality: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          {qualityOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block mb-2">Service Type *</Label>
                      <Select
                        value={currentReference.serviceType}
                        onValueChange={(value) => setReferences(prev => ({
                          ...prev,
                          [activeReference]: { ...prev[activeReference], serviceType: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block mb-2">Executing Lab Partner</Label>
                      <Select
                        value={currentReference.labPartner}
                        onValueChange={(value) => setReferences(prev => ({
                          ...prev,
                          [activeReference]: { ...prev[activeReference], labPartner: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select lab partner" />
                        </SelectTrigger>
                        <SelectContent>
                          {labPartners.map(partner => (
                            <SelectItem key={partner} value={partner}>{partner}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block mb-2">Expected Count</Label>
                      <Input
                        type="number"
                        value={currentReference.expectedCount}
                        onChange={(e) => setReferences(prev => ({
                          ...prev,
                          [activeReference]: { ...prev[activeReference], expectedCount: parseInt(e.target.value) || 0 }
                        }))}
                        placeholder="Enter expected count"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Right Side - Service Items and QC */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Service Item Tagging & QC Verification</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search service items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {currentReference ? (
                <Tabs defaultValue="services" className="flex-1 flex flex-col">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="services">Service Items</TabsTrigger>
                    <TabsTrigger value="qc">QC Verification</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="services" className="flex-1">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4">
                        {Object.entries(groupedServiceItems).map(([category, items]) => {
                          const categoryItemIds = items.map(item => item.id);
                          const selectedCount = categoryItemIds.filter(id => 
                            currentReference.selectedServiceItems.includes(id)
                          ).length;
                          const allSelected = selectedCount === categoryItemIds.length;
                          const someSelected = selectedCount > 0 && selectedCount < categoryItemIds.length;
                          
                          return (
                            <div key={category} className="border rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                  checked={allSelected}
                                  ref={(el) => {
                                    if (el) el.indeterminate = someSelected;
                                  }}
                                  onCheckedChange={() => handleCategoryToggle(category)}
                                />
                                <Label className="font-semibold cursor-pointer" onClick={() => handleCategoryToggle(category)}>
                                  {category} ({selectedCount}/{categoryItemIds.length})
                                </Label>
                              </div>
                              <div className="ml-6 space-y-2">
                                {items.map(item => (
                                  <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={currentReference.selectedServiceItems.includes(item.id)}
                                      onCheckedChange={() => handleServiceItemToggle(item.id, category)}
                                    />
                                    <Label 
                                      className="cursor-pointer text-sm"
                                      onClick={() => handleServiceItemToggle(item.id, category)}
                                    >
                                      {item.name}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="qc" className="flex-1">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4">
                        <div>
                          <Label className="block mb-2">Demographics Verification</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={currentReference.demographics.uhidCorrect}
                                onCheckedChange={(checked) => setReferences(prev => ({
                                  ...prev,
                                  [activeReference]: {
                                    ...prev[activeReference],
                                    demographics: {
                                      ...prev[activeReference].demographics,
                                      uhidCorrect: checked as boolean
                                    }
                                  }
                                }))}
                              />
                              <Label>UHID Correct</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={currentReference.demographics.flagged}
                                onCheckedChange={(checked) => setReferences(prev => ({
                                  ...prev,
                                  [activeReference]: {
                                    ...prev[activeReference],
                                    demographics: {
                                      ...prev[activeReference].demographics,
                                      flagged: checked as boolean
                                    }
                                  }
                                }))}
                              />
                              <Label>Flag for Incorrect Demographics</Label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="block mb-2">QC Flags *</Label>
                          <div className="space-y-2">
                            {qcFlags.map(flag => (
                              <div key={flag.id} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={currentReference.qcFlags.includes(flag.id)}
                                  onCheckedChange={(checked) => {
                                    setReferences(prev => {
                                      const current = prev[activeReference];
                                      const newFlags = checked
                                        ? [...current.qcFlags, flag.id]
                                        : current.qcFlags.filter(id => id !== flag.id);
                                      
                                      return {
                                        ...prev,
                                        [activeReference]: {
                                          ...current,
                                          qcFlags: newFlags
                                        }
                                      };
                                    });
                                  }}
                                />
                                <Label>{flag.name}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="block mb-2">Comments</Label>
                          <textarea
                            className="w-full p-2 border rounded-md resize-none"
                            rows={3}
                            value={currentReference.comments}
                            onChange={(e) => setReferences(prev => ({
                              ...prev,
                              [activeReference]: { ...prev[activeReference], comments: e.target.value }
                            }))}
                            placeholder="Enter comments..."
                          />
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p>Upload and select a PDF to begin tagging</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        {currentReference && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => {
                toast({
                  title: "Data saved successfully",
                  description: `Reference ID: ${activeReference}`
                });
              }}
              className="px-8"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Utilization;
