'use client';
import { useState, useEffect, useCallback, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Faculty {
  _id?: string;
  name: string;
  expertise: string[] | string;
  maxWorkload: number;
}

const initialFormState: Faculty = { name: '', expertise: '', maxWorkload: 16 };

export default function ManageFacultyPage() {
  const { token } = useAuth();
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Faculty>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchFaculty = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5001/api/data/faculty', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch faculty data');
      const data = await res.json();
      setFacultyList(data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const openModalForCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openModalForEdit = (faculty: Faculty) => {
    setEditingId(faculty._id!);
    setFormData({ ...faculty, expertise: Array.isArray(faculty.expertise) ? faculty.expertise.join(', ') : '' });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:5001/api/data/faculty/${editingId}` : 'http://localhost:5001/api/data/faculty';
    const method = editingId ? 'PUT' : 'POST';

    const submissionData = { ...formData, expertise: (formData.expertise as string).split(',').map(item => item.trim()).filter(Boolean) };

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(submissionData) });
    
    if (res.ok) {
      setIsModalOpen(false);
      await fetchFaculty();
    } else {
      alert('Failed to save faculty.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    const res = await fetch(`http://localhost:5001/api/data/faculty/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) await fetchFaculty();
    else alert('Failed to delete faculty.');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Faculty</h1>
        <Button onClick={openModalForCreate} className="bg-blue-600 hover:bg-blue-700">
          <FiPlus className="inline-block mr-2" /> Add Faculty
        </Button>
      </div>

      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-gray-300 dark:border-gray-700"><th className="p-3">Name</th><th className="p-3">Expertise</th><th className="p-3">Max Workload</th><th className="p-3 text-right">Actions</th></tr></thead>
            <tbody>
              {facultyList.map((faculty) => (
                <tr key={faculty._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-700/ ৫০">
                  <td className="p-3 font-semibold">{faculty.name}</td>
                  <td className="p-3 text-sm">{Array.isArray(faculty.expertise) ? faculty.expertise.join(', ') : ''}</td>
                  <td className="p-3 text-center">{faculty.maxWorkload}</td>
                  <td className="p-3 flex gap-2 justify-end">
                    <button onClick={() => openModalForEdit(faculty)} className="p-2 hover:text-blue-400"><FiEdit /></button>
                    <button onClick={() => handleDelete(faculty._id!)} className="p-2 hover:text-red-400"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {facultyList.length === 0 && <div className="text-center py-8 text-gray-500">No faculty members found.</div>}
        </div>
      </GlassCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Faculty' : 'Add New Faculty'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm">Full Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"/></div>
          <div><label className="text-sm">Expertise</label><input type="text" name="expertise" value={formData.expertise} onChange={handleInputChange} placeholder="e.g., CS101, MA203" required className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"/><p className="text-xs text-gray-500 mt-1">Comma-separated course codes.</p></div>
          <div><label className="text-sm">Max Workload (Hrs/Week)</label><input type="number" name="maxWorkload" value={formData.maxWorkload} onChange={handleInputChange} required min="1" className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"/></div>
          <div className="pt-4"><Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Save Faculty</Button></div>
        </form>
      </Modal>
    </div>
  );
}