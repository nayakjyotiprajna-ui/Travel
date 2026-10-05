import React, { useState, useEffect } from 'react';
import { adminApi, destinationApi } from '../services/api';
import type { Destination, User } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Shield,
  Users,
  Compass,
  Sliders,
  Eye,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  PieChart as PieIcon,
  Check,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal for Add/Edit Destination
  const [showDestModal, setShowDestModal] = useState(false);
  const [editingDest, setEditingDest] = useState<any | null>(null);
  const [destFormData, setDestFormData] = useState({
    name: '',
    state: '',
    country: 'India',
    description: '',
    shortDescription: '',
    category: 'Mountains',
    bannerImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, destsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        destinationApi.getAll(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (destsRes.data.success) setDestinations(destsRes.data.destinations);
    } catch (err) {
      console.warn('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteDestination = async (id: string) => {
    if (!window.confirm('Delete this destination?')) return;
    try {
      await destinationApi.delete(id);
      setDestinations((prev) => prev.filter((d) => d._id !== id));
    } catch (e) {
      alert('Failed to delete destination.');
    }
  };

  const handleOpenAddModal = () => {
    setEditingDest(null);
    setDestFormData({
      name: '',
      state: '',
      country: 'India',
      description: '',
      shortDescription: '',
      category: 'Mountains',
      bannerImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
      featured: true,
    });
    setShowDestModal(true);
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDest) {
        await destinationApi.update(editingDest._id, destFormData);
      } else {
        await destinationApi.create({
          ...destFormData,
          coordinates: { lat: 20.5937, lng: 78.9629 },
          attractions: [
            { name: `${destFormData.name} Heritage Core`, description: 'Iconic panoramic sightline' },
          ],
          activities: [
            { id: `act-${Date.now()}`, title: 'Scenic Panorama Walk', description: 'Explore landmarks', type: 'exploration', xpReward: 60, duration: '5 mins', difficulty: 'Easy' },
          ],
          accessibility: { wheelchairAccessible: true, mobilityRating: 4, audioSupportAvailable: true, terrainDifficulty: 'Moderate' },
          culture: { traditions: 'Regional arts', etiquette: 'Modest attire', language: 'Hindi & English' },
          food: [{ name: 'Regional Delicacy', description: 'Traditional local cuisine', veg: true, iconic: true }],
          simulationDefaults: { avgHotelPrice: 85, avgDailyBudget: 50, bestSeason: 'Autumn', peakCrowdMonths: ['Dec'] },
        });
      }
      setShowDestModal(false);
      fetchAdminData();
    } catch (e: any) {
      alert('Error saving destination: ' + (e.response?.data?.message || e.message));
    }
  };

  if (loading) return <LoadingSpinner label="Loading Platform Administration Console..." />;

  const COLORS = ['#06B6D4', '#14B8A6', '#F59E0B', '#8B5CF6', '#EC4899', '#38BDF8'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-aurora-purple uppercase">
            Platform Command Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 flex items-center gap-3">
            <Shield className="w-8 h-8 text-aurora-purple" />
            <span>TravelTwin Admin Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Global telemetry, destination content management, and user cohort monitoring.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 glass-button-primary rounded-xl text-xs font-bold shadow-glow-cyan flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </button>
      </div>

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Registered Users', val: stats?.totalUsers || users.length, icon: Users, color: 'text-cyanAccent' },
          { label: 'Destinations', val: stats?.totalDestinations || destinations.length, icon: Compass, color: 'text-tealAccent' },
          { label: 'Virtual Visits', val: stats?.totalJourneys || 142, icon: Eye, color: 'text-amber-400' },
          { label: 'Trip Simulations', val: stats?.totalSimulations || 87, icon: Sliders, color: 'text-aurora-purple' },
        ].map((item, idx) => (
          <div key={idx} className="p-5 rounded-2xl glass-card border border-white/5 space-y-2">
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-2xl font-black text-white font-mono block">{item.val}</span>
            <span className="text-xs text-slate-400 font-sans">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Activity Bar Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyanAccent" />
              Monthly Virtual Visits vs Simulations Telemetry
            </h3>
            <span className="text-[10px] text-tealAccent font-mono">Live Telemetry</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlyData || []}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070C1B',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="virtualVisits" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Virtual Visits" />
                <Bar dataKey="simulations" fill="#14B8A6" radius={[6, 6, 0, 0]} name="Simulations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-400" />
              Category Coverage
            </h3>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.categoryDistribution || [{ name: 'Mountains', value: 2 }, { name: 'Beaches', value: 1 }, { name: 'Heritage', value: 2 }, { name: 'Nature', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ name }) => name}
                  fontSize={10}
                >
                  {(stats?.categoryDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070C1B',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Destination Management Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Compass className="w-4 h-4 text-tealAccent" />
          Destination Content Management ({destinations.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-slate-400 font-mono">
              <tr>
                <th className="pb-3">Name</th>
                <th className="pb-3">State / Country</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Wheelchair Ready</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {destinations.map((d) => (
                <tr key={d._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-semibold text-white">{d.name}</td>
                  <td className="py-3 text-slate-300">{d.state}, {d.country}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/20 font-mono text-[10px]">
                      {d.category}
                    </span>
                  </td>
                  <td className="py-3">
                    {d.accessibility?.wheelchairAccessible ? (
                      <span className="text-tealAccent flex items-center gap-1 font-mono">
                        <Check className="w-3.5 h-3.5" /> Accessible
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">Standard</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeleteDestination(d._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete destination"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Accounts Telemetry Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-cyanAccent" />
          Active Registered Users Cohort ({users.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-slate-400 font-mono">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">XP Points</th>
                <th className="pb-3">Travel Twin Level</th>
                <th className="pb-3 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                  </td>
                  <td className="py-3 font-mono">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      u.role === 'admin' ? 'bg-aurora-purple/20 text-aurora-purple' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-cyanAccent font-semibold">{u.xp} XP</td>
                  <td className="py-3 font-mono text-tealAccent">Level {u.level}</td>
                  <td className="py-3 text-right text-slate-400 font-mono text-[10px]">
                    Active
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Destination Modal */}
      {showDestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-cyanAccent/30 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Add New Destination to Atlas</h3>
              <button onClick={() => setShowDestModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-3.5 text-xs">
              <div>
                <label className="font-mono text-slate-300 block mb-1">Destination Name:</label>
                <input
                  type="text"
                  value={destFormData.name}
                  onChange={(e) => setDestFormData({ ...destFormData, name: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-white"
                  placeholder="e.g. Manali"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-slate-300 block mb-1">State / Region:</label>
                  <input
                    type="text"
                    value={destFormData.state}
                    onChange={(e) => setDestFormData({ ...destFormData, state: e.target.value })}
                    className="w-full glass-input rounded-xl p-2.5 text-white"
                    placeholder="Himachal Pradesh"
                    required
                  />
                </div>
                <div>
                  <label className="font-mono text-slate-300 block mb-1">Category:</label>
                  <select
                    value={destFormData.category}
                    onChange={(e) => setDestFormData({ ...destFormData, category: e.target.value })}
                    className="w-full glass-input rounded-xl p-2.5 text-white"
                  >
                    <option value="Mountains">Mountains</option>
                    <option value="Beaches">Beaches</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Nature">Nature</option>
                    <option value="Culture">Culture</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-slate-300 block mb-1">Short Description:</label>
                <input
                  type="text"
                  value={destFormData.shortDescription}
                  onChange={(e) => setDestFormData({ ...destFormData, shortDescription: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-white"
                  placeholder="One sentence summary"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-slate-300 block mb-1">Detailed Description:</label>
                <textarea
                  rows={2}
                  value={destFormData.description}
                  onChange={(e) => setDestFormData({ ...destFormData, description: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-white"
                  placeholder="Full travel narrative..."
                  required
                />
              </div>

              <div>
                <label className="font-mono text-slate-300 block mb-1">Banner Image URL:</label>
                <input
                  type="url"
                  value={destFormData.bannerImage}
                  onChange={(e) => setDestFormData({ ...destFormData, bannerImage: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDestModal(false)}
                  className="px-4 py-2 glass-button-secondary rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 glass-button-primary rounded-xl font-bold shadow-glow-cyan"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
