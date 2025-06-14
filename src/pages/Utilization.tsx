
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Search, Download, Split, FileText, ChevronLeft, ChevronRight, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Service data structure for Pathology
const pathologyServices = {
  "Complete Blood Count (CBC)": [
    "Absolute Leucocyte Count", "BASOPHILS - ABSOLUTE COUNT", "Differential Leucocyte Count (DLC)",
    "Differential Leucocyte Count (DLC) - Basophils", "Differential Leucocyte Count (DLC) - Eosinophils",
    "Differential Leucocyte Count (DLC) - Lymphocytes", "Differential Leucocyte Count (DLC) - Monocytes",
    "Differential Leucocyte Count (DLC) - Neutrophils", "Differential Leucocyte Count (DLC) - Polymorphs",
    "EOSINOPHILS - ABSOLUTE COUNT", "HEMATOCRIT(PCV)", "HEMOGLOBIN", "IMMATURE GRANULOCYTE PERCENTAGE(IG%)",
    "IMMATURE GRANULOCYTES", "LYMPHOCYTES - ABSOLUTE COUNT", "MEAN CORP.HEMO.CONC(MCHC)",
    "MEAN CORPUSCULAR HEMOGLOBIN(MCH)", "MEAN CORPUSCULAR VOLUME(MCV)", "Mentzer Index",
    "Neutrophil Lymphocyte Ratio (NLR)", "NEUTROPHILS - ABSOLUTE COUNT", "Nucleated RBC %",
    "Nucleated RBC's", "Platelet Count", "Platelet Distribution Width (PDW)", "Plateletcrit (PCT)",
    "RBC Count", "RED CELL DISTRIBUTION WIDTH (RDW-CV)", "RED CELL DISTRIBUTION WIDTH (RDW-SD)",
    "TOTAL LEUCOCYTES COUNT (WBC)"
  ],
  "Erythrocyte Sedimentation Rate (ESR)": [
    "ERYTHROCYTE SEDIMENTATION RATE (ESR)"
  ],
  "Blood Group and Rh Type": [
    "Blood Group", "Blood Group & Rh Type", "Rh Type"
  ],
  "Liver Function Test (LFT)": [
    "ALANINE TRANSAMINASE (SGPT)", "ALBUMIN - SERUM", "Albumin / Globulin Ratio", "ALKALINE PHOSPHATASE",
    "ASPARTATE AMINOTRANSFERASE (SGOT)", "AST (SGOT) / ALT (SGPT) RATIO", "BILE SALT",
    "BILIRUBIN - TOTAL", "BILIRUBIN - DIRECT", "Bilirubin - Indirect", "Gamma Glutamyltransferase (GGT)",
    "GLOBULIN", "PROTEIN - TOTAL"
  ],
  "Kidney Function Test (KFT)": [
    "Blood Urea", "BLOOD UREA NITROGEN (BUN)", "BUN / CREATININE RATIO", "CALCIUM", "Chloride",
    "CREATININE - SERUM", "Estimated Glomerular Filtration Rate", "MICROALBUMIN", "PHOSPHORUS",
    "POTASSIUM", "Sodium", "UREA / CREATININE RATIO", "URIC ACID"
  ],
  "Lipid Profile": [
    "ATHEROGENIC INDEX (AIP)", "Chol/HDL Ratio", "HDL CHOLESTEROL - DIRECT", "HDl: LDL Cholesterol",
    "LDL CHOLESTEROL - DIRECT", "LDl: HDL Cholesterol", "Non HDL Cholesterol", "TOTAL CHOLESTEROL",
    "Total Lipids", "TRIGLYCERIDES", "Triglycerides / HDL Ratio", "VLDL CHOLESTEROL"
  ],
  "Urine Routine": [
    "AMORPHOUS DEPOSITS - URINE", "Blood Urine", "Urine Appearance", "Urine Bacteria",
    "URINE BILE PIGMENT/BILE SALTS", "URINE CASTS", "Urine Colour", "URINE CRYSTALS", "Urine Deposits",
    "URINE EPITHELIAL CELLS", "URINE HYALINE CASTS", "URINE KETONE", "Urine Leucocyte Esterase",
    "URINE LEUCOCYTES", "URINE MUCUS", "URINE NITRITE", "Urine Occult Blood", "URINE PATHOLOGICAL CASTS",
    "URINE PUS CELLS (WBC)", "Urine RBC (erythrocytes)", "Urine Reaction and pH", "URINE SPECIFIC GRAVITY",
    "URINE VOLUME", "URINE YEAST", "UROBILINOGEN", "URINARY BILIRUBIN", "URINARY GLUCOSE", "URINARY PROTEIN"
  ],
  "Stool Routine": [
    "Stool Colour", "Stool Occult Blood", "STOOL PUS CELLS", "PARASITE"
  ],
  "Thyroid Function Test (TFT)": [
    "FREE THYROXINE (FT4)", "FREE TRIIODOTHYRONINE (FT3)", "T3, Total", "T4, Total",
    "THYROID STIMULATING HORMONE - ULTRA SENSITIVE", "THYROID STIMULATING HORMONE (TSH)"
  ],
  "PAP Smear": [
    "Clinical Details - PAP Smear", "Clinical History - PAP Smear", "Endocervical cells - PAP Smear",
    "Epithelial Abnormalities - PAP Smear", "GENERAL CATEGORIZATION - PAP Smear", "Gross Examination - PAP Smear",
    "Interpretation / Result - PAP Smear", "Microorganisms - PAP Smear", "MICROSCOPIC OBSERVATIONS - PAP Smear",
    "Non-neoplastic Changes - PAP Smear", "Papanicolaou test (PAP Smear)", "Specimen - PAP Smear",
    "Specimen Adequacy - PAP Smear", "Squamous Abnormalities - PAP Smear"
  ],
  "Vitamin B12": ["Vitamin B12"],
  "Vitamin D": ["VITAMIN D TOTAL", "VITAMIN D3"],
  "Iron Profile": [
    "Serum Iron", "Total Iron Binding Capacity (TIBC)", "Unsaturated Iron-Binding Capacity (UIBC)"
  ],
  "C-Reactive Protein (CRP)": [
    "C-REACTIVE PROTEIN (CRP)", "High-sensitivity CRP (hs-CRP)"
  ],
  "Electrolytes": [
    "CALCIUM", "Chloride", "PHOSPHORUS", "POTASSIUM", "Sodium"
  ],
  "Diabetes Profile": [
    "Estimated Average Glucose (EAG)", "FASTING BLOOD SUGAR (GLUCOSE)", "GLYCATED HEMOGLOBIN",
    "Mean Plasma Glucose Level", "MICROALBUMIN", "Postprandial Blood Glucose/Glucose-PP",
    "Random Blood Sugar/Glucose (RBS)", "URINARY GLUCOSE"
  ],
  "Rheumatoid Factor (RF)": ["RHEUMATOID FACTOR (RF)"],
  "Prostate Specific Antigen (PSA)": ["PROSTATE SPECIFIC ANTIGEN (PSA)"]
};

const otherServices = {
  "Radiology & Imaging": ["X-Ray", "Ultrasound (USG)", "CT Scan", "MRI", "ECHO"],
  "Cardiology": ["ECG", "TMT", "Holter"],
  "Cytogenetics": ["Advanced Cytogenetics"],
  "Neurology Diagnostics": ["EEG (Electroencephalogram)", "NCV (Nerve Conduction Velocity)", "EMG (Electromyography)"],
  "Pulmonology": ["PFT (Pulmonary Function Test)", "Sleep Study (Polysomnography)"],
  "Molecular Diagnostics": ["PCR-based tests (COVID-19, TB, HPV)", "Genetic testing"],
  "Vaccination": ["Routine Vaccines", "Travel Vaccines", "Corporate Vaccines"]
};

const qualityOptions = ["Skewed", "Dewarped", "Low Resolution", "Handwritten", "Digital Print", "Scanned"];
const serviceTypeOptions = ["Pathology", "Other Services"];
const labPartners = ["Lab Partner 1", "Lab Partner 2", "Lab Partner 3", "Lab Partner 4"];

// QC elimination items
const qcDemographicItems = ["Name Mismatch", "Age Incorrect", "Gender Wrong", "Address Error", "Phone Number Error"];
const qcFlagItems = ["Report Date Error", "Doctor Name Missing", "Lab Values Out of Range", "Units Incorrect"];

interface FileData {
  name: string;
  file: File;
  pages: number;
}

const Utilization = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [splitPdfs, setSplitPdfs] = useState<{pdf1: number[], pdf2: number[]} | null>(null);
  const [referenceId, setReferenceId] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<string[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expectedCount, setExpectedCount] = useState(0);
  const [selectedLabPartner, setSelectedLabPartner] = useState('');
  const [customLabPartner, setCustomLabPartner] = useState('');
  const [demographics, setDemographics] = useState('');
  const [comments, setComments] = useState('');
  const [eliminatedDemographics, setEliminatedDemographics] = useState<string[]>([]);
  const [eliminatedFlags, setEliminatedFlags] = useState<string[]>([]);
  const [qcStatus, setQcStatus] = useState('');
  const [pendingRadiology, setPendingRadiology] = useState(false);
  const [pendingCardiology, setPendingCardiology] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles: FileData[] = files.map(file => ({
      name: file.name,
      file: file,
      pages: Math.floor(Math.random() * 10) + 1 // Mock page count
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    if (files.length > 0 && !referenceId) {
      setReferenceId(files[0].name.replace(/\.[^/.]+$/, ""));
    }
    setTotalPages(newFiles[0]?.pages || 1);
    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) uploaded successfully`,
    });
  };

  const handlePageSelection = (pageNum: number) => {
    setSelectedPages(prev => 
      prev.includes(pageNum) 
        ? prev.filter(p => p !== pageNum)
        : [...prev, pageNum]
    );
  };

  const handleSplitPdf = () => {
    if (selectedPages.length === 0) {
      toast({
        title: "No Pages Selected",
        description: "Please select pages to split",
        variant: "destructive"
      });
      return;
    }

    const allPages = Array.from({length: totalPages}, (_, i) => i + 1);
    const pdf1 = selectedPages.sort((a, b) => a - b);
    const pdf2 = allPages.filter(p => !selectedPages.includes(p));
    
    setSplitPdfs({ pdf1, pdf2 });
    setSelectedPages([]);
    toast({
      title: "PDF Split Successfully",
      description: `Split into PDF 1 (${pdf1.length} pages) and PDF 2 (${pdf2.length} pages)`,
    });
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(prev => 
      prev.includes(quality) 
        ? prev.filter(q => q !== quality)
        : [...prev, quality]
    );
  };

  const handleServiceItemToggle = (category: string, item: string) => {
    const key = `${category}-${item}`;
    const newSelected = !selectedItems[key];
    
    setSelectedItems(prev => ({
      ...prev,
      [key]: newSelected
    }));

    // Auto-increment expected count for pathology items
    if (selectedServiceType === 'Pathology' && newSelected) {
      setExpectedCount(prev => prev + 1);
    } else if (selectedServiceType === 'Pathology' && !newSelected) {
      setExpectedCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleCategoryToggle = (category: string) => {
    const currentServices = selectedServiceType === 'Pathology' ? pathologyServices : otherServices;
    const categoryItems = currentServices[category] || [];
    const allSelected = categoryItems.every(item => selectedItems[`${category}-${item}`]);
    
    const newSelectedItems = { ...selectedItems };
    categoryItems.forEach(item => {
      const key = `${category}-${item}`;
      const newValue = !allSelected;
      newSelectedItems[key] = newValue;
      
      // Update expected count for pathology
      if (selectedServiceType === 'Pathology') {
        if (newValue && !selectedItems[key]) {
          setExpectedCount(prev => prev + 1);
        } else if (!newValue && selectedItems[key]) {
          setExpectedCount(prev => Math.max(0, prev - 1));
        }
      }
    });
    setSelectedItems(newSelectedItems);
  };

  const handleEliminateItem = (item: string, type: 'demographics' | 'flags') => {
    if (type === 'demographics') {
      setEliminatedDemographics(prev => 
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    } else {
      setEliminatedFlags(prev => 
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter') {
      action();
    }
  };

  const handleDelete = () => {
    setUploadedFiles([]);
    setReferenceId('');
    setSelectedQuality([]);
    setSelectedServiceType('');
    setSelectedItems({});
    setExpectedCount(0);
    setSplitPdfs(null);
    setSelectedPages([]);
    toast({
      title: "Data Cleared",
      description: "All data has been cleared",
    });
  };

  const filteredServices = () => {
    const currentServices = selectedServiceType === 'Pathology' ? pathologyServices : otherServices;
    if (!searchTerm) return currentServices;
    
    const filtered: Record<string, string[]> = {};
    Object.entries(currentServices).forEach(([category, items]) => {
      const filteredItems = items.filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    return filtered;
  };

  const renderServiceItems = () => {
    const services = filteredServices();
    
    return Object.entries(services).map(([category, items]) => {
      const categoryItemIds = items.map(item => `${category}-${item}`);
      const selectedCount = categoryItemIds.filter(id => selectedItems[id]).length;
      const allSelected = selectedCount === categoryItemIds.length;

      return (
        <div key={category} className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => handleCategoryToggle(category)}
            />
            <Label className="font-semibold cursor-pointer" onClick={() => handleCategoryToggle(category)}>
              {category} ({selectedCount}/{categoryItemIds.length})
            </Label>
          </div>
          <div className="ml-6 space-y-1">
            {items.map(item => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedItems[`${category}-${item}`] || false}
                  onCheckedChange={() => handleServiceItemToggle(category, item)}
                />
                <Label className="text-sm cursor-pointer" onClick={() => handleServiceItemToggle(category, item)}>
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Utilization</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - PDF Upload and Preview */}
          <div className="space-y-4">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  PDF Upload & Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload PDFs or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">Supports bulk upload</p>
                    </div>
                  </label>
                </div>

                {/* PDF Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="border rounded-lg p-4 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">PDF Preview</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleSplitPdf} disabled={selectedPages.length === 0}>
                          <Split className="h-4 w-4 mr-1" />
                          Split Selected
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Page Selection */}
                    <div className="mb-4">
                      <Label className="text-sm font-medium mb-2 block">Select Pages to Split:</Label>
                      <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                        {Array.from({length: totalPages}, (_, i) => i + 1).map(pageNum => (
                          <Button
                            key={pageNum}
                            variant={selectedPages.includes(pageNum) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageSelection(pageNum)}
                            className="w-12 h-8"
                          >
                            {pageNum}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-100 h-48 rounded flex items-center justify-center mb-4">
                      <FileText className="h-16 w-16 text-gray-400" />
                      <span className="ml-2 text-gray-500">PDF Preview - Page {currentPage}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">Page {currentPage} of {totalPages}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Split PDFs Preview */}
                    {splitPdfs && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium mb-2">Split PDFs Preview:</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">PDF 1 (Pages: {splitPdfs.pdf1.join(', ')})</Label>
                            <div className="bg-white h-20 rounded border flex items-center justify-center">
                              <FileText className="h-8 w-8 text-blue-500" />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">PDF 2 (Pages: {splitPdfs.pdf2.join(', ')})</Label>
                            <div className="bg-white h-20 rounded border flex items-center justify-center">
                              <FileText className="h-8 w-8 text-green-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Reference ID */}
                <div>
                  <Label htmlFor="reference-id">Reference ID *</Label>
                  <Input
                    id="reference-id"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, () => {})}
                    placeholder="Auto-filled from PDF name"
                  />
                </div>

                {/* Report Quality Tagging */}
                <div>
                  <Label className="text-base font-medium">Report Quality * (Required)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {qualityOptions.map(quality => (
                      <Button
                        key={quality}
                        variant={selectedQuality.includes(quality) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleQualityChange(quality)}
                        className="justify-start"
                      >
                        {quality}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <Label className="text-base font-medium">Service Type * (Required)</Label>
                  <div className="flex gap-2 mt-2">
                    {serviceTypeOptions.map(type => (
                      <Button
                        key={type}
                        variant={selectedServiceType === type ? "default" : "outline"}
                        onClick={() => setSelectedServiceType(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Lab Partner */}
                <div>
                  <Label>Executing Lab Partner</Label>
                  <Select value={selectedLabPartner} onValueChange={setSelectedLabPartner}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lab partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {labPartners.map(partner => (
                        <SelectItem key={partner} value={partner}>{partner}</SelectItem>
                      ))}
                      <SelectItem value="custom">Add New Partner</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedLabPartner === 'custom' && (
                    <Input
                      className="mt-2"
                      placeholder="Enter new lab partner name"
                      value={customLabPartner}
                      onChange={(e) => setCustomLabPartner(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, () => {})}
                    />
                  )}
                </div>

                {/* Expected Count */}
                <div>
                  <Label htmlFor="expected-count">Expected Count</Label>
                  <Input
                    id="expected-count"
                    type="number"
                    value={expectedCount.toString()}
                    onChange={(e) => setExpectedCount(Number(e.target.value))}
                    onKeyPress={(e) => handleKeyPress(e, () => {})}
                    placeholder="Auto-calculated for pathology"
                    readOnly={selectedServiceType === 'Pathology'}
                  />
                </div>

                {/* Delete Button */}
                <Button variant="destructive" onClick={handleDelete} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Utilization and QC Tabs */}
          <div className="space-y-4">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Utilization & QC Verification</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <Tabs defaultValue="utilization" className="h-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="utilization">Service Item Tagging</TabsTrigger>
                    <TabsTrigger value="qc">QC Verification</TabsTrigger>
                  </TabsList>

                  <TabsContent value="utilization" className="flex-1">
                    <div className="space-y-4 h-full">
                      {/* Search within Service Items */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search service items..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, () => {})}
                          className="pl-10"
                        />
                      </div>

                      <ScrollArea className="h-[calc(100vh-500px)]">
                        {selectedServiceType && (
                          <div>
                            <h3 className="font-medium mb-3">
                              Service Items ({selectedServiceType})
                            </h3>
                            {renderServiceItems()}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="qc" className="flex-1">
                    <ScrollArea className="h-[calc(100vh-500px)]">
                      <div className="space-y-6">
                        {/* Demographics Verification */}
                        <div>
                          <Label className="text-base font-medium mb-2 block">QC - Verify Demographics (Click to Eliminate)</Label>
                          <div className="space-y-2">
                            {qcDemographicItems.map(item => (
                              <Button
                                key={item}
                                variant={eliminatedDemographics.includes(item) ? "destructive" : "outline"}
                                size="sm"
                                onClick={() => handleEliminateItem(item, 'demographics')}
                                className="mr-2 mb-2"
                              >
                                {eliminatedDemographics.includes(item) && <X className="h-4 w-4 mr-1" />}
                                {item}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* QC Flags */}
                        <div>
                          <Label className="text-base font-medium mb-2 block">QC Flags (Click to Eliminate)</Label>
                          <div className="space-y-2">
                            {qcFlagItems.map(item => (
                              <Button
                                key={item}
                                variant={eliminatedFlags.includes(item) ? "destructive" : "outline"}
                                size="sm"
                                onClick={() => handleEliminateItem(item, 'flags')}
                                className="mr-2 mb-2"
                              >
                                {eliminatedFlags.includes(item) && <X className="h-4 w-4 mr-1" />}
                                {item}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Pending Items */}
                        <div>
                          <Label className="text-base font-medium mb-2 block">Pending Items</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={pendingRadiology}
                                onCheckedChange={(checked) => setPendingRadiology(checked === true)}
                              />
                              <Label>Pending Radiology</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={pendingCardiology}
                                onCheckedChange={(checked) => setPendingCardiology(checked === true)}
                              />
                              <Label>Pending Cardiology</Label>
                            </div>
                          </div>
                        </div>

                        {/* Overall QC Status */}
                        <div>
                          <Label htmlFor="qc-status">Overall QC Status</Label>
                          <Select value={qcStatus} onValueChange={setQcStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select QC status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="passed">Passed</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                              <SelectItem value="pending">Pending Review</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Comments */}
                        <div>
                          <Label htmlFor="comments">Comments</Label>
                          <Textarea
                            id="comments"
                            placeholder="Enter any additional comments..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                          />
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                {/* Auto-Save Indicator */}
                <div className="pt-4 border-t mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Auto-save enabled</span>
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Data Saved",
                          description: "All data has been saved successfully",
                        });
                      }}
                    >
                      Save Manually
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Utilization;
