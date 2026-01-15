import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { type Subject } from "@/lib/subjects";
import { type SubjectGrade } from "@shared/schema";
import { Check, AlertCircle } from "lucide-react";

interface SubjectCardProps {
  subject: Subject;
  grade: SubjectGrade;
  subjectAverage: number | null;
  onUpdateGrade: (field: "td" | "tp" | "exam", value: number | null) => void;
}

export function SubjectCard({
  subject,
  grade,
  subjectAverage,
  onUpdateGrade,
}: SubjectCardProps) {
  const handleInputChange = (field: "td" | "tp" | "exam", value: string) => {
    if (value === "") {
      onUpdateGrade(field, null);
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 20) {
      onUpdateGrade(field, Math.round(num * 100) / 100);
    }
  };

  const isComplete = subjectAverage !== null;
  const isPassing = subjectAverage !== null && subjectAverage >= 10;

  return (
    <Card 
      className="border-card-border bg-card transition-all duration-200"
      data-testid={`card-subject-${subject.id}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3 pt-4 px-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-base leading-tight" data-testid={`text-subject-name-${subject.id}`}>
            {subject.name}
          </h3>
          <span className="text-xs text-muted-foreground">{subject.nameAr}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-medium" data-testid={`badge-coef-${subject.id}`}>
            Coef: {subject.coefficient}
          </Badge>
          {isComplete && (
            <div 
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                isPassing ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
              }`}
              data-testid={`status-${subject.id}`}
            >
              {isPassing ? (
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className={`grid gap-3 ${subject.hasTp ? "grid-cols-3" : "grid-cols-2"}`}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${subject.id}-td`} className="text-xs font-medium text-muted-foreground">
              TD
            </Label>
            <Input
              id={`${subject.id}-td`}
              type="number"
              inputMode="decimal"
              min="0"
              max="20"
              step="0.5"
              placeholder="0-20"
              value={grade.td ?? ""}
              onChange={(e) => handleInputChange("td", e.target.value)}
              className="h-12 text-center text-lg font-medium"
              data-testid={`input-td-${subject.id}`}
            />
          </div>
          {subject.hasTp && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${subject.id}-tp`} className="text-xs font-medium text-muted-foreground">
                TP
              </Label>
              <Input
                id={`${subject.id}-tp`}
                type="number"
                inputMode="decimal"
                min="0"
                max="20"
                step="0.5"
                placeholder="0-20"
                value={grade.tp ?? ""}
                onChange={(e) => handleInputChange("tp", e.target.value)}
                className="h-12 text-center text-lg font-medium"
                data-testid={`input-tp-${subject.id}`}
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${subject.id}-exam`} className="text-xs font-medium text-muted-foreground">
              Exam
            </Label>
            <Input
              id={`${subject.id}-exam`}
              type="number"
              inputMode="decimal"
              min="0"
              max="20"
              step="0.5"
              placeholder="0-20"
              value={grade.exam ?? ""}
              onChange={(e) => handleInputChange("exam", e.target.value)}
              className="h-12 text-center text-lg font-medium"
              data-testid={`input-exam-${subject.id}`}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{subject.formula}</span>
          {subjectAverage !== null && (
            <span 
              className={`text-sm font-semibold ${
                isPassing ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
              data-testid={`text-average-${subject.id}`}
            >
              {subjectAverage.toFixed(2)}/20
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
