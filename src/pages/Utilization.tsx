
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Search, Download, Split, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Service data structure
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
    "Estimated Average Glucose (EAG)", "FASTING BLOOD SUGAR (GLUCOSE)", "GLYCATED HEMOGLOBIN (HbA1c)",
    "HbA1c", "Mean Plasma Glucose Level", "MICROALBUMIN", "Postprandial Blood Glucose/Glucose-PP",
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
const qcFlags = ["Pending Radiology", "Incorrect Demographics", "Partial Reports"];
const partialReportOptions = ["Radiology", "Cardiology"];
const labPartners = ["Lab Partner 1", "Lab Partner 2", "Lab Partner 3", "Lab Partner 4"];

const Utilization = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [referenceId, setReferenceId] = useState('');
  const [selectedQuality, setSelectedQuality] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expectedCount, setExpectedCount] = useState('');
  const [selectedQcFlags, setSelectedQcFlags] = useState([]);
  const [selectedPartialReports, setSelectedPartialReports] = useState([]);
  const [selectedLabPartner, setSelectedLabPartner] = useState('');
  const [customLabPartner, setCustomLabPartner] = useState('');
  const [demographics, setDemographics] = useState('');
  const [uhidFlag, setUhidFlag] = useState(false);
  const [comments, setComments] = useState('');
  const { toast } = useToast();

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
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

  const handleQualityChange = (quality) => {
    setSelectedQuality(prev => 
      prev.includes(quality) 
        ? prev.filter(q => q !== quality)
        : [...prev, quality]
    );
  };

  const handleServiceItemToggle = (category, item) => {
    const key = `${category}-${item}`;
    setSelectedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCategoryToggle = (category) => {
    const currentServices = selectedServiceType === 'Pathology' ? pathologyServices : otherServices;
    const categoryItems = currentServices[category] || [];
    const allSelected = categoryItems.every(item => selectedItems[`${category}-${item}`]);
    
    const newSelectedItems = { ...selectedItems };
    categoryItems.forEach(item => {
      newSelectedItems[`${category}-${item}`] = !allSelected;
    });
    setSelectedItems(newSelectedItems);
  };

  const handleKeyPress = (event, action) => {
    if (event.key === 'Enter') {
      action();
    }
  };

  const filteredServices = () => {
    const currentServices = selectedServiceType === 'Pathology' ? pathologyServices : otherServices;
    if (!searchTerm) return currentServices;
    
    const filtered = {};
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

  const handleSplitPdf = () => {
    toast({
      title: "PDF Split",
      description: "PDF has been split successfully",
    });
  };

  const renderServiceItems = () => {
    const services = filteredServices();
    
    return Object.entries(services).map(([category, items]) => {
      const categoryItemIds = items.map(item => `${category}-${item}`);
      const selectedCount = categoryItemIds.filter(id => selectedItems[id]).length;
      const allSelected = selectedCount === categoryItemIds.length;
      const someSelected = selectedCount > 0 && selectedCount < categoryItemIds.length;

      return (
        <div key={category} className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => handleCategoryToggle(category)}
              className={someSelected ? "data-[state=checked]:bg-blue-600" : ""}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Utilization</h1>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search Reference IDs or service items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, () => {})}
                className="pl-10"
              />
            </div>
          </div>
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

                {/* PDF Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="border rounded-lg p-4 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">PDF Preview</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleSplitPdf}>
                          <Split className="h-4 w-4 mr-1" />
                          Split
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-100 h-64 rounded flex items-center justify-center mb-4">
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
                  </div>
                )}

                {/* Report Quality Tagging */}
                <div>
                  <Label className="text-base font-medium">Report Quality * (Required)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {qualityOptions.map(quality => (
                      <div key={quality} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedQuality.includes(quality)}
                          onCheckedChange={() => handleQualityChange(quality)}
                        />
                        <Label className="text-sm">{quality}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <Label className="text-base font-medium">Service Type * (Required)</Label>
                  <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypeOptions.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    value={expectedCount}
                    onChange={(e) => setExpectedCount(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, () => {})}
                    placeholder="Enter expected count"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Service Item Tagging and QC */}
          <div className="space-y-4">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Service Item Tagging & QC</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <ScrollArea className="h-[calc(100vh-400px)]">
                  {/* Service Items */}
                  {selectedServiceType && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">
                        Page {currentPage} - Service Items ({selectedServiceType})
                      </h3>
                      {renderServiceItems()}
                    </div>
                  )}

                  {/* Demographics Verification */}
                  <div className="mb-6">
                    <Label className="text-base font-medium mb-2 block">Demographics Verification</Label>
                    <Textarea
                      placeholder="Enter demographics details..."
                      value={demographics}
                      onChange={(e) => setDemographics(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={uhidFlag}
                        onCheckedChange={setUhidFlag}
                      />
                      <Label className="text-sm">Flag for incorrect UHID</Label>
                    </div>
                  </div>

                  {/* QC Tracker */}
                  <div className="mb-6">
                    <Label className="text-base font-medium mb-2 block">QC Tracker * (Required)</Label>
                    {qcFlags.map(flag => (
                      <div key={flag} className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          checked={selectedQcFlags.includes(flag)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedQcFlags(prev => [...prev, flag]);
                            } else {
                              setSelectedQcFlags(prev => prev.filter(f => f !== flag));
                            }
                          }}
                        />
                        <Label className="text-sm">{flag}</Label>
                      </div>
                    ))}
                    
                    {/* Partial Reports Options */}
                    {selectedQcFlags.includes('Partial Reports') && (
                      <div className="ml-6 mt-2">
                        <Label className="text-sm font-medium mb-2 block">Partial Report Type:</Label>
                        {partialReportOptions.map(option => (
                          <div key={option} className="flex items-center space-x-2 mb-1">
                            <Checkbox
                              checked={selectedPartialReports.includes(option)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPartialReports(prev => [...prev, option]);
                                } else {
                                  setSelectedPartialReports(prev => prev.filter(o => o !== option));
                                }
                              }}
                            />
                            <Label className="text-sm">{option}</Label>
                          </div>
                        ))}
                      </div>
                    )}
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
                </ScrollArea>

                {/* Save Button */}
                <div className="pt-4 border-t">
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      toast({
                        title: "Data Saved",
                        description: "All tagging and QC data has been saved for this Reference ID",
                      });
                    }}
                  >
                    Save Reference ID Data
                  </Button>
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
