import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { getGoalById } from '@/data/goals';
import { getProgramById } from '@/data/programs';
import { CONTACT_TIME_OPTIONS, TRAINING_TYPE_OPTIONS } from '@/data/leadSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainer, fadeUp } from '@/animations/variants';

export default function LeadCaptureForm({ goalId, programId, onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    age: '',
    preferredTrainingType: '',
    preferredContactTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const goal = getGoalById(goalId);
  const program = getProgramById(programId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    onSubmit({
      ...formData,
      selectedGoal: goalId,
      selectedProgram: programId
    });

    setIsSubmitting(false);
  };

  return (
    <motion.div
      key="lead-capture-form"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-gray-light hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Change Program
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div
        className="text-center mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4"
        >
          Almost There!
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-gray-light"
        >
          Fill in your details and we'll reach out to get you started.
        </motion.p>
      </motion.div>

      {/* Selected Goal & Program */}
      <motion.div
        className="flex flex-wrap gap-3 justify-center mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        {goal && (
          <Badge variant="outline" className="px-4 py-2 text-sm border-primary/50 bg-primary/10">
            Goal: {goal.title}
          </Badge>
        )}
        {program && (
          <Badge variant="outline" className="px-4 py-2 text-sm border-primary/50 bg-primary/10">
            Program: {program.name}
          </Badge>
        )}
      </motion.div>

      {/* Form */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Phone (required) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-white">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-xs">{errors.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-white">
                    Phone Number <span className="text-primary">*</span>
                  </label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email & Age (optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white">
                    Email Address <span className="text-white/40">(optional)</span>
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium text-white">
                    Age <span className="text-white/40">(optional)</span>
                  </label>
                  <Input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    min="16"
                    max="100"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Preferred Training Type
                  </label>
                  <Select
                    value={formData.preferredTrainingType}
                    onValueChange={(value) => handleSelectChange('preferredTrainingType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRAINING_TYPE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Best Time to Contact
                  </label>
                  <Select
                    value={formData.preferredContactTime}
                    onValueChange={(value) => handleSelectChange('preferredContactTime', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTACT_TIME_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Request Free Consultation
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-white/40">
                By submitting, you agree to be contacted by our team.
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
