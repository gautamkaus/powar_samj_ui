import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { masterDataAPI, State, District, Tahsil, Profession } from '@/services/api';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email_id: '',
    mobile_no: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    dob: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { register } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [statesRes, professionsRes] = await Promise.all([
          masterDataAPI.getStates(),
          masterDataAPI.getProfessions()
        ]);
        
        setStates(statesRes.states || []);
        setProfessions(professionsRes.professions || []);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadInitialData();
  }, [toast]);

  const handleStateChange = async (stateId: string) => {
    setFormData(prev => ({ ...prev, state_id: stateId, district_id: '', tahsil_id: '' }));
    setDistricts([]);
    setTahsils([]);

    if (stateId) {
      try {
        const response = await masterDataAPI.getDistrictsByState(parseInt(stateId));
        setDistricts(response.districts || []);
      } catch (error) {
        console.error('Failed to load districts:', error);
      }
    }
  };

  const handleDistrictChange = async (districtId: string) => {
    setFormData(prev => ({ ...prev, district_id: districtId, tahsil_id: '' }));
    setTahsils([]);

    if (districtId) {
      try {
        const response = await masterDataAPI.getTahsilsByDistrict(parseInt(districtId));
        setTahsils(response.tahsils || []);
      } catch (error) {
        console.error('Failed to load tahsils:', error);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email_id || !formData.mobile_no || !formData.password || !formData.first_name || !formData.last_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const userData = {
        ...formData,
        state_id: formData.state_id ? parseInt(formData.state_id) : undefined,
        district_id: formData.district_id ? parseInt(formData.district_id) : undefined,
        tahsil_id: formData.tahsil_id ? parseInt(formData.tahsil_id) : undefined,
        profession_id: formData.profession_id ? parseInt(formData.profession_id) : undefined,
      };

      delete userData.confirmPassword;
      
      await register(userData);
      
      toast({
        title: "Success",
        description: "Registration successful! Welcome to Powar!",
      });
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">Loading form data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Join Powar Community</CardTitle>
        <CardDescription>Create your account to connect with the community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email_id">Email *</Label>
              <Input
                id="email_id"
                type="email"
                placeholder="Enter your email"
                value={formData.email_id}
                onChange={(e) => handleInputChange('email_id', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobile_no">Mobile Number *</Label>
              <Input
                id="mobile_no"
                type="tel"
                placeholder="Enter your mobile number"
                value={formData.mobile_no}
                onChange={(e) => handleInputChange('mobile_no', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                placeholder="Enter your middle name"
                value={formData.middle_name}
                onChange={(e) => handleInputChange('middle_name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={formData.state_id} onValueChange={handleStateChange}>
                <SelectTrigger>
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Select value={formData.district_id} onValueChange={handleDistrictChange} disabled={!formData.state_id}>
                <SelectTrigger>
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tahsil">Tahsil</Label>
              <Select value={formData.tahsil_id} onValueChange={(value) => handleInputChange('tahsil_id', value)} disabled={!formData.district_id}>
                <SelectTrigger>
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line">Address</Label>
            <Input
              id="address_line"
              placeholder="Enter your address"
              value={formData.address_line}
              onChange={(e) => handleInputChange('address_line', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession_id">Profession</Label>
            <Select value={formData.profession_id} onValueChange={(value) => handleInputChange('profession_id', value)}>
              <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              placeholder="Tell us about yourself"
              value={formData.about}
              onChange={(e) => handleInputChange('about', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_description">Business Description</Label>
            <Textarea
              id="business_description"
              placeholder="Describe your business (if applicable)"
              value={formData.business_description}
              onChange={(e) => handleInputChange('business_description', e.target.value)}
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        
        {onSwitchToLogin && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
