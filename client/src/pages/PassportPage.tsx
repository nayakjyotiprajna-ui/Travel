import React, { useState, useEffect } from 'react';
import { passportApi } from '../services/api';
import { PassportBook } from '../components/passport/PassportBook';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

export const PassportPage: React.FC = () => {
  const [passportData, setPassportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPassport = async () => {
    setLoading(true);
    try {
      const res = await passportApi.getPassport();
      if (res.data.success) {
        setPassportData(res.data.passport);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassport();
  }, []);

  if (loading) return <LoadingSpinner label="Authenticating Digital Travel Passport..." />;
  if (error || !passportData) {
    return (
      <ErrorState
        title="Passport Unavailable"
        message="Please log in to view and verify your official digital travel passport."
        onRetry={fetchPassport}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-tealAccent uppercase">
            Official Credentials
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 flex items-center gap-3">
            <span>🌍 My Virtual Passport</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Certified visa stamps, achievements, and earned XP from your virtual & simulated expeditions.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tealAccent/15 border border-tealAccent/30 text-tealAccent text-xs font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>Cryptographically Verified ID</span>
        </div>
      </div>

      {/* Passport Booklet Component */}
      <PassportBook passportData={passportData} />
    </div>
  );
};
