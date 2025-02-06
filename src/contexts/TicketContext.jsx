import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';

const TicketContext = createContext();

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { isAgent, isCustomer } = useUser();

  // Get filtered tickets based on user role
  const getVisibleTickets = () => {
    if (isAgent) {
      return tickets; // Agents can see all tickets
    }
    return tickets.filter(ticket => ticket.createdBy === currentUser?.email); // Customers see only their tickets
  };

  // Create ticket
  const createTicket = async (ticketData) => {
    if (!currentUser) {
      throw new Error("You must be logged in to create a ticket");
    }

    try {
      setLoading(true);
      const newTicket = {
        id: `TICKET-${Date.now()}`,
        ...ticketData,
        status: "open",
        createdBy: currentUser.email,
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setTickets(prevTickets => [...prevTickets, newTicket]);
      return newTicket.id;
    } catch (err) {
      setError("Failed to create ticket");
      throw new Error("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  // Update ticket
  const updateTicket = async (ticketId, updateData) => {
    if (!isAgent && !isCustomer) {
      throw new Error("Unauthorized to update tickets");
    }

    try {
      setLoading(true);
      setTickets(prevTickets => 
        prevTickets.map(ticket => {
          if (ticket.id === ticketId) {
            // Customers can only update their own tickets and cannot change status or assignment
            if (isCustomer) {
              if (ticket.createdBy !== currentUser?.email) {
                throw new Error("You can only update your own tickets");
              }
              // Customers can only update title, description, and priority
              const { title, description, priority } = updateData;
              return {
                ...ticket,
                title: title || ticket.title,
                description: description || ticket.description,
                priority: priority || ticket.priority,
                updatedAt: new Date()
              };
            }
            // Agents can update all fields
            return { 
              ...ticket, 
              ...updateData, 
              updatedAt: new Date() 
            };
          }
          return ticket;
        })
      );
    } catch (err) {
      setError(err.message || "Failed to update ticket");
      throw new Error(err.message || "Failed to update ticket");
    } finally {
      setLoading(false);
    }
  };

  // Delete ticket
  const deleteTicket = async (ticketId) => {
    if (!isCustomer) {
      throw new Error("Only customers can delete their tickets");
    }

    try {
      setLoading(true);
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (ticket.createdBy !== currentUser?.email) {
        throw new Error("You can only delete your own tickets");
      }

      setTickets(prevTickets => 
        prevTickets.filter(ticket => ticket.id !== ticketId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete ticket");
      throw new Error(err.message || "Failed to delete ticket");
    } finally {
      setLoading(false);
    }
  };

  // Assign ticket (agent only)
  const assignTicket = async (ticketId, agentEmail) => {
    if (!isAgent) {
      throw new Error("Only agents can assign tickets");
    }

    try {
      setLoading(true);
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === ticketId 
            ? { 
                ...ticket, 
                assignedTo: agentEmail,
                updatedAt: new Date() 
              } 
            : ticket
        )
      );
    } catch (err) {
      setError("Failed to assign ticket");
      throw new Error("Failed to assign ticket");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tickets: getVisibleTickets(),
    loading,
    error,
    createTicket,
    updateTicket,
    deleteTicket,
    assignTicket,
    isAgent,
    isCustomer
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};

export default TicketProvider;