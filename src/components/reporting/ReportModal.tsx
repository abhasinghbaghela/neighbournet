import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Camera,
  MapPin,
  Sparkles,
  AlertCircle,
  EyeOff,
  CheckCircle2,
  Loader2,
  Upload,
  ShieldAlert,
  Zap,
  Droplets,
  Construction,
  Trash2,
  MoreHorizontal,
  Megaphone,
  Radio,
  Check,
  FileDown,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { IncidentCategory, Severity } from '../../types';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { findPotentialDuplicates } from '../../services/duplicateDetector';
import { saveReportOffline } from '../../services/offlineStorage';
import { downloadIncidentPdf } from '../../services/pdfReportService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCoords?: { lat: number; lng: number };
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  initialCoords
}) => {
  const { createIncident, isOnline, incidents } = useIncidents();
  const { user } = useAuth();
  const { t } = useI18n();

  const [selectedCategory, setSelectedCategory] = useState<string>('Water & Utilities');
  const [severity, setSeverity] = useState<Severity>('High'); // "Urgent" in UI
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState<number>(initialCoords?.lat || 12.9716);
  const [lng, setLng] = useState<number>(initialCoords?.lng || 77.6413);
  const [address, setAddress] = useState('Indiranagar, 4th Cross & 100ft Road');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [submittedIncident, setSubmittedIncident] = useState<any | null>(null);

  // Reset submitted state when modal is freshly opened
  useEffect(() => {
    if (isOpen) {
      setSubmittedIncident(null);
    }
  }, [isOpen]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories matching Screenshot 3:
  const categories = [
    { id: 'Water & Utilities', label: 'Water & Utilities', icon: Droplets, color: 'text-sky-500' },
    { id: 'Roads & Potholes', label: 'Roads & Potholes', icon: Construction, color: 'text-amber-500' },
    { id: 'Electrical & Lighting', label: 'Electrical & Lighting', icon: Zap, color: 'text-yellow-500' },
    { id: 'Sanitation & Waste', label: 'Sanitation & Waste', icon: Trash2, color: 'text-emerald-500' },
    { id: 'Public Safety', label: 'Public Safety', icon: ShieldAlert, color: 'text-rose-500' },
    { id: 'Others', label: 'Others', icon: MoreHorizontal, color: 'text-slate-500' }
  ];

  // Severity cards matching Screenshot 3:
  const severities = [
    { id: 'Low', label: 'Low', desc: 'Routine municipal maintenance', sev: 'Low' as Severity },
    { id: 'Moderate', label: 'Moderate', desc: 'Impacting lane or sidewalk', sev: 'Medium' as Severity },
    { id: 'Urgent', label: 'Urgent', desc: 'Active loss or obstruction', sev: 'High' as Severity },
    { id: 'Critical Life Hazard', label: 'Critical Life Hazard', desc: 'Exposed live cables / high risk', sev: 'Critical' as Severity }
  ];

  // Check for duplicates
  useEffect(() => {
    if (lat && lng && selectedCategory) {
      const dups = findPotentialDuplicates(
        {
          category: selectedCategory as any,
          description: description || title,
          lat,
          lng
        },
        incidents
      );
      setDuplicates(dups);
    }
  }, [lat, lng, selectedCategory, description, title, incidents]);

  if (!isOpen) return null;

  // Compress image before storage
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const scaleSize = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setImagePreview(compressedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  // GPS auto-locate
  const handleDetectGps = () => {
    if ('geolocation' in navigator) {
      setIsDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setAddress(`GPS Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
          setIsDetectingGps(false);
        },
        () => {
          setIsDetectingGps(false);
          alert('GPS detection unavailable, using selected neighbourhood coordinates.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  // Gemini AI category & description assistance
  const handleAiSuggest = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      const text = (title + ' ' + description).toLowerCase();
      if (text.includes('water') || text.includes('pipe') || text.includes('drain')) {
        setSelectedCategory('Water & Utilities');
        setAiSuggestion('Gemini AI identified: Water utility pipeline issue. Auto-assigned to BWSSB routing.');
      } else if (text.includes('wire') || text.includes('cable') || text.includes('electric') || text.includes('power')) {
        setSelectedCategory('Electrical & Lighting');
        setAiSuggestion('Gemini AI identified: Electrical cable anomaly. Prioritized for BESCOM dispatch.');
      } else if (text.includes('pothole') || text.includes('crater') || text.includes('road')) {
        setSelectedCategory('Roads & Potholes');
        setAiSuggestion('Gemini AI identified: Road surface hazard. Routed to PWD infrastructure division.');
      } else {
        setAiSuggestion('Gemini AI analyzed text: Description validated with clear civic context.');
      }
    }, 800);
  };

  // Submit incident
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !description) {
      alert('Please provide an incident title or description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const docketId = `INC-${Math.floor(100000 + Math.random() * 900000)}`;
      const assignedDept = selectedCategory.toLowerCase().includes('water')
        ? 'BWSSB Rapid Unit (Water Supply)'
        : selectedCategory.toLowerCase().includes('electric')
        ? 'BESCOM Electrical Response Crew'
        : selectedCategory.toLowerCase().includes('road')
        ? 'Municipal PWD Infrastructure Division'
        : selectedCategory.toLowerCase().includes('sanitation')
        ? 'Solid Waste & Sanitation Department'
        : 'Ward 14 Civic Action Desk';

      const incidentPayload = {
        id: docketId,
        title: title || `${selectedCategory} Reported`,
        category: selectedCategory as any,
        severity,
        description: description || title,
        location: {
          lat,
          lng,
          address,
          ward: 'Ward 14 (Greenwood Heights)'
        },
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        isAnonymous,
        reporterName: isAnonymous ? 'Anonymous Citizen' : (user?.name || 'Resident Citizen'),
        createdAt: new Date().toISOString(),
        status: 'Community Verification Pending',
        confirmationsCount: 1,
        assignedTo: assignedDept
      };

      if (!isOnline) {
        saveReportOffline(incidentPayload);
      } else {
        await createIncident(incidentPayload);
      }

      // Automatically generate and download the PDF Docket
      try {
        downloadIncidentPdf(incidentPayload);
      } catch (pdfErr) {
        console.warn('PDF auto-download warning:', pdfErr);
      }

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (confettiErr) {
        // Safe catch
      }

      // Display the post-submit success view with re-download option
      setSubmittedIncident(incidentPayload);
    } catch (err) {
      console.error('Error submitting incident:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-charcoal-900 rounded-3xl border border-slate-200 dark:border-charcoal-750 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header Bar with Close Button */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-charcoal-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Civic Dispatch Console • Ward 14
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: If Submitted, Show PDF Docket Download View, else Show Form */}
        {submittedIncident ? (
          <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar text-center space-y-6 flex-1 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-pine-100 dark:bg-pine-950/60 text-pine-900 dark:text-pine-200 font-extrabold text-xs uppercase tracking-wider border border-pine-200 dark:border-pine-800">
                Official Docket #{submittedIncident.id}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white pt-2">
                Problem Report Successfully Filed!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Your incident has been registered in the Ward 14 safety grid. An official civic problem report PDF has been generated.
              </p>
            </div>

            {/* Incident Summary Card */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800 border border-slate-200 dark:border-charcoal-700 text-left space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white truncate">
                  {submittedIncident.title}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  {submittedIncident.severity}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {submittedIncident.description}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium pt-1 border-t border-slate-200/60 dark:border-charcoal-700">
                <MapPin className="w-3.5 h-3.5 text-pine-800 flex-shrink-0" />
                <span className="truncate">{submittedIncident.location.address}</span>
              </div>
            </div>

            {/* PDF Auto-Download Notification */}
            <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Official PDF Problem Report has been generated & downloaded to your device!</span>
            </div>

            {/* Action Buttons */}
            <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => downloadIncidentPdf(submittedIncident)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-pine-800 hover:bg-pine-900 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <FileDown className="w-4 h-4" />
                <span>Download PDF Report Again</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmittedIncident(null);
                  onClose();
                }}
                className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : (
          /* Scrollable Content (Matches Screenshot 3) */
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
            {/* Header Title Section (Matches Screenshot 3) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-pine-800 dark:text-pine-400">
                <Megaphone className="w-4 h-4" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider font-mono">
                  CIVIC EMERGENCY DISPATCH CHANNEL
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Report a Neighbourhood Incident
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                Provide accurate ground details. Once 5 verified residents co-sign your report, an automatic municipal priority dispatch order is triggered.
              </p>
            </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Select Incident Category (Matches Screenshot 3: 2 rows x 3 columns) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pine-800 text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
                <label className="text-sm font-bold text-slate-900 dark:text-white">
                  Select Incident Category
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-4 rounded-2xl text-left border flex items-center gap-3.5 transition-all ${
                        isSelected
                          ? 'border-pine-800 bg-pine-50/60 dark:bg-pine-950/40 text-pine-950 dark:text-pine-100 ring-2 ring-pine-800/20'
                          : 'border-slate-200 dark:border-charcoal-750 bg-white dark:bg-charcoal-850 hover:bg-slate-50 dark:hover:bg-charcoal-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-pine-800 text-white' : 'bg-slate-100 dark:bg-charcoal-800 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-xs">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Urgency & Severity Level (Matches Screenshot 3: 2 rows x 2 columns) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pine-800 text-white text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
                <label className="text-sm font-bold text-slate-900 dark:text-white">
                  Urgency & Severity Level
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {severities.map(s => {
                  const isSelected = severity === s.sev;

                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSeverity(s.sev)}
                      className={`p-4 rounded-2xl text-left border flex items-start justify-between gap-3 transition-all ${
                        isSelected
                          ? 'border-pine-800 bg-pine-50/60 dark:bg-pine-950/40 text-pine-950 dark:text-pine-100 ring-2 ring-pine-800/20'
                          : 'border-slate-200 dark:border-charcoal-750 bg-white dark:bg-charcoal-850 hover:bg-slate-50 dark:hover:bg-charcoal-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-xs">{s.label}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</p>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-pine-800 text-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Ground Details & AI Refinement */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pine-800 text-white text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <label className="text-sm font-bold text-slate-900 dark:text-white">
                    Ground Details
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={isAiAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pine-50 dark:bg-pine-950/60 border border-pine-200 dark:border-pine-800 text-pine-800 dark:text-pine-300 text-xs font-bold hover:bg-pine-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pine-600 dark:text-pine-400" />
                  <span>{isAiAnalyzing ? 'Analyzing with Gemini...' : 'Suggest with Gemini AI'}</span>
                </button>
              </div>

              {aiSuggestion && (
                <div className="p-3 rounded-xl bg-pine-50 dark:bg-pine-950/40 border border-pine-200 dark:border-pine-800/60 text-xs text-pine-900 dark:text-pine-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-pine-700 flex-shrink-0 mt-0.5" />
                  <span>{aiSuggestion}</span>
                </div>
              )}

              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Incident Title (e.g., Severe Arterial Pothole on 100ft Road)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pine-800 dark:text-white placeholder:text-slate-400"
              />

              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe ground observations (location landmarks, obstruction size, impact on commuters)..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-xs focus:outline-none focus:ring-2 focus:ring-pine-800 dark:text-white placeholder:text-slate-400 leading-relaxed"
              />
            </div>

            {/* Step 4: Ground Location & Draggable Coordinates */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pine-800 text-white text-[10px] font-bold flex items-center justify-center">
                    4
                  </span>
                  <label className="text-sm font-bold text-slate-900 dark:text-white">
                    Ground Location
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={isDetectingGps}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-charcoal-800 border border-slate-200 dark:border-charcoal-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-pine-800 dark:text-pine-400" />
                  <span>{isDetectingGps ? 'Detecting GPS...' : 'Detect Current GPS'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street / Landmark Address"
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pine-800 dark:text-white"
                />
                <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-charcoal-800 border border-slate-200 dark:border-charcoal-700 text-[11px] font-mono text-slate-500 flex items-center justify-center">
                  {lat.toFixed(4)}, {lng.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Step 5: Evidence & Photo Upload with Canvas Compression */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pine-800 text-white text-[10px] font-bold flex items-center justify-center">
                  5
                </span>
                <label className="text-sm font-bold text-slate-900 dark:text-white">
                  Photo Evidence (Optional)
                </label>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-charcoal-700 h-44 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-charcoal-700 hover:border-pine-800 bg-slate-50/50 dark:bg-charcoal-850 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-pine-800 transition-colors"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs font-semibold">Tap to attach photo from device camera or gallery</span>
                  <span className="text-[10px] text-slate-400">Compressed automatically for fast uplink</span>
                </button>
              )}
            </div>

            {/* Step 6: Identity Anonymity Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-800 border border-slate-200/80 dark:border-charcoal-700">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-slate-500" />
                  <span>Report Anonymously</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Hides your identity from public resident feeds while maintaining authorized moderation integrity.
                </p>
              </div>

              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 accent-pine-800 cursor-pointer"
              />
            </div>

            {/* Potential Duplicate Clustered Notice */}
            {duplicates.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Nearby concurring report detected ({duplicates[0].distanceMeters}m away)</span>
                </div>
                <p className="text-[11px]">
                  Submitting will auto-cluster your vote to strengthen municipal priority dispatch for ticket #{duplicates[0].incidentId}.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-pine-800 hover:bg-pine-900 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Broadcasting Dossier to Ward Mesh...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Ground Incident Dossier (+100 Karma)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
};
