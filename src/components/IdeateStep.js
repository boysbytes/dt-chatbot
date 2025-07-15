import React from 'react';

const IdeateStep = ({ ideateData, setIdeateData, defineData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-semibold text-purple-800 mb-2">Ideate Phase</h3>
        <p className="text-purple-700">
          Generate multiple solution ideas for your problem statement, then select the most promising one to prototype.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-3">Solution Ideas</h4>
          <p className="text-sm text-gray-600 mb-4">
            Problem: {defineData.problemStatement || 'Complete the Define phase first'}
          </p>
          
          {ideateData.solutions.map((solution, index) => (
            <div key={index} className="mb-3">
              <label htmlFor={`solution-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Solution Idea #{index + 1}
              </label>
              <textarea
                id={`solution-${index}`}
                value={solution}
                onChange={(e) => {
                  const newSolutions = [...ideateData.solutions];
                  newSolutions[index] = e.target.value;
                  setIdeateData(prev => ({ ...prev, solutions: newSolutions }));
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="2"
                placeholder="Describe your solution idea..."
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="selectedSolution" className="block text-sm font-medium text-gray-700 mb-2">
            Selected Solution for Prototyping
          </label>
          <select
            id="selectedSolution"
            value={ideateData.selectedSolution}
            onChange={(e) => setIdeateData(prev => ({ ...prev, selectedSolution: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose a solution to develop...</option>
            {ideateData.solutions.map((solution, index) => (
              solution.trim() && (
                <option key={index} value={solution}>
                  Solution #{index + 1}: {solution.substring(0, 50)}{solution.length > 50 ? '...' : ''}
                </option>
              )
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default IdeateStep;
