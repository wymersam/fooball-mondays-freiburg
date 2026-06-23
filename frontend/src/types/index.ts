// Types for the Football Mondays application

export interface Signup {
  userId: string;
  username: string;
  signupTime: string;
  position: number;
  bibWasher?: boolean;
  ballBringer?: boolean;
  hasPaid?: boolean;
}

export interface User {
  username: string;
}

export interface SignupStatus {
  currentWeek: string;
  canSignup: boolean;
  mainList: Signup[];
  reserveList: Signup[];
  prevMainList: Signup[];
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
  onLogin: (username: string, inviteCode: string) => Promise<void>;
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
  onRefresh: () => Promise<void>;
  onError: (message: string) => void;
}

export interface PlayerListsProps {
  status: SignupStatus | null;
  currentUser: User | null;
  onRefresh: () => Promise<void>;
  onError: (message: string) => void;
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

export interface PaymentsListProps {
  players: Signup[];
  currentUser: User | null;
  onRefresh: () => Promise<void>;
  onError: (message: string) => void;
}

export interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export interface AdminButtonControlsProps {
  adminPassword: string;
  overrideState: "auto" | "open" | "closed";
  loadStatus: () => Promise<void>;
  setOverrideState: (state: "auto" | "open" | "closed") => void;
  onError: (message: string) => void;
  t: any;
}

export interface RuleProps {
  ruleHeader: string;
  ruleDescription: string;
  icon: React.ReactNode;
}

export interface CollectorRecord {
  weekKey: string;
  userId: string;
  username: string;
}
