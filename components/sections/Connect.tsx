"use client";

import { SectionHeader } from "../ui";
import { profile } from "@/lib/profile";

export default function Connect({ calendarUrl }: { calendarUrl: string }) {
  return (
    <section>
      <SectionHeader
        title="connect"
        subtitle="Open to Senior Data Engineer roles in the UK"
      />

      <div className="panel p-6">
        <h3 className="text-lg font-bold">Want to discuss an opportunity? 👋</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          If you&apos;re hiring for a data engineering role — or just want to chat about pipelines,
          SQL, or SAP data migration — grab a slot that works for you and I&apos;ll send a Google Meet
          link. No forms, no back-and-forth.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.links.email}?subject=Opportunity%20—%20Data%20Engineer`}
            className="inline-flex items-center gap-2 rounded border border-border bg-panel px-4 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
          >
            ✉️ Email me
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded border border-border bg-panel px-4 py-2 text-sm text-fg transition-colors hover:border-cyan hover:text-cyan"
          >
            in LinkedIn ↗
          </a>
          {calendarUrl && (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded border border-accent bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/20"
            >
              📅 Book a Google Meet
            </a>
          )}
        </div>
      </div>

      {/* Google Calendar appointment scheduling embed */}
      {calendarUrl ? (
        <div className="mt-6 overflow-hidden rounded-md border border-border bg-white">
          <iframe
            src={calendarUrl.includes("gv=true") ? calendarUrl : `${calendarUrl}${calendarUrl.includes("?") ? "&" : "?"}gv=true`}
            title="Book a meeting with Meghana"
            className="h-[600px] w-full"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mt-6 rounded-md border border-amber/30 bg-amber/5 p-4 text-xs text-amber">
          Booking calendar not configured yet — set{" "}
          <code className="text-fg">NEXT_PUBLIC_CALENDAR_URL</code> to a Google Calendar appointment
          scheduling link to embed the booking widget here. Email / LinkedIn above work in the
          meantime.
        </div>
      )}
    </section>
  );
}
