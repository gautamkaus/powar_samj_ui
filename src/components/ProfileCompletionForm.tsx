import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Loader2, Crown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { masterDataAPI, State, District, Tahsil, Profession } from '@/services/api';

interface ProfileCompletionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profileData: any) => void;
  isLoading?: boolean;
}

export const ProfileCompletionForm = ({ isOpen, onClose, onSubmit, isLoading = false }: ProfileCompletionFormProps) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    dob: '',
    gender: '',
    state_id: '',
    district_id: '',
    tahsil_id: '',
    address_line: '',
    about: '',
    profession_id: '',
    business_description: ''
  });
  
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [tahsils, setTahsils] = useState<Tahsil[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const t = useTranslation();

  useEffect(() => {
    if (isOpen) {
      loadMasterData();
    }
  }, [isOpen]);

  const loadMasterData = async () => {
    try {
      setLoadingData(true);
      const [statesRes, professionsRes] = await Promise.all([
        masterDataAPI.getStates(),
        masterDataAPI.getProfessions()
      ]);
      
      setStates(statesRes.data || []);
      setProfessions(professionsRes.data || []);
    } catch (error) {
      console.error('Error loading master data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadDistricts = async (stateId: number) => {
    try {
      const response = await masterDataAPI.getDistrictsByState(stateId);
      setDistricts(response.data || []);
      setFormData(prev => ({ ...prev, district_id: '', tahsil_id: '' }));
      setTahsils([]);
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  const loadTahsils = async (districtId: number) => {
    try {
      const response = await masterDataAPI.getTahsilsByDistrict(districtId);
      setTahsils(response.data || []);
      setFormData(prev => ({ ...prev, tahsil_id: '' }));
    } catch (error) {
      console.error('Error loading tahsils:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Load dependent data
    if (field === 'state_id' && value) {
      loadDistricts(parseInt(value));
    } else if (field === 'district_id' && value) {
      loadTahsils(parseInt(value));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.state_id) newErrors.state_id = 'State is required';
    if (!formData.district_id) newErrors.district_id = 'District is required';
    if (!formData.tahsil_id) newErrors.tahsil_id = 'Tahsil is required';
    if (!formData.address_line.trim()) newErrors.address_line = 'Address is required';
    if (!formData.profession_id) newErrors.profession_id = 'Profession is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Complete Your Community Profile
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                disabled={isLoading}
                className={errors.first_name ? 'border-destructive' : ''}
              />
              {errors.first_name && (
                <p className="text-sm text-destructive">{errors.first_name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                value={formData.middle_name}
                onChange={(e) => handleInputChange('middle_name', e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                disabled={isLoading}
                className={errors.last_name ? 'border-destructive' : ''}
              />
              {errors.last_name && (
                <p className="text-sm text-destructive">{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                disabled={isLoading}
                className={errors.dob ? 'border-destructive' : ''}
              />
              {errors.dob && (
                <p className="text-sm text-destructive">{errors.dob}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender}</p>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select
                value={formData.state_id}
                onValueChange={(value) => handleInputChange('state_id', value)}
                disabled={isLoading || loadingData}
              >
                <SelectTrigger className={errors.state_id ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.state_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state_id && (
                <p className="text-sm text-destructive">{errors.state_id}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Select
                value={formData.district_id}
                onValueChange={(value) => handleInputChange('district_id', value)}
                disabled={isLoading || loadingData || !formData.state_id}
              >
                <SelectTrigger className={errors.district_id ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id.toString()}>
                      {district.dist_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district_id && (
                <p className="text-sm text-destructive">{errors.district_id}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tahsil">Tahsil *</Label>
              <Select
                value={formData.tahsil_id}
                onValueChange={(value) => handleInputChange('tahsil_id', value)}
                disabled={isLoading || loadingData || !formData.district_id}
              >
                <SelectTrigger className={errors.tahsil_id ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select tahsil" />
                </SelectTrigger>
                <SelectContent>
                  {tahsils.map((tahsil) => (
                    <SelectItem key={tahsil.id} value={tahsil.id.toString()}>
                      {tahsil.tahsil_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tahsil_id && (
                <p className="text-sm text-destructive">{errors.tahsil_id}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address_line">Address *</Label>
            <Textarea
              id="address_line"
              placeholder="Enter your complete address"
              value={formData.address_line}
              onChange={(e) => handleInputChange('address_line', e.target.value)}
              disabled={isLoading}
              rows={3}
              className={errors.address_line ? 'border-destructive' : ''}
            />
            {errors.address_line && (
              <p className="text-sm text-destructive">{errors.address_line}</p>
            )}
          </div>

          {/* Profession */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profession">Profession *</Label>
              <Select
                value={formData.profession_id}
                onValueChange={(value) => handleInputChange('profession_id', value)}
                disabled={isLoading || loadingData}
              >
                <SelectTrigger className={errors.profession_id ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select profession" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((profession) => (
                    <SelectItem key={profession.id} value={profession.id.toString()}>
                      {profession.employee_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.profession_id && (
                <p className="text-sm text-destructive">{errors.profession_id}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_description">Business Description</Label>
              <Input
                id="business_description"
                placeholder="Describe your business (if applicable)"
                value={formData.business_description}
                onChange={(e) => handleInputChange('business_description', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* About */}
          <div className="space-y-2">
            <Label htmlFor="about">About You</Label>
            <Textarea
              id="about"
              placeholder="Tell us about yourself, your interests, and why you want to join the community"
              value={formData.about}
              onChange={(e) => handleInputChange('about', e.target.value)}
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-royal"
              disabled={isLoading || loadingData}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Completing Profile...
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Complete Profile & Join Community
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
