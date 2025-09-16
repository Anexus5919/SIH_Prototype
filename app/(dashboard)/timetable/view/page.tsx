'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTimetable } from '@/context/TimetableContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FiDownload, FiAlertTriangle, FiMessageSquare, FiChevronDown, FiEdit } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState, Fragment } from 'react';
import { Popover, Transition, Menu } from '@headlessui/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface ScheduleEntry {
  _id: string;
  day: string;
  time: string;
  status: 'Scheduled' | 'Cancelled';
  comment: string;
  course: { courseCode: string; title: string; };
  faculty: { name: string; };
  room: { roomNumber: string; };
}

export default function ViewTimetablePage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { latestTimetable, setLatestTimetable } = useTimetable();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<ScheduleEntry | null>(null);
  const [formData, setFormData] = useState({ status: 'Scheduled', comment: '' });

  const openEditModal = (slot: ScheduleEntry) => {
    setCurrentSlot(slot);
    setFormData({ status: slot.status, comment: slot.comment || '' });
    setIsModalOpen(true);
  };
  
  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSlot) return;
    const res = await fetch(`http://localhost:5001/api/timetables/${latestTimetable._id}/slots/${currentSlot._id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
      body: JSON.stringify(formData) 
    });
    if (res.ok) {
      const updatedSlotData = await res.json();
      const newSchedule = latestTimetable.schedule.map((s: ScheduleEntry) => s._id === currentSlot._id ? { ...s, ...updatedSlotData } : s);
      setLatestTimetable({ ...latestTimetable, schedule: newSchedule });
      setIsModalOpen(false);
    } else { 
      alert('Failed to update status.'); 
    }
  };

  const handleExportPDF = () => {
    const timetableElement = document.getElementById('timetable-to-export');
    if (!timetableElement) {
      console.error("Export failed: Timetable element not found.");
      return;
    }
    
    html2canvas(timetableElement, { scale: 2, useCORS: true, backgroundColor: null })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('timetable.pdf');
      })
      .catch(err => {
        console.error("PDF Export failed:", err);
        alert("Sorry, the PDF export failed. Please try again.");
      });
  };

  const handleExportCSV = () => {
    if (!latestTimetable) return;

    const formattedSchedule: Record<string, Record<string, ScheduleEntry>> = {};
    for (const entry of latestTimetable.schedule) {
        if (!formattedSchedule[entry.day]) formattedSchedule[entry.day] = {};
        formattedSchedule[entry.day][entry.time] = entry;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Time," + days.join(",") + "\r\n";

    timeSlots.forEach(time => {
        const row = [time];
        days.forEach(day => {
            const entry = formattedSchedule[day]?.[time];
            if (entry) {
                const cellData = `"${entry.course.courseCode} | ${entry.faculty.name} | Room: ${entry.room.roomNumber}"`;
                row.push(cellData);
            } else if (time === "13:00") {
                row.push("Lunch Break");
            } else {
                row.push("");
            }
        });
        csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "timetable.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!latestTimetable || !latestTimetable.schedule || latestTimetable.schedule.length === 0) {
    return ( 
      <GlassCard className="p-8 text-center">
        <FiAlertTriangle size={48} className="mx-auto text-yellow-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Timetable to Display</h2>
        <p className="text-gray-400 mb-6">Please generate a new timetable first to view it here.</p>
        <Button onClick={() => router.push('/timetable/generate')} className="bg-blue-600 hover:bg-blue-700">
          Go to Generator
        </Button>
      </GlassCard> 
    );
  }

  const formattedSchedule: Record<string, Record<string, ScheduleEntry>> = {};
  for (const entry of latestTimetable.schedule) {
    if (!formattedSchedule[entry.day]) formattedSchedule[entry.day] = {};
    formattedSchedule[entry.day][entry.time] = entry;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Generated Schedule</h1>
        
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button as={Button} className="bg-blue-600 hover:bg-blue-700 inline-flex items-center">
              <FiDownload className="inline-block mr-2" />
              Export
              <FiChevronDown className="ml-2 -mr-1 h-5 w-5" />
            </Menu.Button>
          </div>
          <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => ( <button onClick={handleExportPDF} className={`${active ? 'bg-blue-500 text-white' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Export as PDF</button> )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => ( <button onClick={handleExportCSV} className={`${active ? 'bg-blue-500 text-white' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Export as CSV</button> )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <GlassCard id="timetable-to-export" className="p-4 md:p-6 overflow-x-auto bg-white dark:bg-gray-900">
        <table className="w-full min-w-[900px] border-collapse text-center table-fixed">
          <thead>
            <tr>
              <th className="p-3 w-28 border-b border-gray-300 dark:border-gray-700">Time</th>
              {days.map(day => <th key={day} className="p-3 border-b border-gray-300 dark:border-gray-700">{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => {
              if (time === "13:00") {
                return (
                  <tr key="break-time" className="h-16">
                    <td className="p-3 font-semibold text-blue-400 dark:text-blue-300 border-r border-gray-200 dark:border-gray-700 align-middle">{time}</td>
                    <td colSpan={days.length} className="text-center bg-gray-200/50 dark:bg-gray-800/50 align-middle">
                      <p className="font-semibold text-gray-500">Lunch Break</p>
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={time} className="h-28">
                  <td className="p-3 font-semibold text-blue-400 dark:text-blue-300 border-r border-gray-200 dark:border-gray-700 align-top">{time}</td>
                  {days.map(day => {
                    const entry = formattedSchedule[day]?.[time];
                    return (
                      <td key={`${day}-${time}`} className="p-1 border-r border-gray-200 dark:border-gray-800 last:border-r-0 align-top">
                        {entry && (
                          <motion.div
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            onClick={() => user?.role === 'Faculty' && openEditModal(entry)}
                            className={`p-3 h-full rounded-lg text-left text-sm shadow-lg relative ${user?.role === 'Faculty' ? 'cursor-pointer' : ''} ${entry.status === 'Cancelled' ? 'bg-red-500/20 dark:bg-red-800/50 opacity-60' : 'bg-gray-200 dark:bg-gray-800/50 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
                          >
                            {user?.role === 'Faculty' && <FiEdit className="absolute top-2 right-2 text-gray-500/50"/>}
                            <p className={`font-bold text-gray-900 dark:text-white ${entry.status === 'Cancelled' && 'line-through'}`}>{entry.course.courseCode}</p>
                            <p className={`text-gray-600 dark:text-gray-300 text-xs ${entry.status === 'Cancelled' && 'line-through'}`}>{entry.faculty.name}</p>
                            <p className={`text-gray-500 dark:text-gray-400 text-xs mt-1 ${entry.status === 'Cancelled' && 'line-through'}`}>{entry.room.roomNumber}</p>
                            
                            {entry.comment && (
                                <Popover className="relative mt-2">
                                    <Popover.Button className="text-blue-500 flex items-center gap-1 text-xs outline-none hover:underline">
                                        <FiMessageSquare/> View Comment
                                    </Popover.Button>
                                    <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                                      <Popover.Panel className="absolute z-10 w-48 p-2 text-xs bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600">
                                        {entry.comment}
                                      </Popover.Panel>
                                    </Transition>
                                </Popover>
                            )}
                          </motion.div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Class Status">
        <form onSubmit={handleStatusUpdate} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Comment</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Update Status
          </Button>
        </form>
      </Modal>
    </div>
  );
}