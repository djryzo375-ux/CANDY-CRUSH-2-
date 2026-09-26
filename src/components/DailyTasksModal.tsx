/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DailyTask } from '../types/candy';
import { X, CheckCircle, Clock, Trophy, Award, Gift, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/sound';

interface DailyTasksModalProps {
  tasks: DailyTask[];
  onClaimTask: (taskId: string, rewardGold: number) => void;
  onClose: () => void;
}

export const DailyTasksModal: React.FC<DailyTasksModalProps> = ({
  tasks,
  onClaimTask,
  onClose,
}) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const allCompleted = completedCount === tasks.length;

  const handleClaim = (task: DailyTask) => {
    if (!task.completed || task.claimed) return;
    sound.playSugarCrush();
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.7 },
    });
    onClaimTask(task.id, task.rewardGold);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in select-none">
      <div className="bg-gradient-to-b from-purple-900 via-indigo-950 to-purple-950 border-4 border-amber-400 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-[0_0_40px_rgba(245,158,11,0.5)] overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-4 bg-purple-950/90 border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center font-black text-xl shadow">
              📋
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-300">Daily Tasks & Quests</h2>
              <div className="flex items-center gap-2 text-xs text-purple-300">
                <Clock className="w-3.5 h-3.5 text-cyan-300" />
                <span>Resets daily at 00:00 UTC</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-purple-800 hover:bg-pink-600 text-white flex items-center justify-center transition-all cursor-pointer shadow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quest Completion Progress Banner */}
        <div className="p-4 bg-purple-900/60 border-b border-purple-800">
          <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
            <span className="text-purple-200">Daily Progress</span>
            <span className="text-amber-300">{completedCount} of {tasks.length} Completed</span>
          </div>
          <div className="w-full h-3 bg-purple-950 rounded-full border border-purple-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / tasks.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Task List (English Language Only) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {tasks.map((task) => {
            const percent = Math.min(100, Math.round((task.current / task.target) * 100));

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                  task.claimed
                    ? 'bg-purple-950/40 border-purple-800/60 opacity-60'
                    : task.completed
                    ? 'bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border-green-400 shadow-md'
                    : 'bg-purple-950/70 border-purple-700/80 hover:border-purple-600'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-900 border border-purple-700 flex items-center justify-center text-xl shrink-0 shadow">
                    {task.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm text-white truncate">{task.title}</h4>
                    <p className="text-xs text-purple-200 line-clamp-1">{task.description}</p>
                    
                    {/* Progress line */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-2 bg-purple-950 rounded-full overflow-hidden border border-purple-700">
                        <div
                          className="h-full bg-amber-400 transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-purple-300 shrink-0">
                        {task.current}/{task.target}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Claim Button / Status */}
                <div className="shrink-0">
                  {task.claimed ? (
                    <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Claimed
                    </span>
                  ) : task.completed ? (
                    <button
                      onClick={() => handleClaim(task)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-purple-950 font-black text-xs shadow-md transition-transform active:scale-95 cursor-pointer animate-pulse"
                    >
                      Claim +{task.rewardGold}
                    </button>
                  ) : (
                    <div className="bg-purple-900/60 border border-purple-700 px-2.5 py-1 rounded-xl text-center">
                      <span className="text-[10px] text-amber-300 font-bold block">+{task.rewardGold} Gold</span>
                      <span className="text-[9px] text-purple-400 font-medium">In Progress</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-purple-950/90 border-t border-purple-800 text-center text-xs text-purple-300">
          Complete daily tasks every 24 hours to earn free Gold Bars & Boosters!
        </div>
      </div>
    </div>
  );
};
