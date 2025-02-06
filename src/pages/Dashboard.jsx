import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "../contexts/TicketContext";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import TicketModal from "../components/TicketModal";
import {
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    PlusIcon,
    FunnelIcon,
    UserCircleIcon,
    Bars3Icon,
    HomeIcon,
    TicketIcon,
  } from '@heroicons/react/24/outline';
  

const Dashboard = () => {
    
  const { 
    tickets, 
    loading, 
    error, 
    createTicket, 
    updateTicket, 
    deleteTicket, 
    assignTicket 
  } = useTickets();
  const { currentUser, logout } = useAuth();
  const { isAgent, isCustomer } = useUser();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      await createTicket(ticketData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleUpdateTicket = async (ticketData) => {
    try {
      await updateTicket(selectedTicket.id, ticketData);
      setSelectedTicket(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteTicket(ticketId);
      } catch (error) {
        console.error("Failed to delete ticket:", error);
      }
    }
  };

  const handleAssignTicket = async (ticketId) => {
    try {
      await assignTicket(ticketId, currentUser.email);
    } catch (error) {
      console.error("Failed to assign ticket:", error);
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === "all" || ticket.status === filterStatus;
    const priorityMatch = filterPriority === "all" || ticket.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Error: {error}
        </div>
      </div>
    );
  }
  const stats = [
    {
      name: 'Total Tickets',
      value: tickets.length,
      icon: ChartBarIcon,  // Changed from ArrowTrendingUpIcon
      color: 'bg-blue-500'
    },
    {
      name: 'Open Tickets',
      value: tickets.filter(t => t.status === 'open').length,
      icon: ClockIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Closed Tickets',
      value: tickets.filter(t => t.status === 'closed').length,
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      name: 'High Priority',
      value: tickets.filter(t => t.priority === 'high').length,
      icon: ExclamationCircleIcon,
      color: 'bg-red-500'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800">Support System</h2>
            <p className="mt-2 text-sm text-gray-600">
              {isAgent ? 'Agent Portal' : 'Customer Portal'}
            </p>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-700 bg-gray-100 rounded-lg">
              <span className="ml-3">Dashboard</span>
            </a>
            {/* Add more navigation items as needed */}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{currentUser?.email}</p>
                <p className="text-xs text-gray-500">{isAgent ? 'Support Agent' : 'Customer'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            {isCustomer && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Ticket
              </button>
            )}
          </div>
        </header>

        <main className="px-8 py-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
              >
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-40 rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="block w-40 rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{ticket.title}</span>
                          <span className="text-sm text-gray-500">#{ticket.id}</span>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ticket.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${ticket.status === 'open' 
                              ? 'bg-green-100 text-green-800'
                              : ticket.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {ticket.status}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${ticket.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : ticket.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                            }`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">Created by: {ticket.createdBy}</span>
                          <span className="text-sm text-gray-500">
                            Assigned to: {ticket.assignedTo || 'Unassigned'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isAgent ? (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditTicket(ticket)}
                              className="text-sm text-blue-600 hover:text-blue-900"
                            >
                              Update Status
                            </button>
                            {!ticket.assignedTo && (
                              <button
                                onClick={() => handleAssignTicket(ticket.id)}
                                className="text-sm text-green-600 hover:text-green-900"
                              >
                                Assign to Me
                              </button>
                            )}
                          </div>
                        ) : isCustomer && ticket.createdBy === currentUser?.email ? (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditTicket(ticket)}
                              className="text-sm text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="text-sm text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No tickets found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Ticket Modal */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
        onSubmit={selectedTicket ? handleUpdateTicket : handleCreateTicket}
        ticket={selectedTicket}
        isAgent={isAgent}
      />
    </div>
  );
};

export default Dashboard;