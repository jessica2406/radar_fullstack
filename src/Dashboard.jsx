import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [accidents, setAccidents] = useState([]);
  const [filter, setFilter] = useState('all');

  // Fetch accidents from the Flask backend
  const fetchAccidents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/videos');
      setAccidents(response.data);
    } catch (error) {
      console.error('Error fetching accidents:', error);
    }
  };

  useEffect(() => {
    fetchAccidents(); // Fetch accidents on component mount
  }, []);

  const handleStatusChange = async (id) => {
    const accidentToUpdate = accidents.find(accident => accident._id === id);
    const newStatus = accidentToUpdate.status === 'pending' ? 'completed' : 'pending';

    // Update the status in the backend
    try {
      const response = await axios.put(`http://127.0.0.1:5000/accidents/${id}`, { status: newStatus });
      if (response.status === 200) {
        // Update the local state only if the backend update was successful
        setAccidents(prevAccidents =>
          prevAccidents.map(accident =>
            accident._id === id ? { ...accident, status: newStatus } : accident
          )
        );
      }
    } catch (error) {
      console.error('Error updating accident status:', error);
    }
  };

  const filteredAccidents = accidents.filter(accident =>
    filter === 'all' ? true : accident.status === filter
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className='flex gap-5'>
            <h1 className="text-3xl font-bold text-white">Control Dashboard</h1>
            <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Upload Video</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search accidents..."
                className="pl-10 pr-4 py-2 bg-slate-800 rounded-lg text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Cases</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredAccidents.map(accident => (
            <div
              key={accident._id} // Use _id instead of id
              className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-colors"
            >
              <div className="flex items-start gap-6">
                <div className="w-48 h-48 rounded-lg overflow-hidden">
                  <img
                    src={accident.imageUrl}
                    alt="Accident Scene"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Accident Report #{accident._id}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${accident.severity === 'high'
                        ? 'bg-red-500/20 text-red-400'
                        : accident.severity === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                      {accident.severity.charAt(0).toUpperCase() + accident.severity.slice(1)} Severity
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span>{accident.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${accident.status === 'pending' ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                      <span className="text-gray-300">
                        {accident.status === 'pending' ? 'Response Pending' : 'Response Completed'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleStatusChange(accident._id)} // Use _id for the click handler
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${accident.status === 'pending'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                      {accident.status === 'pending' ? (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          Mark as Responded
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}