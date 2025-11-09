import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { EntryRequirement } from '@/types/program';

interface RequirementConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requirementTitle: string;
  onSave: (config: EntryRequirement['programSpecific']) => void;
}

export function RequirementConfigDialog({
  isOpen,
  onClose,
  requirementTitle,
  onSave,
}: RequirementConfigDialogProps) {
  const [applicableTo, setApplicableTo] = useState<'both' | 'domestic' | 'international'>('both');
  const [domesticThreshold, setDomesticThreshold] = useState({ enabled: false, value: '', description: '' });
  const [internationalThreshold, setInternationalThreshold] = useState({ enabled: false, value: '', description: '' });
  const [mandatoryOverride, setMandatoryOverride] = useState(false);

  const handleSave = () => {
    const config: EntryRequirement['programSpecific'] = {
      applicableTo,
      thresholds: {},
      mandatoryOverride: mandatoryOverride || undefined,
    };

    if (applicableTo !== 'international' && domesticThreshold.enabled && domesticThreshold.value) {
      config.thresholds.domestic = {
        value: domesticThreshold.value,
        description: domesticThreshold.description || undefined,
      };
    }

    if (applicableTo !== 'domestic' && internationalThreshold.enabled && internationalThreshold.value) {
      config.thresholds.international = {
        value: internationalThreshold.value,
        description: internationalThreshold.description || undefined,
      };
    }

    onSave(config);
    onClose();
  };

  const resetForm = () => {
    setApplicableTo('both');
    setDomesticThreshold({ enabled: false, value: '', description: '' });
    setInternationalThreshold({ enabled: false, value: '', description: '' });
    setMandatoryOverride(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { resetForm(); onClose(); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure: {requirementTitle}</DialogTitle>
          <DialogDescription>
            Set program-specific configuration for this entry requirement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Student Type Applicability */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Student Type Applicability</Label>
            <RadioGroup value={applicableTo} onValueChange={(v: any) => setApplicableTo(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="font-normal cursor-pointer">
                  Both domestic and international students
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="domestic" id="domestic" />
                <Label htmlFor="domestic" className="font-normal cursor-pointer">
                  Domestic students only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="international" id="international" />
                <Label htmlFor="international" className="font-normal cursor-pointer">
                  International students only
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Domestic Thresholds */}
          {applicableTo !== 'international' && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Domestic Students</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="domestic-threshold"
                        checked={domesticThreshold.enabled}
                        onCheckedChange={(checked) =>
                          setDomesticThreshold((prev) => ({ ...prev, enabled: !!checked }))
                        }
                      />
                      <Label
                        htmlFor="domestic-threshold"
                        className="font-normal cursor-pointer"
                      >
                        Set threshold for this program
                      </Label>
                    </div>
                  </div>

                  {domesticThreshold.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="domestic-value">Threshold Value *</Label>
                        <Input
                          id="domestic-value"
                          placeholder="e.g., 70%, 3.0 GPA, 6.0"
                          value={domesticThreshold.value}
                          onChange={(e) =>
                            setDomesticThreshold((prev) => ({ ...prev, value: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="domestic-description">Threshold Description</Label>
                        <Textarea
                          id="domestic-description"
                          placeholder="e.g., Minimum overall grade percentage"
                          value={domesticThreshold.description}
                          onChange={(e) =>
                            setDomesticThreshold((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={2}
                        />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* International Thresholds */}
          {applicableTo !== 'domestic' && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">International Students</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="international-threshold"
                        checked={internationalThreshold.enabled}
                        onCheckedChange={(checked) =>
                          setInternationalThreshold((prev) => ({ ...prev, enabled: !!checked }))
                        }
                      />
                      <Label
                        htmlFor="international-threshold"
                        className="font-normal cursor-pointer"
                      >
                        Set threshold for this program
                      </Label>
                    </div>
                  </div>

                  {internationalThreshold.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="international-value">Threshold Value *</Label>
                        <Input
                          id="international-value"
                          placeholder="e.g., 75%, 3.5 GPA, 6.5"
                          value={internationalThreshold.value}
                          onChange={(e) =>
                            setInternationalThreshold((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="international-description">Threshold Description</Label>
                        <Textarea
                          id="international-description"
                          placeholder="e.g., Minimum overall band score with no band below 6.0"
                          value={internationalThreshold.description}
                          onChange={(e) =>
                            setInternationalThreshold((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={2}
                        />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mandatory Override */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mandatory-override"
              checked={mandatoryOverride}
              onCheckedChange={(checked) => setMandatoryOverride(!!checked)}
            />
            <Label htmlFor="mandatory-override" className="font-normal cursor-pointer">
              Override as Optional for this program
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onClose(); }}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Add to Program
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
