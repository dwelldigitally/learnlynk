
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Edit } from "lucide-react";

interface OrganizationPreviewProps {
  organizationData: any;
  onConfirm: () => void;
  onEdit: () => void;
}

const OrganizationPreviewScreen: React.FC<OrganizationPreviewProps> = ({
  organizationData,
  onConfirm,
  onEdit,
}) => {
  if (!organizationData) {
    return <div>No organization data available.</div>;
  }

  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Preview Your Organization
        </h1>
        <p className="text-saas-gray-medium">
          Review your organization details before proceeding to HubSpot installation
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{organizationData.name || "Your Organization"}</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            New Organization
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm uppercase text-gray-500 mb-1">Company Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <p className="font-medium">{organizationData.website || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{organizationData.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{organizationData.address || "Not provided"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase text-gray-500 mb-1">Business Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-medium">{organizationData.industry || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Type</p>
                <p className="font-medium">{organizationData.customerType || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <div className="flex items-start">
            <div className="bg-blue-100 p-1.5 rounded-full mr-3">
              <Check className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <p className="font-medium text-blue-800">Next Steps</p>
              <p className="text-sm text-blue-700 mt-1">
                After confirming your organization details, we'll guide you through connecting your HubSpot account.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onEdit}
            className="flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Details
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-saas-blue hover:bg-blue-600"
          >
            Confirm and Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrganizationPreviewScreen;
