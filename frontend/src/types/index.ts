// Types for the Football Mondays application

export interface Signup {
  userId: string;
  username: string;
  signupTime: string;
  position: number;
}

export interface User {
  username: string;
}

export interface SignupStatus {
  currentWeek: string;
  canSignup: boolean;
  mainList: Signup[];
  reserveList: Signup[];
  userSignedUp: boolean;
  nextReset: string;
}

export interface RegisterResponse {
  success: boolean;
  username: string;
}

export interface SuccessResponse {
  success: boolean;
  position?: number;
}

export interface ErrorResponse {
  error: string;
}

// Component prop types
export interface AuthFormProps {
  onLogin: (username: string) => Promise<void>;
}

export interface ErrorMessageProps {
  message: string;
}

export interface MainAppProps {
  currentUser: User;
  onError: (message: string) => void;
  onSessionExpired: () => void;
}

export interface PlayerListProps {
  players: Signup[];
  currentUser: User | null;
  isMainList: boolean;
}

export interface PlayerListsProps {
  status: SignupStatus | null;
  currentUser: User | null;
}

export interface StatusCardProps {
  status: SignupStatus | null;
  language: string;
}

export interface SignupButtonsProps {
  status: SignupStatus | null;
  onSignup: () => Promise<void>;
  onRemoveSignup: () => Promise<void>;
}
