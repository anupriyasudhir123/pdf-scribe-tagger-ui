
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
  selectedPages: number[];
  onPageSelect: (pageNum: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  selectedPages,
  onPageSelect,
  currentPage,
  onPageChange
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setLoading(false);
  };

  if (!file) {
    return (
      <div className="border rounded-lg p-4 flex-1">
        <div className="bg-gray-100 h-64 rounded flex items-center justify-center border">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <span className="text-gray-500">No PDF uploaded</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 flex-1">
      {/* Page Selection Grid */}
      <div className="mb-4">
        <Label className="text-sm font-medium mb-2 block">Select Pages to Split:</Label>
        <ScrollArea className="h-48">
          <div className="grid grid-cols-4 gap-2 p-2">
            {Array.from({ length: numPages }, (_, i) => i + 1).map(pageNum => (
              <div
                key={pageNum}
                className={`relative cursor-pointer border-2 rounded-lg p-2 transition-all ${
                  selectedPages.includes(pageNum)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onPageSelect(pageNum)}
              >
                <Document
                  file={file}
                  onLoadSuccess={() => {}}
                  onLoadError={() => {}}
                  className="w-full"
                >
                  <Page
                    pageNumber={pageNum}
                    width={100}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="pdf-page-thumbnail"
                  />
                </Document>
                <div className="text-xs text-gray-500 text-center mt-1">Page {pageNum}</div>
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

      {/* Main PDF Preview */}
      <div className="bg-gray-100 h-64 rounded flex items-center justify-center mb-4 border overflow-hidden">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <span className="text-gray-500">Loading PDF...</span>
          </div>
        ) : (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <span className="text-gray-500">Loading PDF...</span>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              width={400}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="pdf-page-main shadow-lg"
            />
          </Document>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || numPages === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {currentPage} of {numPages || 0}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(numPages, currentPage + 1))}
          disabled={currentPage === numPages || numPages === 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PDFViewer;
