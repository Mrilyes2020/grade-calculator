import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type GradesData, type SubjectGrade } from "@shared/schema";
import { subjects, calculateSubjectAverage, calculateFinalAverage } from "@/lib/subjects";

const SESSION_KEY = "grade_session_id";
const GRADES_BACKUP_KEY = "grades_backup";

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function createEmptyGrade(): SubjectGrade {
  return { td: null, tp: null, exam: null, average: null };
}

function createEmptyGrades(): GradesData {
  return {
    proba: createEmptyGrade(),
    stat: createEmptyGrade(),
    mna: createEmptyGrade(),
    system: createEmptyGrade(),
    bd: createEmptyGrade(),
    reseaux: createEmptyGrade(),
    anglais: createEmptyGrade(),
  };
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useGrades() {
  const sessionId = getOrCreateSessionId();
  const [grades, setGrades] = useState<GradesData>(() => {
    const backup = localStorage.getItem(GRADES_BACKUP_KEY);
    return backup ? JSON.parse(backup) : createEmptyGrades();
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use refs to always have access to latest values in callbacks
  const gradesRef = useRef(grades);
  gradesRef.current = grades;

  // Fetch existing grades from server
  const { data: serverGrades, isLoading } = useQuery<{ grades: GradesData } | null>({
    queryKey: [`/api/grades/${sessionId}`],
  });

  // Load server grades on initial fetch
  useEffect(() => {
    if (serverGrades?.grades) {
      setGrades(serverGrades.grades);
      localStorage.setItem(GRADES_BACKUP_KEY, JSON.stringify(serverGrades.grades));
    }
  }, [serverGrades]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: { grades: GradesData; finalAverage: number | null }) => {
      return await apiRequest("POST", "/api/grades", {
        sessionId,
        grades: data.grades,
        finalAverage: data.finalAverage,
      });
    },
    onSuccess: () => {
      setSaveStatus("saved");
      queryClient.invalidateQueries({ queryKey: [`/api/grades/${sessionId}`] });
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    onError: () => {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    },
  });

  // Calculate averages helper
  const calculateAllAverages = useCallback((currentGrades: GradesData) => {
    const subjectAvgs: { [key: string]: number | null } = {};
    for (const subject of subjects) {
      const g = currentGrades[subject.id as keyof GradesData];
      subjectAvgs[subject.id] = calculateSubjectAverage(
        g.td,
        g.exam,
        g.tp,
        subject.hasTp
      );
    }
    return {
      subjectAverages: subjectAvgs,
      finalAverage: calculateFinalAverage(subjectAvgs),
    };
  }, []);

  // Calculate current averages
  const { subjectAverages, finalAverage } = calculateAllAverages(grades);

  // Auto-save with debounce - uses ref to get latest values
  const triggerSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus("saving");
    
    saveTimeoutRef.current = setTimeout(() => {
      const currentGrades = gradesRef.current;
      const { finalAverage: currentFinalAverage } = calculateAllAverages(currentGrades);
      saveMutation.mutate({ 
        grades: currentGrades, 
        finalAverage: currentFinalAverage 
      });
    }, 800);
  }, [saveMutation, calculateAllAverages]);

  // Update a grade field
  const updateGrade = useCallback(
    (subjectId: string, field: "td" | "tp" | "exam", value: number | null) => {
      setGrades((prev) => {
        const subject = subjects.find((s) => s.id === subjectId);
        if (!subject) return prev;

        const updatedSubjectGrade = {
          ...prev[subjectId as keyof GradesData],
          [field]: value,
        };

        // Calculate new average for this subject
        updatedSubjectGrade.average = calculateSubjectAverage(
          updatedSubjectGrade.td,
          updatedSubjectGrade.exam,
          updatedSubjectGrade.tp,
          subject.hasTp
        );

        const newGrades = {
          ...prev,
          [subjectId]: updatedSubjectGrade,
        };

        // Backup to localStorage
        localStorage.setItem(GRADES_BACKUP_KEY, JSON.stringify(newGrades));

        return newGrades;
      });

      // Trigger auto-save
      triggerSave();
    },
    [triggerSave]
  );

  // Reset all grades
  const resetGrades = useCallback(() => {
    const emptyGrades = createEmptyGrades();
    setGrades(emptyGrades);
    localStorage.setItem(GRADES_BACKUP_KEY, JSON.stringify(emptyGrades));
    triggerSave();
  }, [triggerSave]);

  return {
    grades,
    subjectAverages,
    finalAverage,
    updateGrade,
    resetGrades,
    saveStatus,
    isLoading,
  };
}
