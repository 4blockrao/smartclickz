
import React from 'react';
import { ProfileExperience } from '@/schemas/profileSchema';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ExperienceItemProps {
  experience: ProfileExperience;
  isOwnProfile: boolean;
  onEdit: (experience: ProfileExperience) => void;
  onDelete: (experienceId: string) => void;
  isDeleting: boolean;
}

const formatDateDisplay = (dateString: string | null) => {
  if (!dateString) return 'Present';
  try {
    return format(parseISO(dateString), 'MMM yyyy');
  } catch (e) {
    return 'Invalid Date';
  }
};

export const ExperienceItem: React.FC<ExperienceItemProps> = ({ experience, isOwnProfile, onEdit, onDelete, isDeleting }) => {
  const startDate = formatDateDisplay(experience.start_date);
  const endDate = formatDateDisplay(experience.end_date);

  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{experience.title}</h3>
          <p className="text-md text-primary">{experience.company_name}</p>
          <p className="text-sm text-muted-foreground">
            {startDate} - {endDate}
          </p>
          {experience.location && <p className="text-sm text-muted-foreground">{experience.location}</p>}
          {experience.employment_type && <p className="text-sm text-muted-foreground capitalize">{experience.employment_type}</p>}
        </div>
        {isOwnProfile && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(experience)} aria-label="Edit experience">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(experience.id)} disabled={isDeleting} aria-label="Delete experience">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      </div>
      {experience.description && <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{experience.description}</p>}
    </div>
  );
};
