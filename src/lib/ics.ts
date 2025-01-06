// lib/ics.ts

import moment from "moment";

/**
 * Generates a string in .ics (iCalendar) format.
 *
 * @param title       Event title
 * @param description Event description
 * @param start       Start date/time (Date object)
 * @param end         End date/time (Date object)
 */
export function generateICS({
                                title,
                                description,
                                start,
                                end,
                            }: {
    title: string;
    description?: string;
    start: Date;
    end: Date;
}): string {
    // Convert to moment objects in UTC
    const startMoment = moment(start).utc();
    const endMoment = moment(end).utc();

    // Format datetimes in ICS-compatible style, e.g., "20250107T140000Z"
    const startStr = startMoment.format("YYYYMMDDTHHmmss[Z]");
    const endStr = endMoment.format("YYYYMMDDTHHmmss[Z]");

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//YourApp//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `DTSTART:${startStr}`,
        `DTEND:${endStr}`,
        `SUMMARY:${escapeICS(title)}`,
        `DESCRIPTION:${escapeICS(description || "")}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");

    return icsContent;
}

/**
 * Basic escaping for ICS content (e.g., newlines, commas, semicolons).
 *
 * ICS format can be picky about certain characters, newlines, etc.
 */
function escapeICS(str: string): string {
    return str
        .replace(/\\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
}