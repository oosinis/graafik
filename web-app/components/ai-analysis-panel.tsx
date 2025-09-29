"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AIAnalysisPanelProps {
  scheduleId: string;
}

export function AIAnalysisPanel({ scheduleId }: AIAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSchedule = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
      const response = await fetch(`${apiUrl}/schedules/${scheduleId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data.analysis || data.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze schedule');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">AI Schedule Analysis</h3>
        <Button
          onClick={analyzeSchedule}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            'Get AI Analysis'
          )}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">Claude's Analysis:</h4>
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {analysis}
          </div>
        </div>
      )}

      {!analysis && !error && !isLoading && (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">
            Click "Get AI Analysis" to receive intelligent feedback about this schedule.
          </p>
        </div>
      )}
    </div>
  );
}