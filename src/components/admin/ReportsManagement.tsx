import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download, Calendar, TrendingUp } from 'lucide-react';

export function ReportsManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports Management</h1>
          <p className="text-muted-foreground">
            Generate and manage comprehensive reports for data-driven insights
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,249</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Auto-generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Connected sources</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* PTIRU Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              PTIRU Data Witness
            </CardTitle>
            <CardDescription>
              One-click reports for PTIRU compliance and data reporting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Student Data Report
              <span className="ml-auto text-xs text-muted-foreground">CSV</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Program Application Report
              <span className="ml-auto text-xs text-muted-foreground">PDF</span>
            </Button>
            <div className="pt-2 text-xs text-muted-foreground">
              <p>• Institution ID & Student ID tracking</p>
              <p>• Location + Program enrollment data</p>
              <p>• Intake models & max enrollment</p>
            </div>
          </CardContent>
        </Card>

        {/* DQAB Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              DQAB Reporting
            </CardTitle>
            <CardDescription>
              Institutional reporting for DQAB compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Institutional Report
              <span className="ml-auto text-xs text-muted-foreground">PDF</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Compliance Summary
              <span className="ml-auto text-xs text-muted-foreground">Excel</span>
            </Button>
            <div className="pt-2 text-xs text-muted-foreground">
              <p>• Mission & program credentials</p>
              <p>• Location & delivery mode</p>
              <p>• Academic structure & timeline</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Quick Reports
            </CardTitle>
            <CardDescription>
              Frequently used reports for daily operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Lead Conversion Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Student Enrollment Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Financial Summary Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Program Performance Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>PTIRU Configuration</CardTitle>
            <CardDescription>
              Configure required fields for PTIRU reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <div className="font-medium">Required Fields:</div>
                <div className="text-muted-foreground space-y-1">
                  <div>• Institution ID</div>
                  <div>• Student ID (both tabs)</div>
                  <div>• Location + Program</div>
                  <div>• Enrollment data</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Optional Fields:</div>
                <div className="text-muted-foreground space-y-1">
                  <div>• Delete flags</div>
                  <div>• Intake models</div>
                  <div>• Max enrollment</div>
                  <div>• Facilities list</div>
                </div>
              </div>
            </div>
            <Button className="w-full">
              Configure PTIRU Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DQAB Configuration</CardTitle>
            <CardDescription>
              Configure institutional reporting requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <div className="font-medium">Institutional Data:</div>
                <div className="text-muted-foreground space-y-1">
                  <div>• Mission statement</div>
                  <div>• Program credentials</div>
                  <div>• Location details</div>
                  <div>• Delivery mode</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Compliance:</div>
                <div className="text-muted-foreground space-y-1">
                  <div>• Academic structure</div>
                  <div>• Timeline requirements</div>
                  <div>• Organization reviews</div>
                  <div>• University use policies</div>
                </div>
              </div>
            </div>
            <Button className="w-full">
              Configure DQAB Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}