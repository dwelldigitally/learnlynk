import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { Program, FeeItem } from "@/types/program";

interface FeeStructureStepProps {
  data: Partial<Program>;
  onDataChange: (data: Partial<Program>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const FEE_TYPES = [
  "Tuition Fee",
  "Application Fee", 
  "Technology Fee",
  "Lab Fee",
  "Books & Materials",
  "Equipment Fee",
  "Student Services Fee",
  "Registration Fee",
  "Graduation Fee",
  "Activity Fee",
  "International Student Services Fee"
];

const FeeStructureStep: React.FC<FeeStructureStepProps> = ({
  data,
  onDataChange
}) => {
  const addFee = (type: 'domestic' | 'international') => {
    const newFee: FeeItem = {
      id: `fee-${Date.now()}`,
      type: "Tuition Fee",
      amount: 0,
      currency: "CAD",
      required: true,
      description: ""
    };

    const currentStructure = data.feeStructure || {
      domesticFees: [],
      internationalFees: [],
      paymentPlans: [],
      scholarships: []
    };

    onDataChange({
      feeStructure: {
        ...currentStructure,
        [type === 'domestic' ? 'domesticFees' : 'internationalFees']: [
          ...(type === 'domestic' ? currentStructure.domesticFees : currentStructure.internationalFees),
          newFee
        ]
      }
    });
  };

  const removeFee = (type: 'domestic' | 'international', index: number) => {
    const currentStructure = data.feeStructure || {
      domesticFees: [],
      internationalFees: [],
      paymentPlans: [],
      scholarships: []
    };

    const fees = type === 'domestic' ? currentStructure.domesticFees : currentStructure.internationalFees;
    const updatedFees = fees.filter((_, i) => i !== index);

    onDataChange({
      feeStructure: {
        ...currentStructure,
        [type === 'domestic' ? 'domesticFees' : 'internationalFees']: updatedFees
      }
    });
  };

  const updateFee = (type: 'domestic' | 'international', index: number, field: keyof FeeItem, value: any) => {
    const currentStructure = data.feeStructure || {
      domesticFees: [],
      internationalFees: [],
      paymentPlans: [],
      scholarships: []
    };

    const fees = type === 'domestic' ? [...currentStructure.domesticFees] : [...currentStructure.internationalFees];
    fees[index] = { ...fees[index], [field]: value };

    onDataChange({
      feeStructure: {
        ...currentStructure,
        [type === 'domestic' ? 'domesticFees' : 'internationalFees']: fees
      }
    });
  };

  const renderFeeForm = (type: 'domestic' | 'international') => {
    const fees = type === 'domestic' 
      ? (data.feeStructure?.domesticFees || [])
      : (data.feeStructure?.internationalFees || []);

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {type === 'domestic' ? 'Domestic' : 'International'} Fees
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addFee(type)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Fee
          </Button>
        </div>

        {fees.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No fees added yet. Click "Add Fee" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {fees.map((fee, index) => (
              <Card key={fee.id || index}>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Fee Type</Label>
                      <Select 
                        value={fee.type} 
                        onValueChange={(value) => updateFee(type, index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FEE_TYPES.map((feeType) => (
                            <SelectItem key={feeType} value={feeType}>
                              {feeType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={fee.amount}
                        onChange={(e) => updateFee(type, index, 'amount', Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label>Currency</Label>
                      <Select 
                        value={fee.currency} 
                        onValueChange={(value) => updateFee(type, index, 'currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFee(type, index)}
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Label>Description (Optional)</Label>
                    <Input
                      value={fee.description || ''}
                      onChange={(e) => updateFee(type, index, 'description', e.target.value)}
                      placeholder="Brief description of this fee"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Fee Structure</h2>
        <p className="text-muted-foreground">
          Configure tuition and additional fees for domestic and international students
        </p>
      </div>

      <Tabs defaultValue="domestic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="domestic">Domestic Students</TabsTrigger>
          <TabsTrigger value="international">International Students</TabsTrigger>
        </TabsList>
        
        <TabsContent value="domestic" className="space-y-4">
          {renderFeeForm('domestic')}
        </TabsContent>
        
        <TabsContent value="international" className="space-y-4">
          {renderFeeForm('international')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeeStructureStep;