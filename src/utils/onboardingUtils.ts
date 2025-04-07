// Using a generic type instead of Clerk's specific User type
// to avoid dependency issues

/**
 * Gets the current onboarding step for a user
 * Returns -1 if the user hasn't started onboarding yet
 * Returns 0 if the user has completed onboarding
 * Returns 1-9 for the specific onboarding step they're on
 */
export const getOnboardingStatus = (user: any): number => {
  // Get the onboarding status from user metadata
  const onboardingStep = user?.publicMetadata?.onboardingStep;
  
  if (onboardingStep === undefined) {
    return -1; // User hasn't started onboarding yet
  }
  
  return onboardingStep as number;
};

/**
 * Sets the current onboarding step for a user
 */
export const setOnboardingStatus = async (user: any, step: number): Promise<void> => {
  try {
    await user.update({
      publicMetadata: {
        ...user.publicMetadata,
        onboardingStep: step
      }
    });
  } catch (error) {
    console.error("Failed to update onboarding status:", error);
  }
};

/**
 * Marks onboarding as complete
 */
export const completeOnboarding = async (user: any): Promise<void> => {
  try {
    await user.update({
      publicMetadata: {
        ...user.publicMetadata,
        onboardingStep: 0, // 0 indicates complete
        onboardingCompleted: true
      }
    });
  } catch (error) {
    console.error("Failed to mark onboarding as complete:", error);
  }
};

/**
 * Checks if the user has completed onboarding
 */
export const isOnboardingComplete = (user: any): boolean => {
  return user?.publicMetadata?.onboardingCompleted === true;
};

/**
 * Check onboarding status and return the appropriate redirect path
 * @returns The path to redirect to based on onboarding status
 */
export const getRedirectPathAfterLogin = (user: any): string => {
  // Check if onboarding is complete
  if (isOnboardingComplete(user)) {
    return "/dashboard";
  }
  
  // Get the current onboarding step
  const currentStep = getOnboardingStatus(user);
  
  // If user hasn't started onboarding yet, redirect to the beginning
  if (currentStep === -1) {
    return "/";
  }
  
  // Otherwise redirect to the specific step they're on
  return currentStep === 1 ? "/" : `/step/${currentStep}`;
};
