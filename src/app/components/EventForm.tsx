import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader, AlertTriangle, Upload } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface EventFormProps {
  isOpen: boolean;
  event: any;
  departmentId: string;
  onClose: () => void;
  onSave: (updatedEvent: any) => Promise<boolean>;
  isNew?: boolean;
}

export function EventForm({ isOpen, event, departmentId, onClose, onSave, isNew = false }: EventFormProps) {
  const { isAdmin } = useAdmin();
  const [formData, setFormData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync formData when event changes or form opens
  useEffect(() => {
    if (isOpen && event) {
      setFormData({ ...event });
      setOriginalData({ ...event });
      setError(null);
      setSuccess(false);
      setShowConfirmDialog(false);
      setPendingClose(false);
    }
  }, [isOpen, event]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  // Handle closing with unsaved changes warning
  const handleClose = () => {
    if (hasUnsavedChanges && !loading) {
      setShowConfirmDialog(true);
      setPendingClose(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowConfirmDialog(false);
    setPendingClose(false);
    onClose();
  };

  const cancelClose = () => {
    setShowConfirmDialog(false);
    setPendingClose(false);
  };

  if (!event) return null;

  // Only render if user is admin
  if (!isAdmin) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2A2A2A] mb-3">Admin Only</h2>
              <p className="text-gray-600 mb-6">
                Only administrators can edit events. Please log in with admin credentials to make changes.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-[#C65D3B] to-[#B8956A] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress image using canvas
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize if image is too large
        const maxWidth = 800;
        const maxHeight = 600;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed JPEG (0.7 quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          
          // Check if compressed size is reasonable
          if (compressedBase64.length > 500000) {
            setError('Image is too large even after compression. Please try a smaller image.');
            return;
          }
          
          setFormData({ ...formData, image: compressedBase64 });
          setError(null);
        }
      };
      img.onerror = () => {
        setError('Failed to load the image');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setError('Failed to read the file');
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const success = await onSave(formData);
    
    if (success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError('Failed to save event');
    }
    
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#C65D3B] to-[#B8956A] text-white px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{isNew ? 'Create Event' : 'Edit Event'}</h2>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700"
                >
                  Event updated successfully!
                </motion.div>
              )}

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => handleChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-[#C65D3B]/30 focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                  disabled={loading}
                />
                {formData.image && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-[#C65D3B]/20">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Upload Image from Local Storage */}
              <div>
                <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">
                  Or Upload Image from Local Storage
                </label>
                <div className="flex gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-[#C65D3B]/50 border-dashed text-[#C65D3B] font-semibold hover:bg-[#C65D3B]/5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Choose Image</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="px-4 py-3 rounded-xl bg-[#C65D3B]/10 text-[#C65D3B] font-semibold hover:bg-[#C65D3B]/20 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Browse
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">
                  Registration URL
                </label>
                <input
                  type="url"
                  value={formData.registrationUrl || ''}
                  onChange={(e) => handleChange('registrationUrl', e.target.value)}
                  placeholder="https://forms.google.com/example"
                  className="w-full px-4 py-3 rounded-xl border border-[#C65D3B]/30 focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                  disabled={loading}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#C65D3B] to-[#B8956A] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                            <Save className="w-5 h-5" />
                            <span>{isNew ? 'Create Event' : 'Save Changes'}</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-200 text-[#2A2A2A] rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>
              </div>
            </form>

            {/* Unsaved Changes Confirmation Dialog */}
            <AnimatePresence>
              {showConfirmDialog && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center"
                  onClick={cancelClose}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-xl p-6 max-w-sm mx-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                      <h3 className="text-xl font-bold text-[#2A2A2A]">Unsaved Changes</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      You have unsaved changes. Are you sure you want to close without saving?
                    </p>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={cancelClose}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#C65D3B] to-[#B8956A] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Keep Editing
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={confirmClose}
                        className="flex-1 px-4 py-2 bg-gray-200 text-[#2A2A2A] rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Discard
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
