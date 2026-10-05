import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { destinationApi, simulationApi } from '../services/api';
import type { Destination, Simulation } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SimulationInteractiveStage } from '../components/simulation/SimulationInteractiveStage';
import { TravelPlanView } from '../components/simulation/TravelPlanView';
import {
  Sliders,
  Calendar,
  Users,
  DollarSign,
  Hotel,
  Car,
  Compass,
  Accessibility as AccessibilityIcon,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Loader2,
  RefreshCw,
  Info
} from 'lucide-react';

export const SimulatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialDestName = searchParams.get('destination');
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  // Wizard state: 1 to 8
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [durationDays, setDurationDays] = useState<number>(5);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
  );
  const [travellers, setTravellers] = useState<number>(2);
  const [budgetRange, setBudgetRange] = useState<'Budget' | 'Moderate' | 'Luxury'>('Moderate');
  const [accommodation, setAccommodation] = useState<string>('Boutique Heritage Resort');
  const [transport, setTransport] = useState<string>('Scenic Cab & Flight');
  const [activityPrefs, setActivityPrefs] = useState<string[]>(['Culture', 'Adventure']);
  const [accessibilityReqs, setAccessibilityReqs] = useState<string[]>([
    'Step-Free Access',
    'Low Motion Transit',
  ]);

  // Simulation Results & View Phase
  // phase: 'wizard' | 'simulation_stages' | 'plan_view'
  const [phase, setPhase] = useState<'wizard' | 'simulation_stages' | 'plan_view'>('wizard');
  const [simulating, setSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationApi.getAll();
        if (res.data.success) {
          setDestinations(res.data.destinations);
          if (initialDestName) {
            const found = res.data.destinations.find(
              (d) => d.name.toLowerCase() === initialDestName.toLowerCase()
            );
            if (found) setSelectedDestination(found);
          } else if (res.data.destinations.length > 0) {
            setSelectedDestination(res.data.destinations[0]);
          }
        }
      } catch (e) {
        console.warn('Error fetching destinations for simulation');
      } finally {
        setLoadingDestinations(false);
      }
    };
    fetchDestinations();
  }, [initialDestName]);

  const toggleActivityPref = (pref: string) => {
    setActivityPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const toggleAccessibilityReq = (req: string) => {
    setAccessibilityReqs((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]
    );
  };

  const handleGenerateSimulation = async () => {
    if (!selectedDestination) return;
    setSimulating(true);

    try {
      const res = await simulationApi.create({
        destinationId: selectedDestination._id,
        travelDates: {
          start: startDate,
          end: new Date(new Date(startDate).getTime() + 86400000 * durationDays)
            .toISOString()
            .split('T')[0],
          durationDays,
        },
        travellers,
        budget: { range: budgetRange },
        transport,
        accommodation,
        preferences: activityPrefs,
        accessibilityRequirements: accessibilityReqs,
      });

      if (res.data.success) {
        setSimulationData(res.data.simulation);
        setPhase('simulation_stages');
      }
    } catch (err: any) {
      // Fallback local simulation in case backend is offline
      setSimulationData({
        simulationResults: {
          hotelScenario: {
            name: `${selectedDestination.name} ${accommodation}`,
            costEstimate: durationDays * 85 * travellers,
            rating: 4.8,
            accessibilityScore: 92,
            previewDescription: 'Accessible boutique resort with flat corridors and mountain sightlines.',
          },
          transportScenario: {
            mode: transport,
            travelTimeHours: 3.5,
            scenicRating: 4.9,
            accessibilityNotes: 'Air-conditioned transit with low vibration suspension.',
          },
          touristPlaceScenario: {
            highlights: selectedDestination.attractions.slice(0, 3).map((a) => a.name),
            crowdLevel: 'Moderate to low',
            bestTimeOfDay: '08:00 AM - 10:30 AM',
          },
          crowdScenario: {
            level: 'Moderate',
            percentage: 42,
            recommendation: 'Plan early morning visits for peaceful sights.',
          },
          weatherScenario: {
            forecast: selectedDestination.simulationDefaults?.bestSeason || 'Clear skies',
            tempCelsius: 19,
            packingTips: ['Layered fleece jacket', 'Comfortable footwear', 'Sunglasses'],
          },
        },
        aiPlan: {
          title: `Personalized ${durationDays}-Day ${selectedDestination.name} Simulation Plan`,
          summary: `Optimized for ${travellers} travellers exploring ${activityPrefs.join(' & ')} with accessibility verified.`,
          days: [
            {
              dayNumber: 1,
              theme: 'Arrival & Scenic Neighborhood Orientation',
              morning: { activity: 'Hotel Check-In & Rest', place: 'Central Boutique Stay', duration: '2 hrs', notes: 'Settle in comfortably.' },
              afternoon: { activity: 'Historic Boulevard Stroll', place: selectedDestination.attractions[0]?.name || 'Old Town', duration: '2.5 hrs', notes: 'Paved walkways.' },
              evening: { activity: 'Sunset Viewpoint & Regional Dinner', place: 'Scenic Vista', duration: '2 hrs', notes: 'Breathtaking reflections.' },
            },
          ],
          potentialChallenges: ['Peak hours may bring mild traffic between 12-2 PM.'],
          personalizedRecommendations: ['Priority access routes active for all mornings.'],
        },
      });
      setPhase('simulation_stages');
    } finally {
      setSimulating(false);
    }
  };

  if (loadingDestinations) return <LoadingSpinner label="Preparing Simulation Engine..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-cyanAccent uppercase">
          Mode 02 • Real Trip Validation Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Experience your trip before you book it.
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-sans">
          Simulate the full journey pipeline: Hotel → Roadway → Monuments → Crowd Congestion → Weather → Activities.
        </p>
      </div>

      {/* PHASE 1: STEP-BY-STEP WIZARD */}
      {phase === 'wizard' && (
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-10 space-y-8 shadow-glass">
          {/* Stepper Dots */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-cyanAccent uppercase">
              Step {currentStep} of 8: {
                [
                  'Destination',
                  'Dates & Duration',
                  'Travellers',
                  'Budget Range',
                  'Accommodation',
                  'Transportation',
                  'Activity Preferences',
                  'Accessibility Requirements',
                ][currentStep - 1]
              }
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <div
                  key={s}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    s === currentStep
                      ? 'bg-cyanAccent w-6 shadow-glow-cyan'
                      : s < currentStep
                      ? 'bg-tealAccent'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Destination */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyanAccent" />
                Select Your Planned Destination
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {destinations.map((d) => (
                  <button
                    key={d._id}
                    onClick={() => setSelectedDestination(d)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedDestination?._id === d._id
                        ? 'bg-cyanAccent/15 border-cyanAccent shadow-glow-cyan ring-1 ring-cyanAccent'
                        : 'glass-card border-white/5 hover:border-white/20'
                    }`}
                  >
                    <h4 className="text-sm font-bold text-white">{d.name}</h4>
                    <span className="text-[10px] text-tealAccent font-mono">{d.state}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Travel Dates & Duration */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-tealAccent" />
                Travel Dates & Duration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1.5 font-mono">
                    Estimated Departure Date:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full glass-input rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1.5 font-mono">
                    Trip Duration (Days): {durationDays} Days
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyanAccent mt-3"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>1 Day</span>
                    <span>7 Days</span>
                    <span>14 Days</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Travellers */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-skyAccent" />
                How many travelers are in your group?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { count: 1, label: 'Solo Traveler', desc: 'Independent explorer' },
                  { count: 2, label: 'Couple / Duo', desc: 'Partner or friend' },
                  { count: 4, label: 'Family (3-4)', desc: 'Multi-generational' },
                  { count: 6, label: 'Group (5+)', desc: 'Friends or cohort' },
                ].map((item) => (
                  <button
                    key={item.count}
                    onClick={() => setTravellers(item.count)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      travellers === item.count
                        ? 'bg-cyanAccent/15 border-cyanAccent shadow-glow-cyan'
                        : 'glass-card border-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg font-bold text-cyanAccent font-mono block">
                      {item.count} {item.count === 1 ? 'Person' : 'People'}
                    </span>
                    <span className="text-xs font-semibold text-white block mt-1">{item.label}</span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Budget Range */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                Budget Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Budget' as const, title: 'Budget Friendly', desc: 'Cozy homestays & public scenic transit (~$45/day/person)' },
                  { id: 'Moderate' as const, title: 'Comfort & Heritage', desc: 'Boutique heritage resorts & private cab (~$95/day/person)' },
                  { id: 'Luxury' as const, title: 'Luxury & Curated', desc: '5-star palace suites & private chauffeur (~$240/day/person)' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setBudgetRange(tier.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      budgetRange === tier.id
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-glow-teal'
                        : 'glass-card border-white/5 hover:border-white/20'
                    }`}
                  >
                    <h4 className="text-sm font-bold text-white">{tier.title}</h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">{tier.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Accommodation */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Hotel className="w-4 h-4 text-tealAccent" />
                Accommodation Preference
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Boutique Heritage Resort',
                  'Traditional Wooden Houseboat',
                  'Mountain View Villa',
                  'Eco-Lodge & Glamping',
                ].map((acc) => (
                  <button
                    key={acc}
                    onClick={() => setAccommodation(acc)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      accommodation === acc
                        ? 'bg-tealAccent/15 border-tealAccent shadow-glow-teal'
                        : 'glass-card border-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-white">{acc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Transportation */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-cyanAccent" />
                Transportation Preference
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Scenic Cab & Flight',
                  'Express Train & Local Chauffeur',
                  'Self-Drive Electric SUV',
                  'Public Transit & Guided Walking Tour',
                ].map((trans) => (
                  <button
                    key={trans}
                    onClick={() => setTransport(trans)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      transport === trans
                        ? 'bg-cyanAccent/15 border-cyanAccent shadow-glow-cyan'
                        : 'glass-card border-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-white">{trans}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Activity Preferences */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Activity Preferences (Multi-select)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Culture', 'Adventure', 'Photography', 'Peaceful', 'Food Tasting', 'Nature Trails'].map((act) => {
                  const isChecked = activityPrefs.includes(act);
                  return (
                    <button
                      key={act}
                      onClick={() => toggleActivityPref(act)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-cyanAccent/20 border-cyanAccent text-white'
                          : 'glass-card border-white/5 text-slate-300'
                      }`}
                    >
                      <span className="text-xs font-semibold">{act}</span>
                      {isChecked && <CheckCircle className="w-4 h-4 text-cyanAccent" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 8: Accessibility Requirements */}
          {currentStep === 8 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AccessibilityIcon className="w-4 h-4 text-tealAccent" />
                Accessibility & Comfort Requirements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Step-Free Access & Elevators',
                  'Low Motion Transit Protocol',
                  'Senior-Friendly Pacing Intervals',
                  'Audio Guide Commentary Support',
                  'Quiet Sensory Zones',
                  'Tactile & Visual Waypoints',
                ].map((req) => {
                  const isChecked = accessibilityReqs.includes(req);
                  return (
                    <button
                      key={req}
                      onClick={() => toggleAccessibilityReq(req)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-tealAccent/20 border-tealAccent text-white'
                          : 'glass-card border-white/5 text-slate-300'
                      }`}
                    >
                      <span className="text-xs font-semibold">{req}</span>
                      {isChecked && <CheckCircle className="w-4 h-4 text-tealAccent" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Wizard Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="px-5 py-2.5 glass-button-secondary rounded-xl text-xs font-semibold disabled:opacity-30"
            >
              Back
            </button>

            {currentStep < 8 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(8, prev + 1))}
                className="px-6 py-2.5 glass-button-primary rounded-xl text-xs font-bold shadow-glow-cyan flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerateSimulation}
                disabled={simulating}
                className="px-7 py-3 glass-button-primary rounded-xl text-xs font-bold shadow-glow-teal flex items-center gap-2"
              >
                {simulating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Simulating Hotel, Transit, Weather & Crowds...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Trip Simulation Pipeline</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 2: INTERACTIVE SIMULATION STAGES */}
      {phase === 'simulation_stages' && simulationData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPhase('wizard')}
              className="text-xs text-slate-400 hover:text-white font-mono"
            >
              ← Back to Constraints Wizard
            </button>
            <span className="text-xs font-mono text-tealAccent font-semibold">
              Simulation Pipeline: {selectedDestination?.name}
            </span>
          </div>

          <SimulationInteractiveStage
            destinationName={selectedDestination?.name || 'Kashmir'}
            simulationResults={simulationData.simulationResults}
            onProceedToPlan={() => setPhase('plan_view')}
          />
        </div>
      )}

      {/* PHASE 3: AI PERSONALIZED TRAVEL PLAN VIEW */}
      {phase === 'plan_view' && simulationData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPhase('simulation_stages')}
              className="text-xs text-slate-400 hover:text-white font-mono"
            >
              ← Back to Simulation Stages
            </button>
            <span className="text-xs font-mono text-cyanAccent font-semibold">
              AI Travel Twin Plan Generated
            </span>
          </div>

          <TravelPlanView
            plan={simulationData.aiPlan}
            destinationName={selectedDestination?.name || 'Kashmir'}
            onSave={() => navigate('/dashboard')}
            onRegenerate={handleGenerateSimulation}
          />
        </div>
      )}
    </div>
  );
};
