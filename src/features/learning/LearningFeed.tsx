import type { ReactNode } from "react";
import type { TreatmentStep } from "../../schemas/productState";

export function LearningFeed({ step }: { step: TreatmentStep }) {
  return (
    <aside className="learning-feed" aria-label="Learning feed">
      <LearningBlock title="What are you deciding?">{step.learning.deciding}</LearningBlock>
      <LearningBlock title="Why does it matter?">{step.learning.matters}</LearningBlock>
      <LearningBlock title="What does a good answer look like?">{step.learning.goodAnswer}</LearningBlock>
      <LearningBlock title="What data does this create?">
        <TagList items={step.learning.dataCreated} />
      </LearningBlock>
      <LearningBlock title="What will use this data later?">
        <TagList items={step.learning.usedLaterBy} />
      </LearningBlock>
    </aside>
  );
}

function LearningBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="learning-block">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="tag-list">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}
