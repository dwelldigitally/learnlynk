import * as React from "react"
import { ChevronDown, MoreHorizontal, Search, Filter, Download, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
  priority?: 'high' | 'medium' | 'low' // For mobile column prioritization
}

interface MobileDataTableProps {
  title: string
  data: any[]
  columns: Column[]
  searchPlaceholder?: string
  enableSearch?: boolean
  enableFilter?: boolean
  enableExport?: boolean
  enableAdd?: boolean
  onAddClick?: () => void
  onRowClick?: (item: any) => void
  renderMobileCard?: (item: any, index: number) => React.ReactNode
}

export function MobileDataTable({
  title,
  data,
  columns,
  searchPlaceholder = "Search...",
  enableSearch = true,
  enableFilter = false,
  enableExport = false,
  enableAdd = false,
  onAddClick,
  onRowClick,
  renderMobileCard,
}: MobileDataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const isMobile = useIsMobile()

  const itemsPerPage = isMobile ? 10 : 20

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data
    return data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [data, searchQuery])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Get high priority columns for mobile
  const mobileColumns = columns.filter(col => col.priority === 'high').slice(0, 2)
  const hasMoreColumns = columns.length > mobileColumns.length

  const renderCellContent = (item: any, column: Column) => {
    const value = item[column.key]
    
    if (column.key.includes('avatar') || column.key.includes('image')) {
      return (
        <Avatar className="w-8 h-8">
          <AvatarImage src={value} />
          <AvatarFallback>
            {item.name?.charAt(0) || item.email?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
      )
    }
    
    if (column.key.includes('status')) {
      return (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    }
    
    if (column.key.includes('email')) {
      return (
        <a href={`mailto:${value}`} className="text-primary hover:underline">
          {value}
        </a>
      )
    }
    
    return value
  }

  if (isMobile && renderMobileCard) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{title}</CardTitle>
              <span className="text-sm text-muted-foreground">
                {filteredData.length} records
              </span>
            </div>
            
            {/* Mobile Actions Row */}
            <div className="flex items-center gap-2">
              {enableSearch && (
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              )}
              
              {enableAdd && (
                <Button onClick={onAddClick} size="sm" className="min-w-[44px] min-h-[44px]">
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Secondary Actions */}
            {(enableFilter || enableExport) && (
              <div className="flex items-center gap-2">
                {enableFilter && (
                  <Button variant="outline" size="sm" className="flex-1">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                )}
                {enableExport && (
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="space-y-3 p-4">
            {paginatedData.map((item, index) => (
              <div key={index}>
                {renderMobileCard(item, index)}
              </div>
            ))}
          </div>

          {/* Mobile Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <span className="text-sm text-muted-foreground">
              {filteredData.length} records
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {enableSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              {enableFilter && (
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              )}
              {enableExport && (
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
              {enableAdd && (
                <Button onClick={onAddClick} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isMobile ? (
          // Mobile Card View
          <div className="space-y-3 p-4">
            {paginatedData.map((item, index) => (
              <Card
                key={index}
                className={cn(
                  "p-4 cursor-pointer transition-colors hover:bg-muted/50",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(item)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {mobileColumns.map((column) => (
                      <div key={column.key} className="min-w-0">
                        {renderCellContent(item, column)}
                      </div>
                    ))}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {item[mobileColumns[0]?.key] || 'N/A'}
                      </div>
                      {mobileColumns[1] && (
                        <div className="text-xs text-muted-foreground truncate">
                          {item[mobileColumns[1].key]}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {hasMoreColumns && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Desktop Table View
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="text-left py-3 px-4 font-medium text-muted-foreground"
                      style={{ width: column.width }}
                    >
                      {column.label}
                      {column.sortable && (
                        <ChevronDown className="ml-1 w-3 h-3 inline" />
                      )}
                    </th>
                  ))}
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground w-12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    className={cn(
                      "border-b border-border transition-colors",
                      onRowClick && "cursor-pointer hover:bg-muted/50"
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="py-3 px-4">
                        {renderCellContent(item, column)}
                      </td>
                    ))}
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
              {filteredData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}