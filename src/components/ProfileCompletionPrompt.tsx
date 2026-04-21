
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, User, Camera, MapPin, Briefcase, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ProfileField {
  key: string;
  label: string;
  icon: React.ReactNode;
  required: boolean;
}

interface ProfileCompletionPromptProps {
  profile: any;
  onDismiss?: () => void;
}

const ProfileCompletionPrompt: React.FC<ProfileCompletionPromptProps> = ({ 
  profile, 
  onDismiss 
}) => {
  const navigate = useNavigate();

  const profileFields: ProfileField[] = [
    { key: 'display_name', label: 'Full Name', icon: <User className="w-4 h-4" />, required: true },
    { key: 'profile_image_url', label: 'Profile Picture', icon: <Camera className="w-4 h-4" />, required: true },
    { key: 'bio', label: 'Bio/Description', icon: <User className="w-4 h-4" />, required: true },
    { key: 'city', label: 'Location', icon: <MapPin className="w-4 h-4" />, required: true },
    { key: 'current_company', label: 'Current Company', icon: <Briefcase className="w-4 h-4" />, required: false },
    { key: 'current_position', label: 'Current Position', icon: <Briefcase className="w-4 h-4" />, required: false },
    { key: 'key_skills', label: 'Skills', icon: <Briefcase className="w-4 h-4" />, required: true },
    { key: 'linkedin_url', label: 'LinkedIn Profile', icon: <Globe className="w-4 h-4" />, required: false },
    { key: 'specialization', label: 'Specialization', icon: <Briefcase className="w-4 h-4" />, required: false },
    { key: 'years_experience', label: 'Years of Experience', icon: <Briefcase className="w-4 h-4" />, required: false }
  ];

  const getFieldValue = (key: string) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      return profile?.[parent]?.[0]?.[child];
    }
    return profile?.[key];
  };

  const completedFields = profileFields.filter(field => {
    const value = getFieldValue(field.key);
    return value && value.toString().trim() !== '';
  });

  const requiredFields = profileFields.filter(field => field.required);
  const completedRequiredFields = requiredFields.filter(field => {
    const value = getFieldValue(field.key);
    return value && value.toString().trim() !== '';
  });

  const totalProgress = (completedFields.length / profileFields.length) * 100;
  const requiredProgress = (completedRequiredFields.length / requiredFields.length) * 100;

  const isProfileComplete = requiredProgress === 100;

  if (isProfileComplete) {
    return null; // Don't show prompt if profile is complete
  }

  return (
    <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Complete Your Profile
          </CardTitle>
          <Badge variant={isProfileComplete ? "default" : "secondary"}>
            {Math.round(totalProgress)}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span>{completedFields.length}/{profileFields.length} fields</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Required Fields</span>
            <span>{completedRequiredFields.length}/{requiredFields.length} completed</span>
          </div>
          <Progress value={requiredProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {profileFields.slice(0, 6).map((field) => {
            const isCompleted = getFieldValue(field.key) && getFieldValue(field.key).toString().trim() !== '';
            return (
              <div key={field.key} className="flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={isCompleted ? 'text-foreground' : 'text-muted-foreground'}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={() => navigate('/profile/edit')} className="flex-1">
            Complete Profile
          </Button>
          {onDismiss && (
            <Button variant="outline" onClick={onDismiss}>
              Later
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          A complete profile helps you connect with more networkers and increases your visibility.
          Required fields are marked with *.
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionPrompt;
