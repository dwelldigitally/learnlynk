import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, DollarSign, Info, PieChart } from 'lucide-react';
import { usePageEntranceAnimation } from '@/hooks/useAnimations';

interface CalculatorInputs {
  familyIncome: string;
  familySize: string;
  dependentStatus: string;
  assets: string;
  tuitionCost: string;
  gpa: string;
  programType: string;
}

export function FinancialAidCalculator() {
  const controls = usePageEntranceAnimation();
  const [inputs, setInputs] = useState<CalculatorInputs>({
    familyIncome: '',
    familySize: '',
    dependentStatus: '',
    assets: '',
    tuitionCost: '',
    gpa: '',
    programType: ''
  });
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateAid = async () => {
    setIsCalculating(true);
    
    // Simulate calculation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const income = parseInt(inputs.familyIncome) || 0;
    const tuition = parseInt(inputs.tuitionCost) || 25000;
    const gpa = parseFloat(inputs.gpa) || 0;
    
    // Simple EFC calculation simulation
    const efc = Math.max(0, (income * 0.22) - 6000);
    const needBasedAid = Math.max(0, tuition - efc);
    const meritAid = gpa >= 3.5 ? 2500 : gpa >= 3.0 ? 1500 : 500;
    const pellGrant = income < 30000 ? 6895 : income < 50000 ? 4000 : 0;
    
    setResults({
      efc: Math.round(efc),
      needBasedAid: Math.round(needBasedAid),
      meritAid,
      pellGrant,
      totalAid: Math.round(needBasedAid + meritAid + pellGrant),
      remainingCost: Math.max(0, tuition - needBasedAid - meritAid - pellGrant)
    });
    
    setIsCalculating(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Calculator className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Aid Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Estimate your financial aid eligibility and plan your education costs
          </p>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">FAFSA Calculator</TabsTrigger>
          <TabsTrigger value="estimator">Aid Estimator</TabsTrigger>
          <TabsTrigger value="comparison">Cost Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Enter Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="familyIncome">Family Income</Label>
                    <Input
                      id="familyIncome"
                      type="number"
                      placeholder="50000"
                      value={inputs.familyIncome}
                      onChange={(e) => handleInputChange('familyIncome', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familySize">Family Size</Label>
                    <Select value={inputs.familySize} onValueChange={(value) => handleInputChange('familySize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 person</SelectItem>
                        <SelectItem value="2">2 people</SelectItem>
                        <SelectItem value="3">3 people</SelectItem>
                        <SelectItem value="4">4 people</SelectItem>
                        <SelectItem value="5">5+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dependentStatus">Dependency Status</Label>
                  <Select value={inputs.dependentStatus} onValueChange={(value) => handleInputChange('dependentStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dependent">Dependent</SelectItem>
                      <SelectItem value="independent">Independent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assets">Family Assets</Label>
                    <Input
                      id="assets"
                      type="number"
                      placeholder="10000"
                      value={inputs.assets}
                      onChange={(e) => handleInputChange('assets', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpa">Current GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.1"
                      placeholder="3.5"
                      value={inputs.gpa}
                      onChange={(e) => handleInputChange('gpa', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tuitionCost">Program Tuition Cost</Label>
                  <Input
                    id="tuitionCost"
                    type="number"
                    placeholder="25000"
                    value={inputs.tuitionCost}
                    onChange={(e) => handleInputChange('tuitionCost', e.target.value)}
                  />
                </div>

                <Button 
                  onClick={calculateAid} 
                  className="w-full" 
                  disabled={isCalculating}
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Financial Aid'}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Estimated Financial Aid
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Expected Family Contribution (EFC)</p>
                        <p className="text-2xl font-bold">${results.efc.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">Total Estimated Aid</p>
                        <p className="text-2xl font-bold text-green-700">${results.totalAid.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span className="text-blue-700">Pell Grant</span>
                        <span className="font-semibold text-blue-700">${results.pellGrant.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                        <span className="text-purple-700">Merit-Based Aid</span>
                        <span className="font-semibold text-purple-700">${results.meritAid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-amber-50 rounded">
                        <span className="text-amber-700">Need-Based Aid</span>
                        <span className="font-semibold text-amber-700">${results.needBasedAid.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <p className="text-sm text-red-600">Remaining Cost</p>
                      <p className="text-2xl font-bold text-red-700">${results.remainingCost.toLocaleString()}</p>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      * This is an estimate. Actual aid may vary based on additional factors.
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Enter your information to calculate estimated financial aid</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="estimator">
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aid Estimator Coming Soon</h3>
              <p className="text-muted-foreground">
                Advanced aid estimation tools will be available here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardContent className="p-8 text-center">
              <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Cost Comparison Tool Coming Soon</h3>
              <p className="text-muted-foreground">
                Compare costs across different programs and aid packages
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}