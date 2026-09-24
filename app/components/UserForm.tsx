'use client';
import { useState } from 'react';
import type { UserData } from '../types';

export default function UserForm({ onSubmit }: { onSubmit: (data: UserData) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    fitnessLevel: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      name: formData.name.trim(),
      age: parseInt(formData.age, 10),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
    } as UserData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Fitness Profile</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            maxLength={50}
            className="border p-2 w-full rounded" 
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input 
            type="number" 
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            min={10}
            max={100}
            step={1}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select 
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Height (cm)</label>
          <input 
            type="number" 
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            min={50}
            max={250}
            step="0.1"
            className="border p-2 w-full rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input 
            type="number" 
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            min={20}
            max={300}
            step="0.1"
            className="border p-2 w-full rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Fitness Goal</label>
          <select 
            value={formData.fitnessGoal}
            onChange={(e) => handleChange('fitnessGoal', e.target.value)}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Goal</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Fitness Level</label>
          <select 
            value={formData.fitnessLevel}
            onChange={(e) => handleChange('fitnessLevel', e.target.value)}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 font-semibold"
          >
            Generate My AI Fitness Plan
          </button>
        </div>
      </form>
    </div>
  );
}