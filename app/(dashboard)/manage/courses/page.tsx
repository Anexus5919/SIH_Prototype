'use client';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Course {
  _id?: string;
  courseCode: string;
  title: string;
  credits: number;
  courseType: 'Theory' | 'Practical' | 'Lab' | 'Skill' | 'Value';
  program: string;
  contactHours: number;
  requiresLab: boolean;
}

const initialFormState: Course = { courseCode: '', title: '', credits: 3, courseType: 'Theory', program: 'FYUP', contactHours: 3, requiresLab: false };

export default function ManageCoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Course>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCourses = async () => {
    if (!token) return;
    const res = await fetch('http://localhost:5001/api/data/courses', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setCourses(await res.json());
  };

  useEffect(() => { fetchCourses(); }, [token]);

  const openModalForCreate = () => { setEditingId(null); setFormData(initialFormState); setIsModalOpen(true); };
  const openModalForEdit = (course: Course) => { setEditingId(course._id!); setFormData(course); setIsModalOpen(true); };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData({ ...formData, [name]: checked });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:5001/api/data/courses/${editingId}` : 'http://localhost:5001/api/data/courses';
    const method = editingId ? 'PUT' : 'POST';

    // Ensure numeric values are sent as numbers
    const submissionData = {
        ...formData,
        credits: Number(formData.credits),
        contactHours: Number(formData.contactHours),
    };

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(submissionData) });
    if (res.ok) { setIsModalOpen(false); await fetchCourses(); } else { alert('Failed to save course.'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    const res = await fetch(`http://localhost:5001/api/data/courses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) await fetchCourses(); else alert('Failed to delete course.');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8"><h1 className="text-4xl font-bold">Manage Courses</h1><Button onClick={openModalForCreate} className="bg-blue-600 hover:bg-blue-700"><FiPlus className="inline-block mr-2" /> Add Course</Button></div>
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-gray-300 dark:border-gray-700"><th className="p-3">Code</th><th className="p-3">Title</th><th className="p-3">Credits</th><th className="p-3">Hours</th><th className="p-3">Needs Lab</th><th className="p-3 text-right">Actions</th></tr></thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                  <td className="p-3 font-mono">{course.courseCode}</td><td className="p-3">{course.title}</td><td className="p-3 text-center">{course.credits}</td><td className="p-3 text-center">{course.contactHours}</td><td className="p-3 text-center">{course.requiresLab ? 'Yes' : 'No'}</td>
                  <td className="p-3 flex gap-2 justify-end"><button onClick={() => openModalForEdit(course)} className="p-2 hover:text-blue-400"><FiEdit /></button><button onClick={() => handleDelete(course._id!)} className="p-2 hover:text-red-400"><FiTrash2 /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {courses.length === 0 && <div className="text-center py-8 text-gray-500">No courses found.</div>}
        </div>
      </GlassCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Course' : 'Add New Course'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-sm">Course Code</label><input type="text" name="courseCode" value={formData.courseCode} onChange={handleInputChange} required className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"/></div>
          <div><label className="text-sm">Title</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm">Credits</label><input type="number" name="credits" value={formData.credits} onChange={handleInputChange} required min="1" className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"/></div>
            <div><label className="text-sm">Contact Hours/Week</label><input type="number" name="contactHours" value={formData.contactHours} onChange={handleInputChange} required min="1" className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"/></div>
          </div>
          <div><label className="text-sm">Course Type</label><select name="courseType" value={formData.courseType} onChange={handleInputChange} className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"><option>Theory</option><option>Practical</option><option>Lab</option><option>Skill</option><option>Value</option></select></div>
          <div><label className="text-sm">Program</label><input type="text" name="program" value={formData.program} onChange={handleInputChange} required className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md"/></div>
          <div className="flex items-center gap-2 pt-2"><input type="checkbox" name="requiresLab" checked={formData.requiresLab} onChange={handleInputChange} className="h-4 w-4 rounded" /><label className="text-sm">Requires a Lab Room</label></div>
          <div className="pt-4"><Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Save Course</Button></div>
        </form>
      </Modal>
    </div>
  );
}