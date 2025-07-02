
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Info, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { exerciseInstructions } from '@/utils/exerciseInstructions';

interface ExerciseInstructionsProps {
  exerciseId: string;
  onStart: () => void;
}

const ExerciseInstructions = ({ exerciseId, onStart }: ExerciseInstructionsProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('setup');
  const instruction = exerciseInstructions[exerciseId];

  if (!instruction) return null;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const InstructionSection = ({ 
    title, 
    items, 
    icon: Icon, 
    sectionKey, 
    color 
  }: { 
    title: string; 
    items: string[]; 
    icon: any; 
    sectionKey: string; 
    color: string;
  }) => (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {expandedSection === sectionKey ? (
          <ChevronUp className="w-5 h-5 text-white" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white" />
        )}
      </button>
      
      {expandedSection === sectionKey && (
        <div className="px-4 pb-4 space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-xs font-semibold text-white">{index + 1}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{instruction.name}</h1>
          <p className="text-slate-300">Follow these instructions for proper form and maximum effectiveness</p>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-8">
          <InstructionSection
            title="Setup & Position"
            items={instruction.setup}
            icon={Target}
            sectionKey="setup"
            color="bg-blue-500/20"
          />
          
          <InstructionSection
            title="Exercise Execution"
            items={instruction.execution}
            icon={CheckCircle}
            sectionKey="execution"
            color="bg-green-500/20"
          />
          
          <InstructionSection
            title="Pro Tips"
            items={instruction.tips}
            icon={Info}
            sectionKey="tips"
            color="bg-purple-500/20"
          />
          
          <InstructionSection
            title="Common Mistakes to Avoid"
            items={instruction.commonMistakes}
            icon={AlertTriangle}
            sectionKey="mistakes"
            color="bg-red-500/20"
          />
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button
            onClick={onStart}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Exercise
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseInstructions;
