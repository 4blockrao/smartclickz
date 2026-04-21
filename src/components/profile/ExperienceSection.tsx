
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Briefcase, PlusCircle } from "lucide-react";
import { useProfileExperience } from '@/hooks/useProfileExperience';
import { ProfileExperience, ProfileExperienceFormValues } from '@/schemas/profileSchema';
import { ProfileExperienceForm } from './experience/ProfileExperienceForm';
import { ExperienceItem } from './experience/ExperienceItem';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface ExperienceSectionProps {
  profileId: string | undefined;
  isOwnProfile: boolean;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ profileId, isOwnProfile }) => {
  const {
    experiences,
    isLoadingExperiences,
    addExperience,
    isAddingExperience,
    updateExperience,
    isUpdatingExperience,
    deleteExperience,
    isDeletingExperience,
  } = useProfileExperience(profileId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState<ProfileExperience | null>(null);
  const [experienceToDeleteId, setExperienceToDeleteId] = useState<string | null>(null);


  const handleOpenForm = (experience?: ProfileExperience) => {
    setExperienceToEdit(experience || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setExperienceToEdit(null);
  };

  const handleSubmitForm = (values: ProfileExperienceFormValues) => {
    if (experienceToEdit) {
      updateExperience({ id: experienceToEdit.id, values }, {
        onSuccess: handleCloseForm,
      });
    } else if (profileId) {
      addExperience(values, {
        onSuccess: handleCloseForm,
      });
    }
  };
  
  const handleDeleteConfirm = () => {
    if (experienceToDeleteId) {
      deleteExperience(experienceToDeleteId, {
        onSuccess: () => setExperienceToDeleteId(null),
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />Experience
        </CardTitle>
        {isOwnProfile && (
          <Button variant="outline" size="sm" onClick={() => handleOpenForm()}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add Experience
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoadingExperiences && <p className="text-muted-foreground">Loading experience...</p>}
        {!isLoadingExperiences && experiences && experiences.length > 0 ? (
          <div className="space-y-2">
            {experiences.map((exp) => (
              <ExperienceItem
                key={exp.id}
                experience={exp}
                isOwnProfile={isOwnProfile}
                onEdit={() => handleOpenForm(exp)}
                onDelete={() => setExperienceToDeleteId(exp.id)}
                isDeleting={isDeletingExperience && experienceToDeleteId === exp.id}
              />
            ))}
          </div>
        ) : (
          !isLoadingExperiences && <p className="text-muted-foreground">No professional experience listed yet.</p>
        )}
      </CardContent>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{experienceToEdit ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
            <DialogDescription>
              {experienceToEdit ? 'Update the details of your work experience.' : 'Share your professional roles and accomplishments.'}
            </DialogDescription>
          </DialogHeader>
          {profileId && (
            <ProfileExperienceForm
              profileId={profileId}
              experienceToEdit={experienceToEdit}
              onSubmitForm={handleSubmitForm}
              onCancel={handleCloseForm}
              isSubmitting={isAddingExperience || isUpdatingExperience}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!experienceToDeleteId} onOpenChange={() => setExperienceToDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this experience entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExperienceToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeletingExperience}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingExperience ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
