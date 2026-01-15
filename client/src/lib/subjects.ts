export interface Subject {
  id: string;
  name: string;
  nameAr: string;
  coefficient: number;
  hasTp: boolean;
  formula: string;
}

export const subjects: Subject[] = [
  {
    id: "proba",
    name: "Probability",
    nameAr: "الاحتمالات",
    coefficient: 4,
    hasTp: false,
    formula: "(TD × 0.4) + (Exam × 0.6)",
  },
  {
    id: "stat",
    name: "Statistics",
    nameAr: "الإحصاء",
    coefficient: 4,
    hasTp: false,
    formula: "(TD × 0.4) + (Exam × 0.6)",
  },
  {
    id: "mna",
    name: "MNA",
    nameAr: "التحليل العددي",
    coefficient: 4,
    hasTp: true,
    formula: "(TD × 0.2) + (TP × 0.2) + (Exam × 0.6)",
  },
  {
    id: "system",
    name: "System",
    nameAr: "الأنظمة",
    coefficient: 2,
    hasTp: false,
    formula: "(TD × 0.4) + (Exam × 0.6)",
  },
  {
    id: "bd",
    name: "Database",
    nameAr: "قواعد البيانات",
    coefficient: 4,
    hasTp: true,
    formula: "(TD × 0.2) + (TP × 0.2) + (Exam × 0.6)",
  },
  {
    id: "reseaux",
    name: "Networks",
    nameAr: "الشبكات",
    coefficient: 3,
    hasTp: true,
    formula: "(TD × 0.2) + (TP × 0.2) + (Exam × 0.6)",
  },
  {
    id: "anglais",
    name: "English",
    nameAr: "الإنجليزية",
    coefficient: 1,
    hasTp: false,
    formula: "(TD × 0.4) + (Exam × 0.6)",
  },
];

export const totalCoefficients = subjects.reduce((sum, s) => sum + s.coefficient, 0);

export function calculateSubjectAverage(
  td: number | null,
  exam: number | null,
  tp?: number | null | undefined,
  hasTp?: boolean
): number | null {
  if (td === null || exam === null) return null;
  if (hasTp && (tp === null || tp === undefined)) return null;

  if (hasTp && tp !== null && tp !== undefined) {
    return td * 0.2 + tp * 0.2 + exam * 0.6;
  }
  return td * 0.4 + exam * 0.6;
}

export function calculateFinalAverage(
  subjectAverages: { [key: string]: number | null }
): number | null {
  let totalWeighted = 0;
  let totalCoef = 0;

  for (const subject of subjects) {
    const avg = subjectAverages[subject.id];
    if (avg !== null && avg !== undefined) {
      totalWeighted += avg * subject.coefficient;
      totalCoef += subject.coefficient;
    }
  }

  if (totalCoef === 0) return null;
  return totalWeighted / totalCoef;
}
