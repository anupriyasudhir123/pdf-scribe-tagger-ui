
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Search, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF Processing & Utilization System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your document processing workflow with our comprehensive tagging and utilization platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>PDF Upload & Preview</CardTitle>
              <CardDescription>
                Upload multiple PDFs with instant preview and page navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bulk PDF upload support</li>
                <li>• Real-time preview</li>
                <li>• Page-wise navigation</li>
                <li>• PDF splitting functionality</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Tag className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Service Item Tagging</CardTitle>
              <CardDescription>
                Comprehensive tagging system for medical services and reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Radiology & Imaging</li>
                <li>• Cardiology services</li>
                <li>• Pathology reports</li>
                <li>• Quality verification</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>QC & Verification</CardTitle>
              <CardDescription>
                Quality control with demographics verification and flagging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Demographics verification</li>
                <li>• QC flag management</li>
                <li>• Lab partner selection</li>
                <li>• Comments & tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link to="/utilization">
            <Button size="lg" className="px-8 py-3">
              <Upload className="h-5 w-5 mr-2" />
              Start Processing
            </Button>
          </Link>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Document Processing</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Multiple PDF upload with automatic reference ID generation</li>
                <li>• Quality tagging (Skewed, Dewarped, Low Resolution, etc.)</li>
                <li>• Service type classification</li>
                <li>• Page-wise service item tagging</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quality Control</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Demographics verification with UHID validation</li>
                <li>• QC flags for pending reports and corrections</li>
                <li>• Lab partner assignment and tracking</li>
                <li>• Expected count management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
