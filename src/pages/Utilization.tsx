import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Search, Download, Split, FileText, ChevronLeft, ChevronRight, Trash2, X, Plus, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
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
  ]
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
const serviceTypeOptions = ["Pathology", "Other Services", "Consult"];
const labPartners = ["Apollo", "MEDI 5 Diagnostics", "Aarthi Scans", "Tata 1 MG Lab", "Prognosis Laboratory"];
const executingLabPartners = ["Lab Corp", "Quest Diagnostics", "LabTests Plus", "Sonic Healthcare", "Metropolis Healthcare"];

// Demographics and QC Flag options
const demographicOptions = ["Patient Name", "UHID (Unique Health ID)", "Age", "Gender", "Doctor Name", "Lab Details"];
const qcFlagOptions = ["Partial Report - Radiology", "Partial Report - Cardiology", "Pending Radiology", "Incorrect Demographics"];
const qcStatusOptions = ["Pending", "In Progress", "Completed", "On Hold", "Rejected"];

interface FileData {
  name: string;
  file: File;
  pages: number;
}

interface SplitSection {
  id: string;
  name: string;
  pages: number[];
  serviceType: string;
  selectedItems: Set<string>;
  pageWiseSelections: { [pageNumber: number]: Set<string> }; // New field for page-wise selections
  currentViewingPage: number; // Add current viewing page for each section
}

const Utilization = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [splitSections, setSplitSections] = useState<SplitSection[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [hoveredPage, setHoveredPage] = useState<number | null>(null); // New state for hovered page
  
  // Lab Partner Selection
  const [selectedLabPartner, setSelectedLabPartner] = useState('');
  const [selectedExecutingLabPartner, setSelectedExecutingLabPartner] = useState('');
  const [customExecutingLabPartner, setCustomExecutingLabPartner] = useState('');
  const [isLabSelectionComplete, setIsLabSelectionComplete] = useState(false);
  
  // Form data
  const [referenceId, setReferenceId] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<string[]>([]);
  
  // Demographics and QC
  const [selectedDemographics, setSelectedDemographics] = useState<Set<string>>(new Set());
  const [customDemographics, setCustomDemographics] = useState<string[]>([]);
  const [selectedQCFlags, setSelectedQCFlags] = useState<Set<string>>(new Set());
  const [customQCFlags, setCustomQCFlags] = useState<string[]>([]);
  const [qcStatus, setQcStatus] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [remarks, setRemarks] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles: FileData[] = files.map(file => ({
      name: file.name,
      file: file,
      pages: Math.floor(Math.random() * 15) + 1 // Mock page count
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    if (files.length > 0 && !referenceId) {
      setReferenceId(files[0].name.replace(/\.[^/.]+$/, ""));
    }
    if (newFiles[0]) {
      setTotalPages(newFiles[0].pages);
    }
    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) uploaded successfully`,
    });
  };

  const handleFileSelection = (index: number) => {
    setSelectedFileIndex(index);
    const selectedFile = uploadedFiles[index];
    setReferenceId(selectedFile.name.replace(/\.[^/.]+$/, ""));
    setTotalPages(selectedFile.pages);
    setCurrentPage(1);
    setSelectedPages([]);
    setSplitSections([]);
    setActiveSectionId(null);
  };

  const handlePageSelection = (pageNum: number) => {
    setSelectedPages(prev => 
      prev.includes(pageNum) 
        ? prev.filter(p => p !== pageNum)
        : [...prev, pageNum]
    );
  };

  const handleSplitSelected = () => {
    if (selectedPages.length === 0) {
      toast({
        title: "No Pages Selected",
        description: "Please select pages to split",
        variant: "destructive"
      });
      return;
    }

    const sortedPages = [...selectedPages].sort((a, b) => a - b);
    const newSection: SplitSection = {
      id: `section_${Date.now()}`,
      name: `Section ${splitSections.length + 1}`,
      pages: sortedPages,
      serviceType: '',
      selectedItems: new Set(),
      pageWiseSelections: {},
      currentViewingPage: sortedPages[0] // Set first page as current viewing page
    };

    setSplitSections(prev => [...prev, newSection]);
    setSelectedPages([]);
    setActiveSectionId(newSection.id);
    
    toast({
      title: "Section Created",
      description: `New section created with ${selectedPages.length} pages`,
    });
  };

  const handleLabSelectionComplete = () => {
    if (selectedLabPartner && (selectedExecutingLabPartner || customExecutingLabPartner)) {
      setIsLabSelectionComplete(true);
    }
  };

  const handleServiceItemToggle = (category: string, item: string) => {
    if (!activeSectionId) return;
    
    const activeSection = splitSections.find(s => s.id === activeSectionId);
    if (!activeSection) return;

    const currentPage = activeSection.currentViewingPage;
    const itemKey = `${category}-${item}`;
    
    setSplitSections(prev => prev.map(section => {
      if (section.id !== activeSectionId) return section;
      
      const updatedSection = { ...section };
      
      // Initialize page-wise selections for current page if not exists
      if (!updatedSection.pageWiseSelections[currentPage]) {
        updatedSection.pageWiseSelections[currentPage] = new Set();
      }
      
      const pageSelections = new Set(updatedSection.pageWiseSelections[currentPage]);
      
      if (pageSelections.has(itemKey)) {
        pageSelections.delete(itemKey);
      } else {
        pageSelections.add(itemKey);
      }
      
      updatedSection.pageWiseSelections[currentPage] = pageSelections;
      
      // Update overall selectedItems based on all page selections
      const allSelectedItems = new Set<string>();
      Object.values(updatedSection.pageWiseSelections).forEach(pageSet => {
        pageSet.forEach(item => allSelectedItems.add(item));
      });
      updatedSection.selectedItems = allSelectedItems;
      
      return updatedSection;
    }));
  };

  const handleCategoryToggle = (category: string) => {
    if (!activeSectionId) return;
    
    const activeSection = splitSections.find(s => s.id === activeSectionId);
    if (!activeSection || !activeSection.serviceType) return;

    const currentPage = activeSection.currentViewingPage;
    const currentServices = activeSection.serviceType === 'Pathology' ? pathologyServices : otherServices;
    const categoryItems = currentServices[category] || [];
    
    // Check if all items in this category are already selected for current page
    const currentPageSelections = activeSection.pageWiseSelections[currentPage] || new Set();
    const allCategoryItemsSelected = categoryItems.every(item => 
      currentPageSelections.has(`${category}-${item}`)
    );

    setSplitSections(prev => prev.map(section => {
      if (section.id !== activeSectionId) return section;
      
      const updatedSection = { ...section };
      
      // Initialize page-wise selections for current page if not exists
      if (!updatedSection.pageWiseSelections[currentPage]) {
        updatedSection.pageWiseSelections[currentPage] = new Set();
      }
      
      const pageSelections = new Set(updatedSection.pageWiseSelections[currentPage]);
      
      if (allCategoryItemsSelected) {
        // If all are selected, deselect all
        categoryItems.forEach(item => {
          pageSelections.delete(`${category}-${item}`);
        });
      } else {
        // If not all are selected, select all
        categoryItems.forEach(item => {
          pageSelections.add(`${category}-${item}`);
        });
      }
      
      updatedSection.pageWiseSelections[currentPage] = pageSelections;
      
      // Update overall selectedItems based on all page selections
      const allSelectedItems = new Set<string>();
      Object.values(updatedSection.pageWiseSelections).forEach(pageSet => {
        pageSet.forEach(item => allSelectedItems.add(item));
      });
      updatedSection.selectedItems = allSelectedItems;
      
      return updatedSection;
    }));
  };

  // Add function to handle page navigation within a section
  const handleSectionPageChange = (direction: 'prev' | 'next') => {
    if (!activeSectionId) return;
    
    setSplitSections(prev => prev.map(section => {
      if (section.id !== activeSectionId) return section;
      
      const currentIndex = section.pages.indexOf(section.currentViewingPage);
      let newIndex = currentIndex;
      
      if (direction === 'next' && currentIndex < section.pages.length - 1) {
        newIndex = currentIndex + 1;
      } else if (direction === 'prev' && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }
      
      return {
        ...section,
        currentViewingPage: section.pages[newIndex]
      };
    }));
  };

  const renderServiceChips = () => {
    if (!activeSectionId) return null;
    
    const activeSection = splitSections.find(s => s.id === activeSectionId);
    if (!activeSection || !activeSection.serviceType) return null;

    const currentPage = activeSection.currentViewingPage;
    const currentPageSelections = activeSection.pageWiseSelections[currentPage] || new Set();
    const currentServices = activeSection.serviceType === 'Pathology' ? pathologyServices : otherServices;
    
    return (
      <div className="space-y-4">
        {/* Current Page Display with Navigation */}
        <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label className="text-base font-semibold text-blue-600">
                Tagging Page {currentPage}
              </Label>
              <Badge variant="default" className="bg-blue-600">
                {currentPageSelections.size} items selected
              </Badge>
            </div>
            
            {/* Page Navigation for Section */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSectionPageChange('prev')}
                disabled={activeSection.pages.indexOf(currentPage) === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2">
                {activeSection.pages.indexOf(currentPage) + 1} of {activeSection.pages.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSectionPageChange('next')}
                disabled={activeSection.pages.indexOf(currentPage) === activeSection.pages.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Expected Count Display */}
        {activeSection.selectedItems.size > 0 && (
          <div className="p-3 bg-green-50 border-2 border-green-200 rounded-md">
            <Label className="text-base font-semibold text-green-600 flex items-center gap-2">
              Total Expected Count: {activeSection.selectedItems.size}
              <Badge variant="default" className="bg-green-600">
                {activeSection.selectedItems.size} items across all pages
              </Badge>
            </Label>
            <div className="mt-2 text-sm text-gray-600">
              Page breakdown: {activeSection.pages.map(pageNum => {
                const pageSelections = activeSection.pageWiseSelections[pageNum] || new Set();
                return `Page ${pageNum}: ${pageSelections.size}`;
              }).join(', ')}
            </div>
          </div>
        )}

        <Accordion type="single" collapsible className="w-full">
          {Object.entries(currentServices).map(([category, items]) => {
            const categoryItemsSelected = items.filter(item => currentPageSelections.has(`${category}-${item}`)).length;
            const allCategoryItemsSelected = categoryItemsSelected === items.length;
            
            return (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center justify-between w-full mr-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryToggle(category);
                        }}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          allCategoryItemsSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {allCategoryItemsSelected ? 'Deselect All' : 'Select All'}
                      </button>
                      <span>{category}</span>
                    </div>
                    <Badge variant="secondary">
                      {categoryItemsSelected}/{items.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-32">
                    <div className="flex flex-wrap gap-2 p-2">
                      {items.map(item => {
                        const itemKey = `${category}-${item}`;
                        const isSelected = currentPageSelections.has(itemKey);
                        return (
                          <Badge
                            key={item}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer hover:bg-primary/80 transition-colors"
                            onClick={() => handleServiceItemToggle(category, item)}
                          >
                            {item}
                            {isSelected && <X className="h-3 w-3 ml-1" />}
                          </Badge>
                        );
                      })}
                    </div>
                    <div className="mt-2 p-2 border-t">
                      <div className="text-xs text-gray-500 mb-1">Selected items for page {currentPage}:</div>
                      <div className="flex flex-wrap gap-1">
                        {items.filter(item => currentPageSelections.has(`${category}-${item}`)).map(item => (
                          <Badge key={item} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  };

  const renderDemographicsChips = () => {
    return (
      <div className="space-y-4">
        <div className="p-3 border-2 border-red-200 rounded-md bg-red-50">
          <Label className="text-base font-semibold text-red-600 mb-3 block">
            Verify Demographics *
          </Label>
          <p className="text-sm text-gray-600 mb-3">Click items to eliminate from verification</p>
          <div className="flex flex-wrap gap-2">
            {demographicOptions.map(demo => (
              <Badge
                key={demo}
                variant={selectedDemographics.has(demo) ? "destructive" : "outline"}
                className="cursor-pointer hover:bg-destructive/80 transition-colors"
                onClick={() => handleDemographicToggle(demo)}
              >
                {demo}
                {selectedDemographics.has(demo) ? <X className="h-3 w-3 ml-1" /> : <Plus className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
            {customDemographics.map(demo => (
              <Badge
                key={demo}
                variant={selectedDemographics.has(demo) ? "destructive" : "outline"}
                className="cursor-pointer"
                onClick={() => handleDemographicToggle(demo)}
              >
                {demo}
                {selectedDemographics.has(demo) ? <X className="h-3 w-3 ml-1" /> : <Plus className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <Input
              placeholder="Add custom demographic..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCustomDemographic(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const input = document.querySelector('input[placeholder="Add custom demographic..."]') as HTMLInputElement;
                if (input) {
                  handleAddCustomDemographic(input.value);
                  input.value = '';
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* QC Summary */}
        <div className="p-3 bg-gray-50 border rounded-md">
          <h4 className="font-semibold text-gray-800 mb-2">QC Summary</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Demographics Verified: {demographicOptions.length + customDemographics.length - selectedDemographics.size}/{demographicOptions.length + customDemographics.length}</div>
            <div>Flags Raised: {selectedQCFlags.size}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderQCFlagsChips = () => {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {qcFlagOptions.map(flag => (
            <Badge
              key={flag}
              variant={selectedQCFlags.has(flag) ? "destructive" : "outline"}
              className="cursor-pointer hover:bg-destructive/80 transition-colors"
              onClick={() => handleQCFlagToggle(flag)}
            >
              {flag}
              {selectedQCFlags.has(flag) ? <X className="h-3 w-3 ml-1" /> : <Plus className="h-3 w-3 ml-1" />}
            </Badge>
          ))}
          {customQCFlags.map(flag => (
            <Badge
              key={flag}
              variant="destructive"
              className="cursor-pointer"
              onClick={() => handleQCFlagToggle(flag)}
            >
              {flag}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add custom QC flag..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddCustomQCFlag(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.querySelector('input[placeholder="Add custom QC flag..."]') as HTMLInputElement;
              if (input) {
                handleAddCustomQCFlag(input.value);
                input.value = '';
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Utilization/Tagging Phase (Pre-Digitization)</h1>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - PDF Upload and Preview */}
          <div className="col-span-8">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Enhanced PDF Preview & Management
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
                        Upload PDF Reports (Pathology, Radiology, Mixed Services)
                      </p>
                      <p className="text-xs text-gray-500">Supports bulk upload</p>
                    </div>
                  </label>
                </div>

                {/* File Selection */}
                {uploadedFiles.length > 1 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Select File to Process:</Label>
                    <ScrollArea className="h-24">
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <Button
                            key={index}
                            variant={selectedFileIndex === index ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFileSelection(index)}
                            className="w-full justify-start text-left"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            <span className="truncate">{file.name}</span>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Enhanced PDF Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="border rounded-lg flex-1 flex flex-col">
                    {/* PDF Controls */}
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleZoom('out')}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">{zoomLevel}%</span>
                        <Button variant="outline" size="sm" onClick={() => handleZoom('in')}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedPages.length > 0 && (
                          <Button variant="outline" size="sm" onClick={handleSplitSelected}>
                            <Split className="h-4 w-4 mr-1" />
                            Split Selected ({selectedPages.length})
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Page Grid Selection */}
                    <div className="p-4 flex-1">
                      <Label className="text-sm font-medium mb-3 block">
                        Select Pages to Group into Sections:
                      </Label>
                      <ScrollArea className="h-64">
                        <div className="grid grid-cols-4 gap-3">
                          {Array.from({length: totalPages}, (_, i) => i + 1).map(pageNum => (
                            <div
                              key={pageNum}
                              className={`relative cursor-pointer border-2 rounded-lg p-3 transition-all ${
                                selectedPages.includes(pageNum) 
                                  ? "border-blue-500 bg-blue-50" 
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => handlePageSelection(pageNum)}
                            >
                              <div className="bg-white h-24 rounded border flex flex-col items-center justify-center shadow-sm">
                                <FileText className="h-8 w-8 text-gray-400 mb-1" />
                                <div className="text-xs text-gray-500 font-medium">Page {pageNum}</div>
                              </div>
                              {selectedPages.includes(pageNum) && (
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                  ✓
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Current Page Preview */}
                    <div className="p-4 border-t">
                      <div 
                        className="bg-white rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center shadow-inner"
                        style={{ height: `${200 * (zoomLevel / 100)}px` }}
                      >
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <span className="text-gray-500 text-xl font-medium">
                            Page {currentPage} Preview
                          </span>
                          <div className="mt-2 text-sm text-blue-600 font-medium">
                            Zoom: {zoomLevel}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Split Sections Preview */}
                    {splitSections.length > 0 && (
                      <div className="p-4 border-t bg-gray-50">
                        <Label className="text-sm font-medium mb-3 block">Created Sections:</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {splitSections.map(section => (
                            <div
                              key={section.id}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                activeSectionId === section.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                              onClick={() => setActiveSectionId(section.id)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Label className="font-medium cursor-pointer">{section.name}</Label>
                                {activeSectionId === section.id && (
                                  <Badge variant="default" className="text-xs">Active</Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                Pages: {section.pages.join(', ')}
                              </div>
                              <div className="text-xs text-gray-500">
                                Service: {section.serviceType || 'Not selected'}
                              </div>
                              <div className="text-xs text-gray-500">
                                Items: {section.selectedItems.size}
                              </div>
                              <div className="text-xs text-blue-600 font-medium">
                                Current: Page {section.currentViewingPage}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Delete Button */}
                <Button variant="destructive" onClick={() => {
                  setUploadedFiles([]);
                  setSplitSections([]);
                  setActiveSectionId(null);
                }} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Enhanced Form and Tagging */}
          <div className="col-span-4 flex flex-col gap-4">
            {/* Lab Partner Selection */}
            {!isLabSelectionComplete && (
              <Card>
                <CardHeader>
                  <CardTitle>Lab Partner Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Lab Partner *</Label>
                    <Select value={selectedLabPartner} onValueChange={setSelectedLabPartner}>
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
                    <Label>Executing Lab Partner *</Label>
                    <Select value={selectedExecutingLabPartner} onValueChange={setSelectedExecutingLabPartner}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select executing lab partner" />
                      </SelectTrigger>
                      <SelectContent>
                        {executingLabPartners.map(partner => (
                          <SelectItem key={partner} value={partner}>{partner}</SelectItem>
                        ))}
                        <SelectItem value="custom">Add New Partner</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedExecutingLabPartner === 'custom' && (
                      <Input
                        className="mt-2"
                        placeholder="Enter new executing lab partner name"
                        value={customExecutingLabPartner}
                        onChange={(e) => setCustomExecutingLabPartner(e.target.value)}
                      />
                    )}
                  </div>

                  <Button 
                    onClick={handleLabSelectionComplete}
                    disabled={!selectedLabPartner || (!selectedExecutingLabPartner && !customExecutingLabPartner)}
                    className="w-full"
                  >
                    Continue to Utilization Tagging
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Form Fields - Collapsed when lab selection complete */}
            {isLabSelectionComplete && (
              <Card className="transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Report Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="reference-id" className="text-sm">Reference ID</Label>
                      <Input
                        id="reference-id"
                        value={referenceId}
                        onChange={(e) => setReferenceId(e.target.value)}
                        placeholder="Auto-filled"
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-red-600">
                        Quality *
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1 p-2 border-2 border-red-200 rounded-md bg-red-50">
                        {qualityOptions.map(quality => (
                          <Badge
                            key={quality}
                            variant={selectedQuality.includes(quality) ? "default" : "outline"}
                            className="text-xs cursor-pointer"
                            onClick={() => setSelectedQuality(prev => 
                              prev.includes(quality) 
                                ? prev.filter(q => q !== quality)
                                : [...prev, quality]
                            )}
                          >
                            {quality}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Type and Utilization - Only show when lab selection is complete */}
            {isLabSelectionComplete && activeSectionId && (
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Utilization Tagging
                    <Badge variant="outline" className="text-xs">
                      {splitSections.find(s => s.id === activeSectionId)?.name}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <Tabs defaultValue="service" className="h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="service">Service Type</TabsTrigger>
                      <TabsTrigger value="qc-verification" className="font-semibold text-red-600">
                        QC Verification *
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="service" className="flex-1 h-0">
                      <div className="space-y-4 h-full flex flex-col">
                        {/* Service Type Selection */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Service Type *</Label>
                          <div className="flex gap-2">
                            {serviceTypeOptions.map(type => {
                              const activeSection = splitSections.find(s => s.id === activeSectionId);
                              return (
                                <Button
                                  key={type}
                                  variant={activeSection?.serviceType === type ? "default" : "outline"}
                                  onClick={() => {
                                    setSplitSections(prev => prev.map(section => 
                                      section.id === activeSectionId 
                                        ? { ...section, serviceType: type }
                                        : section
                                    ));
                                  }}
                                  size="sm"
                                >
                                  {type}
                                </Button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search utilization items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        {/* Enhanced Chip-based Utilization */}
                        <ScrollArea className="flex-1">
                          {renderServiceChips()}
                        </ScrollArea>
                      </div>
                    </TabsContent>

                    <TabsContent value="qc-verification" className="flex-1 h-0">
                      <ScrollArea className="h-full">
                        <div className="space-y-6">
                          {/* Demographics Section */}
                          {renderDemographicsChips()}

                          <div>
                            <Label className="text-base font-medium mb-2 block">Report Date</Label>
                            <Input
                              type="date"
                              value={reportDate}
                              onChange={(e) => setReportDate(e.target.value)}
                              placeholder="Select report date"
                            />
                          </div>

                          <div className="p-3 border-2 border-red-200 rounded-md bg-red-50">
                            <Label className="text-base font-semibold text-red-600 flex items-center gap-2 mb-3">
                              QC Flags *
                            </Label>
                            {renderQCFlagsChips()}
                          </div>

                          <div className="p-3 border-2 border-red-200 rounded-md bg-red-50">
                            <Label className="text-base font-semibold text-red-600 flex items-center gap-2 mb-3">
                              QC Status *
                            </Label>
                            <Select value={qcStatus} onValueChange={setQcStatus}>
                              <SelectTrigger className="border-red-300">
                                <SelectValue placeholder="Select QC status" />
                              </SelectTrigger>
                              <SelectContent>
                                {qcStatusOptions.map(status => (
                                  <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-base font-medium mb-2 block">Remarks & Notes</Label>
                            <Textarea
                              placeholder="Enter system notes or operational details..."
                              value={remarks}
                              onChange={(e) => setRemarks(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* No Active Section Message */}
            {isLabSelectionComplete && !activeSectionId && splitSections.length === 0 && (
              <Card className="flex-1">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <Split className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Upload a PDF and create sections to begin tagging</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLabSelectionComplete && splitSections.length > 0 && !activeSectionId && (
              <Card className="flex-1">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a section from the left panel to begin tagging</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Utilization;
