export interface Option {
  label: string;
  value: string;
}

export interface Step {
  id: string;
  question: string;
  options: Option[];
  nextStep?: string;
  end?: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
} 