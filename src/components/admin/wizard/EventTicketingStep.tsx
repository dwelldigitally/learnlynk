import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Ticket, DollarSign, Clock, Users } from "lucide-react";
import { EventData, TicketType } from "./EventWizard";

interface EventTicketingStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
}

export const EventTicketingStep: React.FC<EventTicketingStepProps> = ({ data, onUpdate }) => {
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [newTicket, setNewTicket] = useState<Partial<TicketType>>({
    name: "",
    description: "",
    price: 0,
    currency: "USD",
    maxQuantity: 100,
    salesStart: "",
    salesEnd: "",
    isFree: true,
  });

  const resetTicketForm = () => {
    setNewTicket({
      name: "",
      description: "",
      price: 0,
      currency: "USD",
      maxQuantity: 100,
      salesStart: "",
      salesEnd: "",
      isFree: true,
    });
    setEditingTicket(null);
  };

  const handleCreateTicket = () => {
    if (!newTicket.name) return;
    
    const ticket: TicketType = {
      id: editingTicket?.id || Date.now().toString(),
      name: newTicket.name!,
      description: newTicket.description || "",
      price: newTicket.isFree ? 0 : (newTicket.price || 0),
      currency: newTicket.currency || "USD",
      maxQuantity: newTicket.maxQuantity || 100,
      salesStart: newTicket.salesStart || "",
      salesEnd: newTicket.salesEnd || "",
      isFree: newTicket.isFree || false,
    };

    if (editingTicket) {
      const updatedTickets = data.ticketTypes.map(t => t.id === editingTicket.id ? ticket : t);
      onUpdate({ ticketTypes: updatedTickets });
    } else {
      onUpdate({ ticketTypes: [...data.ticketTypes, ticket] });
    }
    
    setIsCreatingTicket(false);
    resetTicketForm();
  };

  const handleEditTicket = (ticket: TicketType) => {
    setEditingTicket(ticket);
    setNewTicket(ticket);
    setIsCreatingTicket(true);
  };

  const handleDeleteTicket = (ticketId: string) => {
    const updatedTickets = data.ticketTypes.filter(t => t.id !== ticketId);
    onUpdate({ ticketTypes: updatedTickets });
  };

  const totalTickets = data.ticketTypes.reduce((sum, ticket) => sum + ticket.maxQuantity, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Ticketing & Pricing</h2>
        <p className="text-muted-foreground">Set up ticket types and pricing for your event.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Ticket className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{data.ticketTypes.length}</p>
                <p className="text-sm text-muted-foreground">Ticket Types</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalTickets}</p>
                <p className="text-sm text-muted-foreground">Total Capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {data.ticketTypes.filter(t => !t.isFree).length}
                </p>
                <p className="text-sm text-muted-foreground">Paid Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Ticket Types</h3>
        <Dialog open={isCreatingTicket} onOpenChange={setIsCreatingTicket}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetTicketForm(); setIsCreatingTicket(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Ticket Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTicket ? "Edit Ticket Type" : "Create New Ticket Type"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ticket-name">Ticket Name *</Label>
                  <Input
                    id="ticket-name"
                    value={newTicket.name}
                    onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                    placeholder="e.g., General Admission, VIP, Early Bird"
                  />
                </div>
                
                <div>
                  <Label htmlFor="ticket-description">Description</Label>
                  <Textarea
                    id="ticket-description"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="Describe what's included..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="is-free">Free Ticket</Label>
                  <Switch
                    id="is-free"
                    checked={newTicket.isFree}
                    onCheckedChange={(checked) => setNewTicket({ ...newTicket, isFree: checked, price: checked ? 0 : newTicket.price })}
                  />
                </div>
                
                {!newTicket.isFree && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="ticket-price">Price *</Label>
                      <Input
                        id="ticket-price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newTicket.price}
                        onChange={(e) => setNewTicket({ ...newTicket, price: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={newTicket.currency} onValueChange={(value) => setNewTicket({ ...newTicket, currency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="max-quantity">Maximum Quantity</Label>
                  <Input
                    id="max-quantity"
                    type="number"
                    min="1"
                    value={newTicket.maxQuantity}
                    onChange={(e) => setNewTicket({ ...newTicket, maxQuantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sales-start">Sales Start</Label>
                  <Input
                    id="sales-start"
                    type="datetime-local"
                    value={newTicket.salesStart}
                    onChange={(e) => setNewTicket({ ...newTicket, salesStart: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sales-end">Sales End</Label>
                  <Input
                    id="sales-end"
                    type="datetime-local"
                    value={newTicket.salesEnd}
                    onChange={(e) => setNewTicket({ ...newTicket, salesEnd: e.target.value })}
                  />
                </div>
                
                <div className="flex space-x-2 mt-6">
                  <Button onClick={handleCreateTicket} className="flex-1">
                    {editingTicket ? "Update Ticket" : "Create Ticket"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreatingTicket(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {data.ticketTypes.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{ticket.name}</h4>
                    <Badge variant={ticket.isFree ? "secondary" : "default"}>
                      {ticket.isFree ? "Free" : `${ticket.currency} ${ticket.price}`}
                    </Badge>
                  </div>
                  {ticket.description && (
                    <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{ticket.maxQuantity} available</span>
                    </span>
                    {ticket.salesStart && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Sales: {new Date(ticket.salesStart).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditTicket(ticket)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteTicket(ticket.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {data.ticketTypes.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No ticket types created</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first ticket type to start selling tickets.
                </p>
                <Button onClick={() => setIsCreatingTicket(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};