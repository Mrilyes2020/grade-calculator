import { SubjectCard } from "@/components/subject-card";
import { ResultsDisplay } from "@/components/results-display";
import { SaveIndicator } from "@/components/save-indicator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useGrades } from "@/hooks/use-grades";
import { subjects } from "@/lib/subjects";
import { type GradesData } from "@shared/schema";
import { Calculator, RotateCcw, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CalculatorPage() {
  const {
    grades,
    subjectAverages,
    finalAverage,
    updateGrade,
    resetGrades,
    saveStatus,
    isLoading,
  } = useGrades();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Loading grades...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Calculator className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="font-semibold text-lg" data-testid="text-app-title">
              Grade Calculator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <SaveIndicator status={saveStatus} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-4 pb-24 md:pb-8">
        <div className="grid gap-6 md:grid-cols-[1fr,320px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Enter Your Grades</h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="button-reset">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset all grades?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear all your entered grades. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid="button-reset-cancel">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetGrades} data-testid="button-reset-confirm">
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="space-y-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  grade={grades[subject.id as keyof GradesData]}
                  subjectAverage={subjectAverages[subject.id]}
                  onUpdateGrade={(field, value) => updateGrade(subject.id, field, value)}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="sticky top-20">
              <ResultsDisplay
                finalAverage={finalAverage}
                subjectAverages={subjectAverages}
              />
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur border-t border-border p-4 z-50">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Final Average</span>
              {finalAverage !== null ? (
                <span 
                  className={`text-2xl font-bold ${
                    finalAverage >= 10 ? "text-primary" : "text-destructive"
                  }`}
                  data-testid="text-mobile-average"
                >
                  {finalAverage.toFixed(2)}/20
                </span>
              ) : (
                <span className="text-lg text-muted-foreground">--/20</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {finalAverage !== null && (
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    finalAverage >= 10 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                  data-testid="text-mobile-status"
                >
                  {finalAverage >= 10 ? "Pass" : "Fail"}
                </span>
              )}
              <SaveIndicator status={saveStatus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
