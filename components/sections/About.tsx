"use client";

import { SectionHeader, Stat } from "../ui";
import MigrationFlow from "../MigrationFlow";
import {
  profile,
  experience,
  skills,
  certifications,
  education,
  impact,
} from "@/lib/profile";

export default function About() {
  return (
    <section>
      <SectionHeader
        title="about me"
        subtitle={`${profile.role} · ${profile.focus} · ${profile.location}`}
        right={
          <a
            href={profile.links.site}
            target="_blank"
            rel="noreferrer"
            className="hidden text-xs text-cyan hover:underline sm:block"
          >
            meghanabv19.github.io ↗
          </a>
        }
      />

      <p className="max-w-2xl text-sm leading-relaxed text-fg">{profile.summary}</p>
      <p className="mt-2 text-xs text-accent">{profile.workRight}</p>

      {/* impact numbers */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {impact.map((m) => (
          <Stat key={m.label} value={m.value} label={m.label} accent="accent" />
        ))}
      </div>

      {/* what I do — migration architecture */}
      <h3 className="label mt-12 mb-2">what i do · enterprise data migration</h3>
      <p className="mb-4 max-w-2xl text-xs text-muted">
        End-to-end SAP data migration: I move millions of records from legacy systems into S/4HANA
        without surprises. Click through the stages to see how.
      </p>
      <MigrationFlow />

      {/* experience */}
      <h3 className="label mt-12 mb-4">experience</h3>
      <div className="space-y-6">
        {experience.map((job) => (
          <div key={job.company} className="panel px-4 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-bold">
                {job.company} <span className="font-normal text-muted">· {job.title}</span>
              </div>
              <div className="text-[11px] text-muted">{job.period}</div>
            </div>
            <div className="mt-3 space-y-3">
              {job.clients.map((c) => (
                <div key={c.name} className="border-l border-border pl-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm text-cyan">{c.name}</span>
                    <span className="text-[10px] text-muted/70">{c.period}</span>
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {c.points.map((p, i) => (
                      <li key={i} className="text-xs text-muted">
                        <span className="text-accent/60">›</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* skills */}
      <h3 className="label mt-12 mb-4">skills</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="panel px-4 py-3">
            <div className="text-xs font-semibold text-accent/80">{group}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {items.map((s) => (
                <span
                  key={s}
                  className="rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* certs + education */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="label mb-4">certifications</h3>
          <ul className="space-y-2">
            {certifications.map((c) => (
              <li key={c.name} className="flex items-baseline justify-between gap-2 text-xs">
                <span className="text-fg">{c.name}</span>
                <span className="shrink-0 text-muted/70">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="label mb-4">education</h3>
          <div className="panel px-4 py-3">
            <div className="text-sm font-medium">{education.degree}</div>
            <div className="mt-1 text-xs text-muted">{education.school}</div>
            <div className="mt-1 text-[10px] text-muted/70">{education.date}</div>
          </div>
          <h3 className="label mb-3 mt-8">contact</h3>
          <div className="space-y-1 text-xs">
            <a href={`mailto:${profile.links.email}`} className="block text-cyan hover:underline">
              {profile.links.email}
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="block text-cyan hover:underline">
              LinkedIn ↗
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="block text-cyan hover:underline">
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
