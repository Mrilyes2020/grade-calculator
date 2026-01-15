import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { subjects, totalCoefficients } from "@/lib/subjects";
import { TrendingUp, TrendingDown, Calculator, Award } from "lucide-react";

interface ResultsDisplayProps {
  finalAverage: number | null;
  subjectAverages: { [key: string]: number | null };
}

export function ResultsDisplay({ finalAverage, subjectAverages }: ResultsDisplayProps) {
  const completedSubjects = Object.values(subjectAverages).filter((a) => a !== null).length;
  const isPassing = finalAverage !== null && finalAverage >= 10;
  const progress = (completedSubjects / subjects.length) * 100;

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20" data-testid="card-results">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Final Average</h2>
              <span className="text-xs text-muted-foreground">
                {completedSubjects}/{subjects.length} subjects
              </span>
            </div>
          </div>
          {finalAverage !== null && (
            <Badge 
              variant={isPassing ? "default" : "destructive"}
              className="text-xs"
              data-testid="badge-status"
            >
              {isPassing ? (
                <><TrendingUp className="w-3 h-3 mr-1" /> Pass</>
              ) : (
                <><TrendingDown className="w-3 h-3 mr-1" /> Fail</>
              )}
            </Badge>
          )}
        </div>

        <div className="relative mb-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-center py-4">
          {finalAverage !== null ? (
            <div className="flex flex-col items-center gap-1">
              <span 
                className={`text-5xl font-extrabold tracking-tight ${
                  isPassing ? "text-primary" : "text-destructive"
                }`}
                data-testid="text-final-average"
              >
                {finalAverage.toFixed(2)}
              </span>
              <span className="text-muted-foreground text-sm">/20</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
              <Award className="w-8 h-8" />
              <span className="text-sm">Enter grades to see your average</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {subjects.map((subject) => {
            const avg = subjectAverages[subject.id];
            const isSubjectPassing = avg !== null && avg >= 10;
            return (
              <div 
                key={subject.id}
                className={`flex items-center justify-between p-2 rounded-md ${
                  avg !== null 
                    ? isSubjectPassing 
                      ? "bg-green-50 dark:bg-green-900/20" 
                      : "bg-red-50 dark:bg-red-900/20"
                    : "bg-muted/50"
                }`}
                data-testid={`result-row-${subject.id}`}
              >
                <span className="text-xs font-medium truncate">{subject.name}</span>
                <span className={`text-xs font-semibold ${
                  avg !== null 
                    ? isSubjectPassing 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
                }`}>
                  {avg !== null ? avg.toFixed(1) : "-"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Total Coefficients:</span>
            <span className="font-medium">{totalCoefficients}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
