import React, { useState, useEffect } from 'react';
import {
  Play,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  Users,
  Bell,
  Building,
  CheckCheck,
  Activity,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';

interface HackathonDemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
}

export const HackathonDemoTour: React.FC<HackathonDemoTourProps> = ({
  isOpen,
  onClose,
  setActiveTab
}) => {
  const {
    createIncident,
    verifyIncident,
    assignIncidentDepartment,
    updateIncidentStatus,
    incidents
  } = useIncidents();
  const { setRole } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [createdDemoId, setCreatedDemoId] = useState<string | null>(null);

  // Synchronize active view and role dynamically based on current step
  useEffect(() => {
    if (!isOpen) return;

    if (currentStep === 1 || currentStep === 2) {
      setActiveTab('home');
    } else if (currentStep === 3) {
      setActiveTab('clusters');
    } else if (currentStep === 4) {
      setActiveTab('verify');
    } else if (currentStep === 5) {
      setActiveTab('notifications');
    } else if (currentStep === 6 || currentStep === 7) {
      setRole('authority');
      setActiveTab('admin');
    } else if (currentStep === 8) {
      setActiveTab('home');
    } else if (currentStep === 9) {
      setActiveTab('health');
    }
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  const STEPS = [
    {
      step: 1,
      title: '1. Resident Reports a Road Hazard',
      desc: 'Resident Priya logs a severe pothole on 100ft road using GPS capture & photograph.',
      actionLabel: 'Execute Step 1 (Create Incident)',
      action: () => {
        setRole('resident');
        setActiveTab('home');
        const res = createIncident({
          title: 'Deep Crater Pothole on 100ft Rd Main Carriage',
          category: 'Road Hazards & Potholes',
          severity: 'High',
          description: 'Large 15cm deep pothole near Toit junction. Poses severe hazard to evening two-wheeler commuters.',
          location: {
            lat: 12.9722,
            lng: 77.6415,
            address: '100ft Road, opposite Toit, Indiranagar',
            neighbourhood: 'Indiranagar',
            ward: 'Ward 112'
          },
          imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          isAnonymous: false
        });
        setCreatedDemoId(res.incident.id);
      }
    },
    {
      step: 2,
      title: '2. Second Resident Reports Same Hazard',
      desc: 'Another resident at the same intersection submits a concurring report.',
      actionLabel: 'Execute Step 2 (Submit Concurring Report)',
      action: () => {
        setActiveTab('home');
        createIncident({
          title: 'Damaged Asphalt & Big Hole on 100ft Road',
          category: 'Road Hazards & Potholes',
          severity: 'High',
          description: 'Dangerous road hole near brewery junction, traffic slowing down drastically.',
          location: {
            lat: 12.9723,
            lng: 77.6417,
            address: '100ft Road, Toit Junction, Indiranagar',
            neighbourhood: 'Indiranagar',
            ward: 'Ward 112'
          },
          imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          isAnonymous: false
        });
      }
    },
    {
      step: 3,
      title: '3. AI Identifies Duplicate & Auto-Clusters',
      desc: 'System compares proximity (22m), category & Gemini semantic similarity, and auto-clusters reports into one unified docket.',
      actionLabel: 'Advance to Step 4 (Community Verification) →',
      action: () => {
        setActiveTab('verify');
      }
    },
    {
      step: 4,
      title: '4. Community Verifies Incident',
      desc: 'Neighbours cast confirmation upvotes. Once reaching 3+ confirmations, status becomes "Community Verified".',
      actionLabel: 'Execute Step 4 (Cast Consensus Upvotes)',
      action: () => {
        setActiveTab('verify');
        const target = incidents.find(i => i.title.includes('Crater Pothole') || i.id === createdDemoId) || incidents[0];
        if (target) {
          verifyIncident(target.id, true);
        }
      }
    },
    {
      step: 5,
      title: '5. Nearby Residents Receive Proximity Alert',
      desc: 'NeighbourNet triggers a high-priority proximity alert to residents within 2.5km notification radius.',
      actionLabel: 'View Notifications Center →',
      action: () => {
        setActiveTab('notifications');
      }
    },
    {
      step: 6,
      title: '6. Admin Reviews & Dispatches to PWD',
      desc: 'Municipal officer logs into Admin Portal and assigns ticket to "Municipal Road Works (PWD)".',
      actionLabel: 'Execute Step 6 (Assign PWD)',
      action: () => {
        setRole('authority');
        setActiveTab('admin');
        const target = incidents.find(i => i.title.includes('Crater Pothole') || i.id === createdDemoId) || incidents[0];
        if (target) {
          assignIncidentDepartment(target.id, 'Municipal Road Works (PWD)');
        }
      }
    },
    {
      step: 7,
      title: '7. Authority Marks In-Progress',
      desc: 'Field crew dispatches cold-mix asphalt truck to site and updates ticket status to "In Progress".',
      actionLabel: 'Execute Step 7 (Set In Progress)',
      action: () => {
        setRole('authority');
        setActiveTab('admin');
        const target = incidents.find(i => i.title.includes('Crater Pothole') || i.id === createdDemoId) || incidents[0];
        if (target) {
          updateIncidentStatus(target.id, 'In Progress', 'Asphalt road repair crew dispatched on-site.');
        }
      }
    },
    {
      step: 8,
      title: '8. Hazard Resolved with Verification Proof',
      desc: 'Repair completed, road surface leveled and validated. Ticket marked "Resolved" (+50 XP).',
      actionLabel: 'Execute Step 8 (Mark Resolved)',
      action: () => {
        setActiveTab('home');
        const target = incidents.find(i => i.title.includes('Crater Pothole') || i.id === createdDemoId) || incidents[0];
        if (target) {
          updateIncidentStatus(
            target.id,
            'Resolved',
            'Full asphalt repair completed by Municipal Road Works PWD. Road completely restored for commute.',
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
          );
        }
      }
    },
    {
      step: 9,
      title: '9. Neighbourhood Health Score Updates',
      desc: 'With the hazard cleared, the dynamic 0-100 Neighbourhood Health Score automatically updates in real time!',
      actionLabel: 'Finish Tour & Explore Health Score',
      action: () => {
        setActiveTab('health');
      }
    }
  ];

  const currentStepData = STEPS[currentStep - 1];

  const handleNext = () => {
    currentStepData.action();
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2070] w-full max-w-md bg-charcoal-900 border-2 border-violet-500 rounded-3xl p-5 shadow-2xl text-white select-none">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-750">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-violet-sm">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">
              Hackathon Guided Demo Flow
            </h3>
            <p className="text-[10px] text-lavender-300 font-mono">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-xl text-lavender-400 hover:text-white hover:bg-charcoal-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Info */}
      <div className="mt-3.5 space-y-1.5">
        <h4 className="font-extrabold text-sm text-amber-300">
          {currentStepData.title}
        </h4>
        <p className="text-xs text-lavender-300 leading-relaxed">
          {currentStepData.desc}
        </p>
      </div>

      {/* Quick View Switcher for Step 3 */}
      {currentStep === 3 && (
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('clusters')}
            className="flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold bg-violet-600/40 hover:bg-violet-600/60 border border-violet-400/40 text-violet-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Deduplication Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold bg-charcoal-800 hover:bg-charcoal-750 border border-charcoal-700 text-lavender-300 transition-all flex items-center justify-center gap-1.5"
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Spatial Map View</span>
          </button>
        </div>
      )}

      {/* Progress Pills */}
      <div className="mt-3 flex items-center gap-1">
        {STEPS.map(s => (
          <div
            key={s.step}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              s.step < currentStep
                ? 'bg-emerald-400'
                : s.step === currentStep
                ? 'bg-violet-500 ring-2 ring-violet-400/50'
                : 'bg-charcoal-800'
            }`}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-charcoal-750 flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="p-2 rounded-xl text-lavender-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-violet-500 to-violet-700 text-white shadow-violet-sm hover:brightness-110 active:scale-95 transition-all"
        >
          <span>{currentStepData.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {currentStep < STEPS.length && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="p-2 rounded-xl text-lavender-400 hover:text-white transition-colors"
            title="Skip to next step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};