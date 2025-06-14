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
import { Upload, Search, Download, Split, FileText, ChevronLeft, ChevronRight, Trash2, X, Tag } from 'lucide-react';
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
const serviceTypeOptions = ["Pathology", "Other Services", "Consult"];
const labPartners = ["Apollo", "MEDI 5 Diagnostics", "Aarthi Scans", "Tata 1 MG Lab", "Prognosis Laboratory"];

// QC Demographics and Flags
const qcDemographicItems = ["Patient Name", "UHID (Unique Health ID)", "Age", "Gender", "Doctor Name", "Report Date", "Lab Details"];
const qcFlagItems = ["Partial Report - Radiology", "Partial Report - Cardiology", "Pending Radiology", "Incorrect Demographics"];

interface FileData {
  name: string;
  file: File;
  pages: number;
}

interface PageUtilization {
  serviceType: string;
  selectedItems: Record<string, boolean>;
  expectedCount: number;
  comments: string;
}

interface SplitPdfData {
  pdf1: {
    pages: number[];
    referenceId: string;
    serviceType: string;
    expectedCount: number;
    selectedItems: Record<string, boolean>;
    comments: string;
    pageUtilization: Record<number, PageUtilization>;
  };
  pdf2: {
    pages: number[];
    referenceId: string;
    serviceType: string;
    expectedCount: number;
    selectedItems: Record<string, boolean>;
    comments: string;
    pageUtilization: Record<number, PageUtilization>;
  };
}

const Utilization = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [splitPdfs, setSplitPdfs] = useState<SplitPdfData | null>(null);
  const [selectedPdfForTagging, setSelectedPdfForTagging] = useState<'pdf1' | 'pdf2' | null>(null);
  const [isPageWiseTagging, setIsPageWiseTagging] = useState(false);
  
  // Shared fields between both PDFs
  const [selectedQuality, setSelectedQuality] = useState<string[]>([]);
  const [selectedLabPartner, setSelectedLabPartner] = useState('');
  const [customLabPartner, setCustomLabPartner] = useState('');
  
  // Current active data (either main or selected split PDF)
  const [referenceId, setReferenceId] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expectedCount, setExpectedCount] = useState(0);
  const [comments, setComments] = useState('');
  const [eliminatedDemographics, setEliminatedDemographics] = useState<string[]>([]);
  const [eliminatedFlags, setEliminatedFlags] = useState<string[]>([]);
  const [qcStatus, setQcStatus] = useState('');
  const { toast } = useToast();

  // Check if mandatory fields are filled
  const isMandatoryFieldsFilled = () => {
    return selectedQuality.length > 0 && selectedServiceType && selectedLabPartner;
  };

  // Check if at least one utilization item is selected
  const hasUtilizationSelected = () => {
    if (selectedServiceType === 'Consult') return true; // Consult doesn't need utilization items
    if (isPageWiseTagging && splitPdfs && selectedPdfForTagging) {
      const currentPdf = splitPdfs[selectedPdfForTagging];
      const currentPageUtilization = currentPdf.pageUtilization[currentPage];
      return currentPageUtilization ? Object.values(currentPageUtilization.selectedItems).some(Boolean) : false;
    }
    return Object.values(selectedItems).some(Boolean);
  };

  // Check if demographics verification has been started
  const isDemographicsStarted = () => {
    return eliminatedDemographics.length > 0;
  };

  const getCurrentPdfData = () => {
    if (splitPdfs && selectedPdfForTagging) {
      if (isPageWiseTagging) {
        const currentPdf = splitPdfs[selectedPdfForTagging];
        const pageUtilization = currentPdf.pageUtilization[currentPage];
        return {
          referenceId: currentPdf.referenceId,
          serviceType: pageUtilization?.serviceType || currentPdf.serviceType,
          expectedCount: pageUtilization?.expectedCount || 0,
          selectedItems: pageUtilization?.selectedItems || {},
          comments: pageUtilization?.comments || ''
        };
      }
      return splitPdfs[selectedPdfForTagging];
    }
    return {
      referenceId,
      serviceType: selectedServiceType,
      expectedCount,
      selectedItems,
      comments
    };
  };

  const updateCurrentPdfData = (updates: Partial<any>) => {
    if (splitPdfs && selectedPdfForTagging) {
      if (isPageWiseTagging) {
        // Update page-specific utilization
        setSplitPdfs(prev => {
          if (!prev) return null;
          const currentPdf = prev[selectedPdfForTagging];
          const updatedPageUtilization = {
            ...currentPdf.pageUtilization,
            [currentPage]: {
              ...currentPdf.pageUtilization[currentPage],
              ...updates
            }
          };
          return {
            ...prev,
            [selectedPdfForTagging]: {
              ...currentPdf,
              pageUtilization: updatedPageUtilization
            }
          };
        });
      } else {
        // Update PDF-level data
        setSplitPdfs(prev => prev ? {
          ...prev,
          [selectedPdfForTagging]: {
            ...prev[selectedPdfForTagging],
            ...updates
          }
        } : null);
      }
    } else {
      // Update main data
      Object.entries(updates).forEach(([key, value]) => {
        switch (key) {
          case 'referenceId': setReferenceId(value); break;
          case 'serviceType': setSelectedServiceType(value); break;
          case 'expectedCount': setExpectedCount(value); break;
          case 'selectedItems': setSelectedItems(value); break;
          case 'comments': setComments(value); break;
        }
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles: FileData[] = files.map(file => ({
      name: file.name,
      file: file,
      pages: Math.floor(Math.random() * 10) + 1 // Mock page count
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Set first file as reference ID if none exists
    if (files.length > 0 && !referenceId) {
      setReferenceId(files[0].name.replace(/\.[^/.]+$/, ""));
    }
    setTotalPages(newFiles[0]?.pages || 1);
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
    setSplitPdfs(null);
    setSelectedPdfForTagging(null);
    setIsPageWiseTagging(false);
    
    // Reset form data for new file
    setSelectedServiceType('');
    setSelectedItems({});
    setExpectedCount(0);
    setComments('');
    setEliminatedDemographics([]);
    setEliminatedFlags([]);
    setQcStatus('');
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
    const pdf1Pages = selectedPages.sort((a, b) => a - b);
    const pdf2Pages = allPages.filter(p => !selectedPages.includes(p));
    
    const splitData: SplitPdfData = {
      pdf1: {
        pages: pdf1Pages,
        referenceId: referenceId + '_part1',
        serviceType: '',
        expectedCount: 0,
        selectedItems: {},
        comments: '',
        pageUtilization: {}
      },
      pdf2: {
        pages: pdf2Pages,
        referenceId: referenceId + '_part2',
        serviceType: '',
        expectedCount: 0,
        selectedItems: {},
        comments: '',
        pageUtilization: {}
      }
    };

    setSplitPdfs(splitData);
    setSelectedPages([]);
    setSelectedPdfForTagging('pdf1'); // Default to first PDF
    
    // Clear main data except shared fields (quality and lab partner remain)
    setSelectedServiceType('');
    setExpectedCount(0);
    setSelectedItems({});
    setComments('');
    
    toast({
      title: "PDF Split Successfully",
      description: `Split into PDF 1 (${pdf1Pages.length} pages) and PDF 2 (${pdf2Pages.length} pages)`,
    });
  };

  const handlePdfSelection = (pdfKey: 'pdf1' | 'pdf2') => {
    if (!splitPdfs) return;
    
    setSelectedPdfForTagging(pdfKey);
    const pdfData = splitPdfs[pdfKey];
    
    // Set current page to first page of selected PDF
    setCurrentPage(pdfData.pages[0]);
    
    // Load PDF-specific data (quality and lab partner remain shared)
    setReferenceId(pdfData.referenceId);
    setSelectedServiceType(pdfData.serviceType);
    setExpectedCount(pdfData.expectedCount);
    setSelectedItems(pdfData.selectedItems);
    setComments(pdfData.comments);
    
    // Enable page-wise tagging for split PDFs
    setIsPageWiseTagging(true);
  };

  const handlePageNavigation = (direction: 'prev' | 'next') => {
    if (!splitPdfs || !selectedPdfForTagging) {
      // Regular navigation for non-split PDFs
      if (direction === 'prev') {
        setCurrentPage(Math.max(1, currentPage - 1));
      } else {
        setCurrentPage(Math.min(totalPages, currentPage + 1));
      }
      return;
    }

    const currentPdf = splitPdfs[selectedPdfForTagging];
    const currentIndex = currentPdf.pages.indexOf(currentPage);
    
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentPage(currentPdf.pages[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < currentPdf.pages.length - 1) {
      setCurrentPage(currentPdf.pages[currentIndex + 1]);
    }
  };

  const getNavigationLimits = () => {
    if (!splitPdfs || !selectedPdfForTagging) {
      return { isFirst: currentPage === 1, isLast: currentPage === totalPages };
    }
    
    const currentPdf = splitPdfs[selectedPdfForTagging];
    const currentIndex = currentPdf.pages.indexOf(currentPage);
    return {
      isFirst: currentIndex === 0,
      isLast: currentIndex === currentPdf.pages.length - 1
    };
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
    const currentData = getCurrentPdfData();
    const newSelected = !currentData.selectedItems[key];
    
    const newSelectedItems = {
      ...currentData.selectedItems,
      [key]: newSelected
    };

    // Auto-increment expected count for pathology items
    let newExpectedCount = currentData.expectedCount;
    if (currentData.serviceType === 'Pathology' && newSelected) {
      newExpectedCount = currentData.expectedCount + 1;
    } else if (currentData.serviceType === 'Pathology' && !newSelected) {
      newExpectedCount = Math.max(0, currentData.expectedCount - 1);
    }

    // Auto-select parent category if any child is selected
    const currentServices = currentData.serviceType === 'Pathology' ? pathologyServices : otherServices;
    const categoryItems = currentServices[category] || [];
    const hasAnySelected = categoryItems.some(childItem => newSelectedItems[`${category}-${childItem}`]);
    
    // Update parent category selection based on children
    if (hasAnySelected && !newSelectedItems[category]) {
      newSelectedItems[category] = true;
    } else if (!hasAnySelected && newSelectedItems[category]) {
      newSelectedItems[category] = false;
    }
    
    updateCurrentPdfData({ 
      selectedItems: newSelectedItems,
      expectedCount: newExpectedCount
    });
  };

  const handleCategoryToggle = (category: string) => {
    const currentData = getCurrentPdfData();
    const currentServices = currentData.serviceType === 'Pathology' ? pathologyServices : otherServices;
    const categoryItems = currentServices[category] || [];
    const allSelected = categoryItems.every(item => currentData.selectedItems[`${category}-${item}`]);
    
    const newSelectedItems = { ...currentData.selectedItems };
    let expectedCountChange = 0;
    
    // Toggle category header
    newSelectedItems[category] = !allSelected;
    
    // Toggle all items in category
    categoryItems.forEach(item => {
      const key = `${category}-${item}`;
      const newValue = !allSelected;
      const oldValue = currentData.selectedItems[key];
      newSelectedItems[key] = newValue;
      
      // Update expected count for pathology
      if (currentData.serviceType === 'Pathology') {
        if (newValue && !oldValue) {
          expectedCountChange += 1;
        } else if (!newValue && oldValue) {
          expectedCountChange -= 1;
        }
      }
    });
    
    updateCurrentPdfData({ 
      selectedItems: newSelectedItems,
      expectedCount: Math.max(0, currentData.expectedCount + expectedCountChange)
    });
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
    setSelectedFileIndex(0);
    setReferenceId('');
    setSelectedQuality([]);
    setSelectedServiceType('');
    setSelectedItems({});
    setExpectedCount(0);
    setSplitPdfs(null);
    setSelectedPages([]);
    setSelectedLabPartner('');
    setCustomLabPartner('');
    setIsPageWiseTagging(false);
    toast({
      title: "Data Cleared",
      description: "All data has been cleared",
    });
  };

  const filteredServices = () => {
    const currentData = getCurrentPdfData();
    const currentServices = currentData.serviceType === 'Pathology' ? pathologyServices : otherServices;
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
    const currentData = getCurrentPdfData();
    
    // For Consult, show a message that no utilization items are needed
    if (currentData.serviceType === 'Consult') {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No utilization items required for Consult service type.</p>
        </div>
      );
    }

    const services = filteredServices();
    
    return Object.entries(services).map(([category, items]) => {
      const categoryItemIds = items.map(item => `${category}-${item}`);
      const selectedCount = categoryItemIds.filter(id => currentData.selectedItems[id]).length;
      const hasAnySelected = selectedCount > 0;

      return (
        <div key={category} className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              checked={hasAnySelected}
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
                  checked={currentData.selectedItems[`${category}-${item}`] || false}
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

  const { isFirst, isLast } = getNavigationLimits();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Utilization/Tagging Phase (Pre-Digitization)</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - PDF Upload and Preview */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  PDF Upload & Preview
                  {isPageWiseTagging && (
                    <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      <Tag className="h-3 w-3 inline mr-1" />
                      Page-wise Tagging
                    </span>
                  )}
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

                {/* Bulk Upload Reference ID Selection */}
                {uploadedFiles.length > 1 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Select Reference ID to Process:</Label>
                    <ScrollArea className="h-32">
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

                {/* PDF Preview and Controls */}
                {uploadedFiles.length > 0 && (
                  <div className="border rounded-lg p-4 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">PDF Preview</h3>
                      <div className="flex items-center gap-2">
                        {!splitPdfs && (
                          <Button variant="outline" size="sm" onClick={handleSplitPdf} disabled={selectedPages.length === 0}>
                            <Split className="h-4 w-4 mr-1" />
                            Split Selected
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Page Selection for Splitting - Only show if not split yet */}
                    {!splitPdfs && (
                      <div className="mb-4">
                        <Label className="text-sm font-medium mb-2 block">Select Pages to Split:</Label>
                        <ScrollArea className="h-48">
                          <div className="grid grid-cols-3 gap-2 p-2">
                            {Array.from({length: totalPages}, (_, i) => i + 1).map(pageNum => (
                              <div
                                key={pageNum}
                                className={`relative cursor-pointer border-2 rounded-lg p-2 transition-all ${
                                  selectedPages.includes(pageNum) 
                                    ? "border-blue-500 bg-blue-50" 
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => handlePageSelection(pageNum)}
                              >
                                <div className="bg-white h-20 rounded border flex flex-col items-center justify-center p-2">
                                  <FileText className="h-6 w-6 text-gray-400 mb-1" />
                                  <div className="text-xs text-gray-500">{pageNum}</div>
                                </div>
                                {selectedPages.includes(pageNum) && (
                                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                    ✓
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    {/* Current Page Preview */}
                    <div className="bg-gray-100 h-48 rounded flex items-center justify-center mb-4 border">
                      <div className="text-center bg-white p-8 rounded shadow-sm border">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <span className="text-gray-500 text-lg font-medium">
                          Page {currentPage}
                          {isPageWiseTagging && (
                            <span className="block text-sm text-blue-600 mt-1">
                              <Tag className="h-3 w-3 inline mr-1" />
                              Individual tagging enabled
                            </span>
                          )}
                        </span>
                        <div className="mt-4 space-y-2">
                          <div className="w-32 h-2 bg-gray-200 rounded mx-auto"></div>
                          <div className="w-24 h-2 bg-gray-200 rounded mx-auto"></div>
                          <div className="w-28 h-2 bg-gray-200 rounded mx-auto"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageNavigation('prev')}
                        disabled={isFirst}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {splitPdfs && selectedPdfForTagging ? splitPdfs[selectedPdfForTagging].pages.length : totalPages}
                        {splitPdfs && selectedPdfForTagging && (
                          <span className="text-xs text-gray-500 block">
                            ({splitPdfs[selectedPdfForTagging].pages.join(', ')})
                          </span>
                        )}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageNavigation('next')}
                        disabled={isLast}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Split PDFs Preview and Selection */}
                    {splitPdfs && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium mb-2">Select PDF to tag:</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div 
                            className={`cursor-pointer p-3 rounded border-2 transition-all ${
                              selectedPdfForTagging === 'pdf1' 
                                ? 'border-blue-500 bg-blue-100' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handlePdfSelection('pdf1')}
                          >
                            <Label className="text-sm font-medium cursor-pointer">PDF 1 (Pages: {splitPdfs.pdf1.pages.join(', ')})</Label>
                            <div className="bg-white h-16 rounded border flex items-center justify-center mt-2">
                              <FileText className="h-6 w-6 text-blue-500" />
                            </div>
                            {selectedPdfForTagging === 'pdf1' && (
                              <div className="text-xs text-blue-600 mt-1 font-medium">Selected</div>
                            )}
                          </div>
                          <div 
                            className={`cursor-pointer p-3 rounded border-2 transition-all ${
                              selectedPdfForTagging === 'pdf2' 
                                ? 'border-blue-500 bg-blue-100' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handlePdfSelection('pdf2')}
                          >
                            <Label className="text-sm font-medium cursor-pointer">PDF 2 (Pages: {splitPdfs.pdf2.pages.join(', ')})</Label>
                            <div className="bg-white h-16 rounded border flex items-center justify-center mt-2">
                              <FileText className="h-6 w-6 text-green-500" />
                            </div>
                            {selectedPdfForTagging === 'pdf2' && (
                              <div className="text-xs text-blue-600 mt-1 font-medium">Selected</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Delete Button */}
                <Button variant="destructive" onClick={handleDelete} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Form Fields and Utilization */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Top Right - Form Fields */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Report Details
                  {isPageWiseTagging && (
                    <span className="text-sm font-normal text-blue-600 block">
                      Page {currentPage} individual tagging
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Reference ID */}
                  <div>
                    <Label htmlFor="reference-id">Reference ID</Label>
                    <Input
                      id="reference-id"
                      value={getCurrentPdfData().referenceId}
                      onChange={(e) => updateCurrentPdfData({referenceId: e.target.value})}
                      placeholder="Auto-filled from PDF name"
                    />
                  </div>

                  {/* Expected Count */}
                  <div>
                    <Label htmlFor="expected-count">Expected Count</Label>
                    <Input
                      id="expected-count"
                      type="number"
                      value={getCurrentPdfData().expectedCount.toString()}
                      onChange={(e) => updateCurrentPdfData({expectedCount: Number(e.target.value)})}
                      placeholder="Auto-calculated for pathology"
                      readOnly={getCurrentPdfData().serviceType === 'Pathology'}
                    />
                  </div>
                </div>

                {/* Report Quality */}
                <div>
                  <Label className="text-base font-medium">Report Quality *</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
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
                  {selectedQuality.length === 0 && (
                    <p className="text-sm text-gray-600 mt-1">Please select at least one quality option</p>
                  )}
                </div>

                {/* Service Type */}
                <div>
                  <Label className="text-base font-medium">Service Type *</Label>
                  <div className="flex gap-2 mt-2">
                    {serviceTypeOptions.map(type => {
                      const currentData = getCurrentPdfData();
                      return (
                        <Button
                          key={type}
                          variant={currentData.serviceType === type ? "default" : "outline"}
                          onClick={() => updateCurrentPdfData({serviceType: type})}
                        >
                          {type}
                        </Button>
                      );
                    })}
                  </div>
                  {!getCurrentPdfData().serviceType && (
                    <p className="text-sm text-gray-600 mt-1">Please select a service type</p>
                  )}
                </div>

                {/* Lab Partner */}
                <div>
                  <Label>Executing Lab Partner *</Label>
                  <Select 
                    value={selectedLabPartner} 
                    onValueChange={(value) => setSelectedLabPartner(value)}
                  >
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
                    />
                  )}
                  {!selectedLabPartner && (
                    <p className="text-sm text-gray-600 mt-1">Please select a lab partner</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Right - Utilization & QC */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Utilization & QC Verification</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <Tabs defaultValue="utilization" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="utilization" disabled={!isMandatoryFieldsFilled()}>
                      Utilization Tagging *
                      {!isMandatoryFieldsFilled() && <span className="ml-2 text-xs text-gray-500">(Pending)</span>}
                    </TabsTrigger>
                    <TabsTrigger value="qc" disabled={!isMandatoryFieldsFilled() || !hasUtilizationSelected()}>
                      QC Verification
                      {(!isMandatoryFieldsFilled() || !hasUtilizationSelected()) && <span className="ml-2 text-xs text-gray-500">(Pending)</span>}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="utilization" className="flex-1 h-0">
                    {!isMandatoryFieldsFilled() ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-lg font-medium text-gray-500 mb-2">Pending</div>
                          <p className="text-sm text-gray-400">Please fill all mandatory fields to continue</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 h-full flex flex-col">
                        {/* Search within Utilization Items - Only show for non-Consult types */}
                        {getCurrentPdfData().serviceType && getCurrentPdfData().serviceType !== 'Consult' && (
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Search utilization items..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        )}

                        <ScrollArea className="flex-1">
                          {getCurrentPdfData().serviceType && (
                            <div>
                              <h3 className="font-medium mb-3">
                                Utilization ({getCurrentPdfData().serviceType}) *
                                {isPageWiseTagging && (
                                  <span className="text-sm font-normal text-blue-600 block">
                                    Page {currentPage} individual tagging
                                  </span>
                                )}
                              </h3>
                              {!hasUtilizationSelected() && getCurrentPdfData().serviceType !== 'Consult' && (
                                <p className="text-sm text-red-600 mb-3">Please select at least one utilization item</p>
                              )}
                              {renderServiceItems()}
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="qc" className="flex-1 h-0">
                    {!isMandatoryFieldsFilled() || !hasUtilizationSelected() ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-lg font-medium text-gray-500 mb-2">Pending</div>
                          <p className="text-sm text-gray-400">
                            {!isMandatoryFieldsFilled() && "Please fill all mandatory fields to continue"}
                            {isMandatoryFieldsFilled() && !hasUtilizationSelected() && "Please select at least one utilization item"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <ScrollArea className="h-full">
                        <div className="space-y-6">
                          {/* QC Step: Verify Demographics */}
                          <div>
                            <Label className="text-base font-medium mb-2 block">Verify Demographics *</Label>
                            {!isDemographicsStarted() && (
                              <Label className="text-sm text-gray-600 mb-3 block">Click items to eliminate from verification</Label>
                            )}
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
                            <Label className="text-base font-medium mb-2 block">QC Flags *</Label>
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

                          {/* QC Tracker Status */}
                          <div>
                            <Label className="text-base font-medium mb-2 block">QC Status *</Label>
                            <Select value={qcStatus} onValueChange={setQcStatus}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="passed">Passed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="pending">Pending Review</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* QC Summary */}
                          <div>
                            <Label className="text-base font-medium mb-2 block">QC Summary</Label>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">Demographics Verified:</span> {qcDemographicItems.length - eliminatedDemographics.length}/{qcDemographicItems.length}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Flags Raised:</span> {eliminatedFlags.length}
                              </div>
                            </div>
                          </div>

                          {/* Comments */}
                          <div>
                            <Label htmlFor="comments">Comments</Label>
                            <Textarea
                              id="comments"
                              placeholder="Enter any additional comments..."
                              value={getCurrentPdfData().comments}
                              onChange={(e) => updateCurrentPdfData({comments: e.target.value})}
                            />
                          </div>
                        </div>
                      </ScrollArea>
                    )}
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
