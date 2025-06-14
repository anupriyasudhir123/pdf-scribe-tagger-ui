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

interface SplitPdfData {
  pdf1: {
    pages: number[];
    referenceId: string;
    quality: string[];
    serviceType: string;
    labPartner: string;
    customLabPartner: string;
    expectedCount: number;
    selectedItems: Record<string, boolean>;
    comments: string;
  };
  pdf2: {
    pages: number[];
    referenceId: string;
    quality: string[];
    serviceType: string;
    labPartner: string;
    customLabPartner: string;
    expectedCount: number;
    selectedItems: Record<string, boolean>;
    comments: string;
  };
}

const Utilization = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [splitPdfs, setSplitPdfs] = useState<SplitPdfData | null>(null);
  const [selectedPdfForTagging, setSelectedPdfForTagging] = useState<'pdf1' | 'pdf2' | null>(null);
  
  // Current active data (either main or selected split PDF)
  const [referenceId, setReferenceId] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<string[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expectedCount, setExpectedCount] = useState(0);
  const [selectedLabPartner, setSelectedLabPartner] = useState('');
  const [customLabPartner, setCustomLabPartner] = useState('');
  const [comments, setComments] = useState('');
  const [eliminatedDemographics, setEliminatedDemographics] = useState<string[]>([]);
  const [eliminatedFlags, setEliminatedFlags] = useState<string[]>([]);
  const [qcStatus, setQcStatus] = useState('');
  const { toast } = useToast();

  // Check if mandatory fields are filled
  const isMandatoryFieldsFilled = () => {
    return selectedQuality.length > 0 && selectedServiceType && selectedLabPartner;
  };

  // Check if demographics verification has been started
  const isDemographicsStarted = () => {
    return eliminatedDemographics.length > 0;
  };

  const getCurrentPdfData = () => {
    if (splitPdfs && selectedPdfForTagging) {
      return splitPdfs[selectedPdfForTagging];
    }
    return {
      referenceId,
      quality: selectedQuality,
      serviceType: selectedServiceType,
      labPartner: selectedLabPartner,
      customLabPartner,
      expectedCount,
      selectedItems,
      comments
    };
  };

  const updateCurrentPdfData = (updates: Partial<any>) => {
    if (splitPdfs && selectedPdfForTagging) {
      setSplitPdfs(prev => prev ? {
        ...prev,
        [selectedPdfForTagging]: {
          ...prev[selectedPdfForTagging],
          ...updates
        }
      } : null);
    } else {
      // Update main data
      Object.entries(updates).forEach(([key, value]) => {
        switch (key) {
          case 'referenceId': setReferenceId(value); break;
          case 'quality': setSelectedQuality(value); break;
          case 'serviceType': setSelectedServiceType(value); break;
          case 'labPartner': setSelectedLabPartner(value); break;
          case 'customLabPartner': setCustomLabPartner(value); break;
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
    const pdf1Pages = selectedPages.sort((a, b) => a - b);
    const pdf2Pages = allPages.filter(p => !selectedPages.includes(p));
    
    const splitData: SplitPdfData = {
      pdf1: {
        pages: pdf1Pages,
        referenceId: referenceId + '_part1',
        quality: [],
        serviceType: '',
        labPartner: '',
        customLabPartner: '',
        expectedCount: 0,
        selectedItems: {},
        comments: ''
      },
      pdf2: {
        pages: pdf2Pages,
        referenceId: referenceId + '_part2',
        quality: [],
        serviceType: '',
        labPartner: '',
        customLabPartner: '',
        expectedCount: 0,
        selectedItems: {},
        comments: ''
      }
    };

    setSplitPdfs(splitData);
    setSelectedPages([]);
    setSelectedPdfForTagging('pdf1'); // Default to first PDF
    
    // Clear main data
    setSelectedQuality([]);
    setSelectedServiceType('');
    setSelectedLabPartner('');
    setCustomLabPartner('');
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
    
    // Load PDF-specific data
    setReferenceId(pdfData.referenceId);
    setSelectedQuality(pdfData.quality);
    setSelectedServiceType(pdfData.serviceType);
    setSelectedLabPartner(pdfData.labPartner);
    setCustomLabPartner(pdfData.customLabPartner);
    setExpectedCount(pdfData.expectedCount);
    setSelectedItems(pdfData.selectedItems);
    setComments(pdfData.comments);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Utilization/Tagging Phase (Pre-Digitization)</h1>
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

                {/* PDF Preview and Controls */}
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

                    {/* Page Thumbnails Grid for Selection */}
                    <div className="mb-4">
                      <Label className="text-sm font-medium mb-2 block">Select Pages to Split:</Label>
                      <ScrollArea className="h-48">
                        <div className="grid grid-cols-4 gap-2 p-2">
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
                              <div className="bg-white h-24 rounded border flex flex-col items-center justify-center">
                                <FileText className="h-8 w-8 text-gray-400 mb-1" />
                                <div className="text-xs text-gray-500">Page {pageNum}</div>
                                <div className="w-full h-2 bg-gray-100 mt-2 rounded"></div>
                                <div className="w-3/4 h-1 bg-gray-200 mt-1 rounded"></div>
                              </div>
                              {selectedPages.includes(pageNum) && (
                                <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                  ✓
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Current Page Preview */}
                    <div className="bg-gray-100 h-48 rounded flex items-center justify-center mb-4 border">
                      <div className="text-center bg-white p-8 rounded shadow-sm border">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <span className="text-gray-500 text-lg font-medium">PDF Preview - Page {currentPage}</span>
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

                    {/* Split PDFs Preview and Selection */}
                    {splitPdfs && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium mb-2">Split PDFs - Select one to tag:</h4>
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
                            <div className="bg-white h-20 rounded border flex items-center justify-center mt-2">
                              <FileText className="h-8 w-8 text-blue-500" />
                            </div>
                            {selectedPdfForTagging === 'pdf1' && (
                              <div className="text-xs text-blue-600 mt-1 font-medium">Currently Selected</div>
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
                            <div className="bg-white h-20 rounded border flex items-center justify-center mt-2">
                              <FileText className="h-8 w-8 text-green-500" />
                            </div>
                            {selectedPdfForTagging === 'pdf2' && (
                              <div className="text-xs text-blue-600 mt-1 font-medium">Currently Selected</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Reference ID */}
                <div>
                  <Label htmlFor="reference-id">Reference ID</Label>
                  <Input
                    id="reference-id"
                    value={referenceId}
                    onChange={(e) => updateCurrentPdfData({referenceId: e.target.value})}
                    onKeyPress={(e) => handleKeyPress(e, () => {})}
                    placeholder="Auto-filled from PDF name"
                  />
                </div>

                {/* Report Quality - Mandatory */}
                <div>
                  <Label className="text-base font-medium">Report Quality *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {qualityOptions.map(quality => {
                      const currentData = getCurrentPdfData();
                      return (
                        <Button
                          key={quality}
                          variant={currentData.quality.includes(quality) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const currentQuality = currentData.quality;
                            const newQuality = currentQuality.includes(quality) 
                              ? currentQuality.filter(q => q !== quality)
                              : [...currentQuality, quality];
                            updateCurrentPdfData({quality: newQuality});
                          }}
                          className="justify-start"
                        >
                          {quality}
                        </Button>
                      );
                    })}
                  </div>
                  {getCurrentPdfData().quality.length === 0 && (
                    <p className="text-sm text-gray-600 mt-1">Please select at least one quality option</p>
                  )}
                </div>

                {/* Service Type - Mandatory */}
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

                {/* Lab Partner - Mandatory */}
                <div>
                  <Label>Executing Lab Partner *</Label>
                  <Select 
                    value={getCurrentPdfData().labPartner} 
                    onValueChange={(value) => updateCurrentPdfData({labPartner: value})}
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
                  {getCurrentPdfData().labPartner === 'custom' && (
                    <Input
                      className="mt-2"
                      placeholder="Enter new lab partner name"
                      value={getCurrentPdfData().customLabPartner}
                      onChange={(e) => updateCurrentPdfData({customLabPartner: e.target.value})}
                      onKeyPress={(e) => handleKeyPress(e, () => {})}
                    />
                  )}
                  {!getCurrentPdfData().labPartner && (
                    <p className="text-sm text-gray-600 mt-1">Please select a lab partner</p>
                  )}
                </div>

                {/* Expected Count */}
                <div>
                  <Label htmlFor="expected-count">Expected Count</Label>
                  <Input
                    id="expected-count"
                    type="number"
                    value={getCurrentPdfData().expectedCount.toString()}
                    onChange={(e) => updateCurrentPdfData({expectedCount: Number(e.target.value)})}
                    onKeyPress={(e) => handleKeyPress(e, () => {})}
                    placeholder="Auto-calculated for pathology"
                    readOnly={getCurrentPdfData().serviceType === 'Pathology'}
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
                    <TabsTrigger value="utilization" disabled={!isMandatoryFieldsFilled()}>
                      Service Item Tagging
                      {!isMandatoryFieldsFilled() && <span className="ml-2 text-xs text-gray-500">(Pending)</span>}
                    </TabsTrigger>
                    <TabsTrigger value="qc" disabled={!isMandatoryFieldsFilled()}>
                      QC Verification
                      {!isMandatoryFieldsFilled() && <span className="ml-2 text-xs text-gray-500">(Pending)</span>}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="utilization" className="flex-1">
                    {!isMandatoryFieldsFilled() ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-lg font-medium text-gray-500 mb-2">Pending</div>
                          <p className="text-sm text-gray-400">Please fill all mandatory fields to continue</p>
                        </div>
                      </div>
                    ) : (
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
                          {getCurrentPdfData().serviceType && (
                            <div>
                              <h3 className="font-medium mb-3">
                                Service Items ({getCurrentPdfData().serviceType})
                              </h3>
                              {renderServiceItems()}
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="qc" className="flex-1">
                    {!isMandatoryFieldsFilled() ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-lg font-medium text-gray-500 mb-2">Pending</div>
                          <p className="text-sm text-gray-400">Please fill all mandatory fields to continue</p>
                        </div>
                      </div>
                    ) : (
                      <ScrollArea className="h-[calc(100vh-500px)]">
                        <div className="space-y-6">
                          {/* QC Step: Verify Demographics */}
                          <div>
                            <Label className="text-base font-medium mb-2 block">Verify Demographics</Label>
                            {!isDemographicsStarted() && (
                              <Label className="text-sm text-gray-600 mb-3 block">Pending</Label>
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
                            <Label className="text-base font-medium mb-2 block">QC Flags</Label>
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
                            <Label className="text-base font-medium mb-2 block">QC Status</Label>
                            <Label htmlFor="qc-status">Overall QC Status</Label>
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
