import { create } from "zustand";
import { getAllQuestions } from "./surveyData";

type Phase = "survey" | "complete";

interface SurveyState {
  furthestIndex: number; // the next unanswered question
  answers: Record<string, unknown>;
  phase: Phase;
  editingId: string | null; // question id being re-edited, or null

  submit: (id: string, answer: unknown) => void;
  startEditing: (id: string) => void;
  cancelEditing: () => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  furthestIndex: 0,
  answers: {},
  phase: "survey",
  editingId: null,

  submit: (id, answer) =>
    set((state) => {
      const allQuestions = getAllQuestions();
      const newAnswers = { ...state.answers, [id]: answer };

      // If editing a previous answer, just save and return
      if (state.editingId === id) {
        return { answers: newAnswers, editingId: null };
      }

      // Otherwise advance to next question
      const next = state.furthestIndex + 1;
      if (next >= allQuestions.length) {
        return { answers: newAnswers, furthestIndex: next, phase: "complete" };
      }
      return { answers: newAnswers, furthestIndex: next };
    }),

  startEditing: (id) => set({ editingId: id }),
  cancelEditing: () => set({ editingId: null }),
}));
