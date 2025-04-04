
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const RunningFAQ = () => {
  return (
    <div className="py-8 md:py-12 border-t">
      <div className="container max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg p-1">
            <AccordionTrigger className="px-4 py-2 hover:no-underline font-medium">
              How are the running plans generated?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 text-muted-foreground">
              <p className="mb-3">
                Our running plans are generated using a sophisticated algorithm based on established training principles used by coaches and exercise physiologists. Each plan follows a periodized training approach, which progressively builds volume and intensity while incorporating strategic recovery periods.
              </p>
              <p className="mb-3">
                The algorithm takes into account several key factors:
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>Your current fitness level and running volume</li>
                <li>Your specific goal (weight loss, general fitness, or race training)</li>
                <li>Your preferred training days and frequency</li>
                <li>Race distance and target times (for race training)</li>
                <li>Injury history and other personal factors</li>
              </ul>
              <p>
                Based on these inputs, we create a customized training schedule that follows established training principles such as progressive overload, specificity, and appropriate work-to-rest ratios.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border rounded-lg p-1">
            <AccordionTrigger className="px-4 py-2 hover:no-underline font-medium">
              What training methodology do you use?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 text-muted-foreground">
              <p className="mb-3">
                Our training plans incorporate elements from several well-established methodologies:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-3">
                <li>
                  <strong>Polarized Training:</strong> This approach emphasizes that the majority of training (about 80%) should be done at easy, aerobic intensities, while a smaller portion (about 20%) consists of high-intensity workouts. This methodology is supported by research showing it optimizes endurance adaptations while minimizing injury risk.
                </li>
                <li>
                  <strong>Periodization:</strong> We structure training in phases that build upon each other, typically following a pattern of base building, strength/speed development, and peak/taper phases for race-specific plans.
                </li>
                <li>
                  <strong>Progressive Overload:</strong> Plans gradually increase in volume and/or intensity to stimulate adaptation without overstressing the body.
                </li>
                <li>
                  <strong>Specific Adaptation to Imposed Demands (SAID):</strong> Workouts become increasingly specific to your goal as you progress through the plan.
                </li>
              </ul>
              <p>
                These methodologies are adapted based on current research in exercise physiology and sports science to create effective, scientifically-sound training plans.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border rounded-lg p-1">
            <AccordionTrigger className="px-4 py-2 hover:no-underline font-medium">
              How are training paces calculated?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 text-muted-foreground">
              <p className="mb-3">
                Training paces are calculated using a combination of methods adapted from well-established systems:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-3">
                <li>
                  <strong>Jack Daniels' VDOT System:</strong> This system uses your recent race performances to determine appropriate training paces for different types of workouts. It accounts for the physiological relationship between race performances at different distances.
                </li>
                <li>
                  <strong>Heart Rate Zones:</strong> For users who haven't provided race times, we estimate training paces based on typical heart rate zones as percentages of maximum heart rate or heart rate reserve.
                </li>
                <li>
                  <strong>Effort-Based Adjustments:</strong> The algorithm adjusts paces based on factors like terrain (adding time for hilly or trail runs) and weather conditions.
                </li>
              </ul>
              <p className="mb-3">
                For race training plans, we use your target race time to calculate your goal race pace, then derive all training paces as percentages of this pace. For general fitness and weight loss plans, paces are based on your reported fitness level and current running volume.
              </p>
              <p>
                These calculated paces should be used as guidelines rather than strict rules. Always adjust based on how you feel, and prioritize completing workouts at the appropriate effort level rather than hitting exact pace targets.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border rounded-lg p-1">
            <AccordionTrigger className="px-4 py-2 hover:no-underline font-medium">
              What is the science behind the different workout types?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 text-muted-foreground">
              <p className="mb-3">
                Each workout type in your plan targets specific physiological adaptations:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-3">
                <li>
                  <strong>Easy Runs:</strong> Improve aerobic capacity, capillary density, and mitochondrial function while placing minimal stress on the body. These runs build endurance while allowing for recovery.
                </li>
                <li>
                  <strong>Long Runs:</strong> Increase glycogen storage, improve fat utilization, enhance mental toughness, and condition your musculoskeletal system for prolonged efforts.
                </li>
                <li>
                  <strong>Tempo Runs:</strong> Improve lactate threshold, which is the intensity at which lactate begins to accumulate in the bloodstream. This helps you sustain faster paces for longer periods.
                </li>
                <li>
                  <strong>Interval Training:</strong> Enhances VO2max (maximal oxygen uptake), improves running economy, and increases anaerobic capacity by repeatedly stressing these systems with high-intensity efforts followed by recovery.
                </li>
                <li>
                  <strong>Hill Repeats:</strong> Develop running-specific strength, power, and running economy while reducing impact forces compared to flat-ground speed work.
                </li>
                <li>
                  <strong>Recovery Runs:</strong> Promote active recovery by increasing blood flow to muscles without adding significant training stress, helping clear metabolic waste products.
                </li>
              </ul>
              <p>
                The specific mix and progression of these workout types is tailored to your goal, current fitness level, and training history to maximize adaptations while minimizing injury risk.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border rounded-lg p-1">
            <AccordionTrigger className="px-4 py-2 hover:no-underline font-medium">
              How accurate are the training plans for my goals?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 text-muted-foreground">
              <p className="mb-3">
                Our training plans are designed to be both effective and adaptable based on established training principles and scientific research. The accuracy for your specific situation depends on several factors:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-3">
                <li>
                  <strong>Data Quality:</strong> The more accurate and complete information you provide about your current fitness, goals, and constraints, the more precisely tailored your plan will be.
                </li>
                <li>
                  <strong>Individual Variability:</strong> People respond differently to training stimuli based on genetics, training history, recovery capacity, and other factors that cannot be fully captured in an algorithm.
                </li>
                <li>
                  <strong>External Factors:</strong> Life stress, sleep quality, nutrition, and other variables can significantly impact training adaptations and are not factored into the plan generation.
                </li>
              </ul>
              <p className="mb-3">
                For weight loss plans, we focus on a combination of calorie expenditure and metabolic conditioning. For general fitness, we emphasize balanced development of endurance, strength, and speed. For race training, we incorporate race-specific preparation and appropriate tapering.
              </p>
              <p>
                While our plans provide a strong foundation based on scientific principles, they should be viewed as living documents. Listen to your body and be willing to adjust as needed. For highly specific goals or if you have complex medical considerations, working with a personal coach may still be beneficial.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6" className="border rounded-lg p-1">
            <AccordionTrigger className="px-4 py-2 hover:no-underline font-medium">
              How should I modify the plan if I miss workouts?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 text-muted-foreground">
              <p className="mb-3">
                Missing occasional workouts is a normal part of training. Here's how to handle it:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-3">
                <li>
                  <strong>Single Missed Easy Run:</strong> Simply continue with the scheduled plan. There's no need to make up the missed volume.
                </li>
                <li>
                  <strong>Missed Key Workout (Intervals, Tempo, Long Run):</strong> If possible, shift the workout by 1-2 days, ensuring you still have adequate recovery before the next quality session. If you can't fit it in, prioritize the long run over other quality sessions.
                </li>
                <li>
                  <strong>Missing Several Days (illness, travel, etc.):</strong> Resume training at a slightly reduced volume (about 70-80% of where you left off) for a few days before returning to the scheduled plan. For absences longer than a week, you may need to back up a week in the plan.
                </li>
                <li>
                  <strong>Chronic Missed Workouts:</strong> If you're regularly unable to complete the scheduled training, consider generating a new plan with fewer weekly sessions or lower volume that better fits your availability.
                </li>
              </ul>
              <p>
                Remember that consistency over time is more important than any single workout. It's better to adjust your plan to fit your life than to stress about missed sessions or try to compensate by overtraining when you do have time.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7" className="border rounded-lg p-1">
            <AccordionTrigger className="px-4 py-2 hover:no-underline font-medium">
              What research supports the training methods used?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-1 text-muted-foreground">
              <p className="mb-3">
                Our training methodologies are based on extensive research in exercise physiology and sports science:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-3">
                <li>
                  <strong>Polarized Training:</strong> Research by Stephen Seiler and others has shown that elite endurance athletes across multiple sports typically follow a polarized training distribution, with approximately 80% of training at low intensity and 20% at high intensity. Studies have demonstrated this approach often yields better adaptations than threshold-focused training.
                </li>
                <li>
                  <strong>Periodization:</strong> Meta-analyses by Rhea et al. and others have confirmed that periodized training programs produce superior strength and endurance gains compared to non-periodized programs. Both linear and undulating periodization models have shown effectiveness for different populations.
                </li>
                <li>
                  <strong>Running Economy:</strong> Studies by Jones, Franch, and others have identified specific training interventions that improve running economy, including high-intensity interval training, hill work, and plyometric exercises.
                </li>
                <li>
                  <strong>Recovery Practices:</strong> Research by Kellmann, Halson, and others has established the importance of programmed recovery in optimizing adaptations and preventing overtraining syndrome.
                </li>
                <li>
                  <strong>Tapering:</strong> Meta-analyses by Bosquet et al. have shown that reducing training volume by 40-60% while maintaining intensity for 2-3 weeks optimizes performance in endurance events.
                </li>
              </ul>
              <p>
                Our algorithm synthesizes this research along with established training principles from respected coaches and exercise scientists to create evidence-based training plans tailored to individual goals and constraints.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default RunningFAQ;
