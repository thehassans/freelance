import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function CapacityPlannerSEO() {
  return (
    <section className="w-full max-w-5xl mx-auto mt-24 pt-12 border-t border-slate-200 prose prose-slate">
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Capacity Planning Insights</h2>

        <div className="space-y-4">
          <details className="group bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all hover:border-indigo-200 shadow-sm" open>
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <h3 className="text-xl font-bold text-slate-900 m-0">1. What is agency capacity planning?</h3>
              <ChevronDown className="text-slate-400 transition-transform group-open:rotate-180" size={20} />
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed space-y-4">
              <p>
                Agency capacity planning is just a fancy way of saying “making the most of your current resource capacity.” 
                It’s about figuring out how much work your team can handle, assigning the right people to the right projects, 
                and making sure the time frame is realistic.
              </p>
              <p>
                The goal? To strike the perfect balance—keeping your team busy but not burned out and making sure you’re not overpromising to clients.
              </p>
              <p>It includes things like:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Team availability: Figuring out how many hours your team has available</li>
                <li>Expected demand: How many future projects do you anticipate during this season?</li>
                <li>Forecasting project timelines</li>
                <li>Scheduling resources: Staying on top of resource availability</li>
                <li>Changing demands: Avoid project delays by adjusting plans when things change (because they always do)</li>
              </ul>
              <p>Done well, capacity planning helps you hit deadlines, avoid chaos, and scale.</p>
            </div>
          </details>

          <details className="group bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all hover:border-indigo-200 shadow-sm">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <h3 className="text-xl font-bold text-slate-900 m-0">2. Why agency capacity planning is essential</h3>
              <ChevronDown className="text-slate-400 transition-transform group-open:rotate-180" size={20} />
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed space-y-4">
              <p>
                For digital marketing agencies, capacity planning is a game changer. Your projects are often complex, 
                with tight deadlines and lots of moving parts. Without a solid plan, things can quickly spiral out of control.
              </p>
              <p>Here’s what happens when capacity planning goes wrong:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Your team burns out.</strong> Overloading your team breaks team morale, leads to stress, mistakes, and even turnover.</li>
                <li><strong>Deadlines slip.</strong> With resource bottlenecks, for example when team resources aren’t allocated properly or you don’t have enough resources, it’s easy to fall behind.</li>
                <li><strong>Profitability takes a hit.</strong> Mismanaging time and resources costs money—and no one wants that.</li>
              </ul>
              <p>With good capacity planning, you can:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Predict and manage workloads like a pro, hiring extra freelancers if necessary</li>
                <li>Spot resource gaps before they become problems</li>
                <li>Consistently deliver great work on time</li>
                <li>Scale your agency smoothly without growing pains and with happier teams!</li>
              </ul>
              <p>With good capacity planning, you can:</p>
               <ul className="list-disc pl-5 space-y-1">
                <li>Predict and manage workloads like a pro, hiring extra freelancers if necessary</li>
                <li>Spot resource gaps before they become problems</li>
                <li>Consistently deliver great work on time</li>
                <li>Scale your agency smoothly without growing pains and with happier teams!</li>
              </ul>
            </div>
          </details>

          <details className="group bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all hover:border-indigo-200 shadow-sm">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <h3 className="text-xl font-bold text-slate-900 m-0">3. Benefits of a Capacity Planning Tool</h3>
              <ChevronDown className="text-slate-400 transition-transform group-open:rotate-180" size={20} />
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed space-y-4">
              <p>
                Having a dedicated tool like the <strong>v3.0 PROFIT+ Capacity Planner</strong> provides several advantages:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Real-time Visibility:</strong> Instantly see who is overbooked and who has bandwidth.</li>
                <li><strong>Scenario Forecasting:</strong> Simulate potential projects or scope creep to see their impact on your team's margin.</li>
                <li><strong>Profitability Metrics:</strong> Track billable utilization and gross profit margins per resource.</li>
                <li><strong>Data-Driven Hiring:</strong> Identify exactly when you need to bring on new hires or contractors based on capacity gaps.</li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
