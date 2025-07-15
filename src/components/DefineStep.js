import React from 'react';
import { Brain, Loader2, Copy } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

const DefineStep = ({ defineData, setDefineData, evaluateProblemStatement, empathyData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">Define Phase</h3>
        <p className="text-green-700">
          Use the 5-Whys technique to dig deep into the root cause of your user's problems, then craft a clear problem statement.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-3">5-Whys Analysis</h4>
          <p className="text-sm text-gray-600 mb-4">
            Start with a problem you identified during empathy interviews and ask "why" five times to find the root cause.
          </p>
          
          {defineData.whyAnswers.map((answer, index) => (
            <div key={index} className="mb-3">
              <label htmlFor={`why-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Why #{index + 1}: {index === 0 ? 'What is the initial problem?' : 'Why does this happen?'}
              </label>
              <input
                id={`why-${index}`}
                type="text"
                value={answer}
                onChange={(e) => {
                  const newAnswers = [...defineData.whyAnswers];
                  newAnswers[index] = e.target.value;
                  setDefineData(prev => ({ ...prev, whyAnswers: newAnswers }));
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={index === 0 ? "State the initial problem..." : "Explain why this happens..."}
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700 mb-2">
            Problem Statement (Include the root cause from your 5-Whys)
          </label>
          <textarea
            id="problemStatement"
            value={defineData.problemStatement}
            onChange={(e) => setDefineData(prev => ({ ...prev, problemStatement: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows="4"
            placeholder="[Target Audience] needs [need] because [root cause/insight from 5-Whys]"
          />
          <button
            onClick={() => copyToClipboard(defineData.problemStatement)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy Problem Statement
          </button>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2" /> AI Problem Statement Evaluator
            </h4>
            <p className="text-sm text-gray-700 mb-4">
              Get an AI-powered evaluation of your problem statement based on your empathy interviews and 5-Whys analysis.
            </p>
            <button
              onClick={evaluateProblemStatement}
              disabled={defineData.isEvaluating || !empathyData.targetAudience || empathyData.chatHistory.length === 0 || !defineData.problemStatement.trim() || !defineData.whyAnswers[0].trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {defineData.isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Evaluating...
                </>
              ) : (
                'Evaluate Problem Statement'
              )}
            </button>

            {defineData.aiEvaluation && (
              <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h5 className="font-bold text-lg mb-2">AI Evaluation Result:</h5>
                <p className="text-sm mb-2">
                  <span className="font-semibold">Score:</span> {defineData.aiEvaluation.score}/10
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Feedback:</span> {defineData.aiEvaluation.feedback}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefineStep;
