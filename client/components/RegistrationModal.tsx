import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { CityData, RegistrationFormData, apiService } from "@/services/api";

interface RegistrationModalProps {
  isOpen: boolean;
  city: CityData | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RegistrationModal({ 
  isOpen, 
  city, 
  onClose, 
  onSuccess 
}: RegistrationModalProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    city: city?.name || '',
  });
  const [errors, setErrors] = useState<Partial<RegistrationFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Update city when prop changes
  useState(() => {
    if (city) {
      setFormData(prev => ({ ...prev, city: city.name }));
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationFormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.trim().length > 100) {
      newErrors.email = 'Email must be less than 100 characters';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      if (!/^[\+]?[1-9][\d]{9,15}$/.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid phone number (10-16 digits)';
      }
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sanitizeInput = (value: string, type: 'name' | 'email' | 'phone' | 'city'): string => {
    // Basic XSS prevention - remove HTML tags and script content
    let sanitized = value.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '');
    
    switch (type) {
      case 'name':
      case 'city':
        // Allow only letters, spaces, and common name characters
        sanitized = sanitized.replace(/[^a-zA-Z\s\-'\.]/g, '');
        break;
      case 'email':
        // Allow email characters
        sanitized = sanitized.replace(/[^a-zA-Z0-9@\.\-_]/g, '');
        break;
      case 'phone':
        // Allow phone number characters
        sanitized = sanitized.replace(/[^0-9\+\-\(\)\s]/g, '');
        break;
    }
    
    return sanitized;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value, name as 'name' | 'email' | 'phone' | 'city');
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof RegistrationFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent, isRetry: boolean = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Sanitize form data before submission
      const sanitizedData = {
        name: sanitizeInput(formData.name.trim(), 'name'),
        email: sanitizeInput(formData.email.trim().toLowerCase(), 'email'),
        phone: sanitizeInput(formData.phone.trim(), 'phone'),
        city: sanitizeInput(formData.city.trim(), 'city'),
      };

      const response = await apiService.submitRegistration(sanitizedData);
      setSubmitStatus('success');
      setSubmitMessage(response.message);
      setRetryCount(0); // Reset retry count on success
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: city?.name || '',
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error types
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message.includes('already registered')) {
        errorMessage = 'You have already registered for this city.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Please check your information and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitStatus('error');
      setSubmitMessage(errorMessage);
      
      // Increment retry count if this wasn't a manual retry
      if (!isRetry) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent, true);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form and status after a short delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: city?.name || '',
        });
        setErrors({});
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Register for {city?.name}
          </DialogTitle>
          <DialogDescription>
            Join TPC programs in {city?.name}. Fill out the form below and we'll contact you soon.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">Registration Successful!</h3>
            <p className="text-muted-foreground">{submitMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                className={errors.city ? "border-red-500" : ""}
                disabled={true}
                readOnly
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            {submitStatus === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-700">{submitMessage}</p>
                </div>
                {retryCount < maxRetries && !submitMessage.includes('already registered') && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    disabled={isSubmitting}
                    className="mt-2"
                  >
                    {isSubmitting ? 'Retrying...' : `Retry (${retryCount}/${maxRetries})`}
                  </Button>
                )}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}