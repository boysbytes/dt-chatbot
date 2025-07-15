import React from 'react';
import { Copy } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

const PrototypeStep = ({ testData, setTestData, ideateData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-semibold text-orange-800 mb-2">Prototype Phase</h3>
        <p className="text-orange-700">
          Create a simple prototype or detailed plan for your selected solution. This will be tested with your target audience.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Your Selected Solution</h4>
          <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
            {ideateData.selectedSolution || 'No solution selected yet. Complete the Ideate phase.'}
          </div>
        </div>

        <div>
          <label htmlFor="testPlan" className="block text-sm font-medium text-gray-700 mb-2">
            Prototype Description / Test Plan
          </label>
          <textarea
            id="testPlan"
            value={testData.testPlan}
            onChange={(e) => setTestData(prev => ({ ...prev, testPlan: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows="6"
            placeholder="Describe your prototype or how you would implement your solution. Include key features, user interactions, and what you want to test..."
          />
          <button
            onClick={() => copyToClipboard(testData.testPlan)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy Prototype Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrototypeStep;
