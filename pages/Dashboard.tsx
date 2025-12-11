import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClinic } from '../context/ClinicContext';
import { Appointment, AppointmentStatus } from '../types';

const Dashboard: React.FC = () => {
  const { appointments, updateStatus, callNextPatient } = useClinic();
  const navigate = useNavigate();

  const waiting = appointments
    .filter(a => a.status === AppointmentStatus.WAITING)
    .sort((a, b) => a.queueNumber - b.queueNumber);

  const inConsult = appointments
    .filter(a => a.status === AppointmentStatus.IN_CONSULT)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const done = appointments
    .filter(a => a.status === AppointmentStatus.DONE)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10); // Recent 10

  const handleNextPatient = () => {
    if (waiting.length === 0) {
      alert("No patients waiting!");
      return;
    }
    callNextPatient();
  };

  const AppointmentCard: React.FC<{ appt: Appointment }> = ({ appt }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow relative">
      {appt.visitNotes && (
        <div className="absolute top-2 right-2 text-gray-300" title="Notes Saved">
          <i className="fa-solid fa-file-medical text-blue-300"></i>
        </div>
      )}
      <div className="flex justify-between items-start mb-2 pr-6">
        <div>
          <h3 className="font-bold text-gray-900">{appt.patientName}</h3>
          <p className="text-xs text-gray-500">Token: #{appt.queueNumber}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
          ${appt.status === AppointmentStatus.WAITING ? 'bg-yellow-100 text-yellow-800' : 
            appt.status === AppointmentStatus.IN_CONSULT ? 'bg-blue-100 text-blue-800' : 
            'bg-green-100 text-green-800'}`}>
          {appt.status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3 truncate">{appt.reason}</p>
      
      <div className="flex gap-2">
        <Link 
          to={`/appointment/${appt.id}`}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-1.5 px-3 rounded text-xs font-medium transition-colors"
        >
          Open
        </Link>
        
        {appt.status === AppointmentStatus.WAITING && (
          <button 
            onClick={() => updateStatus(appt.id, AppointmentStatus.IN_CONSULT)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded text-xs font-medium transition-colors"
          >
            Consult
          </button>
        )}

        {appt.status === AppointmentStatus.IN_CONSULT && (
          <button 
            onClick={() => updateStatus(appt.id, AppointmentStatus.DONE)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded text-xs font-medium transition-colors"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinic Dashboard</h1>
          <p className="text-gray-500">Manage patient flow and appointments</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button 
            onClick={handleNextPatient}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-all"
          >
            <i className="fa-solid fa-bell mr-2"></i> Call Next Patient
          </button>
          <Link 
            to="/new"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 font-medium transition-all"
          >
            <i className="fa-solid fa-plus mr-2"></i> Add Patient
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Waiting Column */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-700 uppercase text-sm tracking-wider">
              Waiting <span className="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">{waiting.length}</span>
            </h2>
            <i className="fa-solid fa-clock text-gray-400"></i>
          </div>
          <div className="space-y-3">
            {waiting.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No patients waiting.</p>
            ) : (
              waiting.map(appt => <AppointmentCard key={appt.id} appt={appt} />)
            )}
          </div>
        </div>

        {/* In Consult Column */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-blue-800 uppercase text-sm tracking-wider">
              In Consultation <span className="ml-2 bg-blue-200 text-blue-800 py-0.5 px-2 rounded-full text-xs">{inConsult.length}</span>
            </h2>
            <i className="fa-solid fa-user-doctor text-blue-400"></i>
          </div>
          <div className="space-y-3">
            {inConsult.length === 0 ? (
              <p className="text-sm text-blue-400 text-center py-8">Doctor is free.</p>
            ) : (
              inConsult.map(appt => <AppointmentCard key={appt.id} appt={appt} />)
            )}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-green-50 rounded-xl p-4 border border-green-100 h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-green-800 uppercase text-sm tracking-wider">
              Completed <span className="ml-2 bg-green-200 text-green-800 py-0.5 px-2 rounded-full text-xs">{done.length}</span>
            </h2>
            <i className="fa-solid fa-check-circle text-green-400"></i>
          </div>
          <div className="space-y-3">
            {done.length === 0 ? (
              <p className="text-sm text-green-500 text-center py-8">No completed visits yet.</p>
            ) : (
              done.map(appt => <AppointmentCard key={appt.id} appt={appt} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;