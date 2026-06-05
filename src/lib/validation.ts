import { CVData, PersonalInfo, Education, Experience, Project } from "./schemas";

export interface ValidationErrors {
  [key: string]: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;

export function validatePersonalInfo(info: PersonalInfo): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!info.fullName.trim()) errors.fullName = "Full name is required";
  if (!info.professionalTitle.trim()) errors.professionalTitle = "Professional title is required";
  if (!info.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(info.email)) errors.email = "Invalid email format";
  if (!info.phone.trim()) errors.phone = "Phone number is required";
  if (!info.location.trim()) errors.location = "Location is required";
  if (info.githubUrl && !URL_REGEX.test(info.githubUrl)) errors.githubUrl = "Invalid URL format";
  if (info.linkedinUrl && !URL_REGEX.test(info.linkedinUrl)) errors.linkedinUrl = "Invalid URL format";

  return errors;
}

export function validateEducation(education: Education[]): ValidationErrors {
  const errors: ValidationErrors = {};

  education.forEach((edu, i) => {
    if (!edu.instituteName.trim()) errors[`education.${i}.instituteName`] = "Institute name is required";
    if (!edu.degree.trim()) errors[`education.${i}.degree`] = "Degree is required";
    if (!edu.passingYear.trim()) errors[`education.${i}.passingYear`] = "Passing year is required";
    if (!edu.grade.trim()) errors[`education.${i}.grade`] = "Grade is required";
  });

  return errors;
}

export function validateExperience(experience: Experience[]): ValidationErrors {
  const errors: ValidationErrors = {};

  experience.forEach((exp, i) => {
    if (!exp.jobTitle.trim()) errors[`experience.${i}.jobTitle`] = "Job title is required";
    if (!exp.company.trim()) errors[`experience.${i}.company`] = "Company is required";
    if (!exp.startDate.trim()) errors[`experience.${i}.startDate`] = "Start date is required";
  });

  return errors;
}

export function validateSkills(skills: { name: string }[]): ValidationErrors {
  const errors: ValidationErrors = {};
  skills.forEach((skill, i) => {
    if (!skill.name.trim()) errors[`skills.${i}.name`] = "Skill name is required";
  });
  return errors;
}

export function validateStep(step: number, data: CVData): ValidationErrors {
  switch (step) {
    case 1:
      return validatePersonalInfo(data.personalInfo);
    case 2:
      return validateEducation(data.education);
    case 3:
      return validateExperience(data.experience);
    case 4:
      return validateSkills(data.skills);
    case 5:
      return {}; // Advanced section is optional
    default:
      return {};
  }
}

export function isStepValid(step: number, data: CVData): boolean {
  return Object.keys(validateStep(step, data)).length === 0;
}
