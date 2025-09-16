'use client';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Room {
  _id?: string;
  roomNumber: string;
  capacity: number;
  roomType: 'Lecture Hall' | 'Lab' | 'Seminar Room';
}

const initialFormState: Room = { roomNumber: '', capacity: 30, roomType: 'Lecture Hall' };

export default function ManageRoomsPage() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Room>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchRooms = async () => {
    if (!token) return;
    const res = await fetch('http://localhost:5001/api/data/rooms', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setRooms(await res.json());
  };

  useEffect(() => { fetchRooms(); }, [token]);

  const openModalForCreate = () => { setEditingId(null); setFormData(initialFormState); setIsModalOpen(true); };
  const openModalForEdit = (room: Room) => { setEditingId(room._id!); setFormData(room); setIsModalOpen(true); };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:5001/api/data/rooms/${editingId}` : 'http://localhost:5001/api/data/rooms';
    const method = editingId ? 'PUT' : 'POST';

    // Ensure numeric values are sent as numbers
    const submissionData = {
        ...formData,
        capacity: Number(formData.capacity),
    };

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(submissionData) });
    if (res.ok) { setIsModalOpen(false); await fetchRooms(); } else { alert('Failed to save room.'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    const res = await fetch(`http://localhost:5001/api/data/rooms/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) await fetchRooms(); else alert('Failed to delete room.');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8"><h1 className="text-4xl font-bold">Manage Rooms</h1><Button onClick={openModalForCreate} className="bg-blue-600 hover:bg-blue-700"><FiPlus className="inline-block mr-2" /> Add Room</Button></div>
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-gray-300 dark:border-gray-700"><th className="p-3">Room Number</th><th className="p-3">Type</th><th className="p-3">Capacity</th><th className="p-3 text-right">Actions</th></tr></thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                  <td className="p-3 font-semibold">{room.roomNumber}</td><td className="p-3">{room.roomType}</td><td className="p-3 text-center">{room.capacity}</td>
                  <td className="p-3 flex gap-2 justify-end"><button onClick={() => openModalForEdit(room)} className="p-2 hover:text-blue-400"><FiEdit /></button><button onClick={() => handleDelete(room._id!)} className="p-2 hover:text-red-400"><FiTrash2 /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {rooms.length === 0 && (
            <div className="text-center py-8 text-gray-500">No rooms found.</div>
          )}
        </div>
      </GlassCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Room' : 'Add New Room'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm">Room Number</label><input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} required className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"/></div>
          <div><label className="text-sm">Capacity</label><input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required min="1" className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"/></div>
          <div><label className="text-sm">Room Type</label><select name="roomType" value={formData.roomType} onChange={handleInputChange} className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"><option>Lecture Hall</option><option>Lab</option><option>Seminar Room</option></select></div>
          <div className="pt-4"><Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Save Room</Button></div>
        </form>
      </Modal>
    </div>
  );
}