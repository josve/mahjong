"use client";

import React, {useEffect, useState} from "react";
import {Avatar, AvatarGroup, Box, Button, Paper, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import VideocamIcon from "@mui/icons-material/Videocam";
import {ProposalTeam, TeamAvatar} from "@/components/proposals/shared";

export type Rsvp = "yes" | "maybe" | "no";

interface Props {
    readonly gameTime: Date;
    readonly meetingLink?: string | null;
    readonly attendees: { player: ProposalTeam; rsvp: Rsvp }[];
    readonly myRsvp?: Rsvp | null;
}

function timeLeft(target: Date, now: number) {
    const total = Math.max(0, target.getTime() - now);
    return {
        days: Math.floor(total / 86400000),
        hours: Math.floor(total / 3600000) % 24,
        minutes: Math.floor(total / 60000) % 60,
        seconds: Math.floor(total / 1000) % 60,
    };
}

function icsFile(gameTime: Date, meetingLink?: string | null): string {
    const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const end = new Date(gameTime.getTime() + 3 * 3600000);
    return [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Mahjong Master System//SV", "BEGIN:VEVENT",
        `UID:${stamp(gameTime)}@mahjong`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(gameTime)}`, `DTEND:${stamp(end)}`,
        "SUMMARY:Mahjong 🀄", meetingLink ? `URL:${meetingLink}` : "", "END:VEVENT", "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");
}

/**
 * Förslag 7: Make the next match stand out on the start page with a
 * countdown, "add to calendar", the meeting link and who is coming.
 */
export default function NextMatchCountdown({gameTime, meetingLink, attendees, myRsvp = null}: Props) {
    const [now, setNow] = useState(() => Date.now());
    const [rsvp, setRsvp] = useState<Rsvp | null>(myRsvp);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const left = timeLeft(gameTime, now);
    const coming = attendees.filter((attendee) => attendee.rsvp === "yes");
    const calendarHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsFile(gameTime, meetingLink))}`;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5, borderRadius: 4, color: "white", maxWidth: 560, position: "relative", overflow: "hidden",
                background: "radial-gradient(circle farthest-corner at 100px 100px, var(--gradient-start) 0%, var(--gradient-end) 100%)",
            }}
        >
            <Typography sx={{color: "rgba(255,255,255,0.8)", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5}}>
                Nästa match
            </Typography>
            <Typography sx={{color: "white", fontSize: 22, fontWeight: 700}}>
                {gameTime.toLocaleDateString("sv-SE", {weekday: "long", day: "numeric", month: "long"})}
                {" kl "}
                {gameTime.toLocaleTimeString("sv-SE", {hour: "2-digit", minute: "2-digit"})}
            </Typography>

            <Box sx={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, my: 2}}>
                {([[left.days, "dagar"], [left.hours, "tim"], [left.minutes, "min"], [left.seconds, "sek"]] as const).map(([value, label]) => (
                    <Box key={label} sx={{textAlign: "center", py: 1, borderRadius: 2, backgroundColor: "rgba(0,0,0,0.18)"}}>
                        <Typography sx={{color: "white", fontSize: 32, fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1.1}}>
                            {String(value).padStart(2, "0")}
                        </Typography>
                        <Typography sx={{color: "rgba(255,255,255,0.7)", fontSize: 12}}>{label}</Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={{display: "flex", alignItems: "center", gap: 1.5, mb: 2}}>
                <AvatarGroup max={6} sx={{"& .MuiAvatar-root": {borderColor: "rgba(255,255,255,0.8)"}}}>
                    {coming.map(({player}) => <TeamAvatar key={player.id} team={player} size={32}/>)}
                    {coming.length === 0 && <Avatar sx={{width: 32, height: 32}}>?</Avatar>}
                </AvatarGroup>
                <Typography sx={{color: "white", fontSize: 14}}>
                    {coming.length} kommer · {attendees.filter((attendee) => attendee.rsvp === "maybe").length} kanske
                </Typography>
            </Box>

            <ToggleButtonGroup
                exclusive
                fullWidth
                size="small"
                value={rsvp}
                onChange={(_, value: Rsvp | null) => setRsvp(value)}
                sx={{
                    mb: 1.5, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 5,
                    "& .MuiToggleButton-root": {color: "white", border: 0, borderRadius: 5, textTransform: "none"},
                    "& .Mui-selected": {backgroundColor: "white !important", color: "#943030 !important", fontWeight: 700},
                }}
            >
                <ToggleButton value="yes">✓ Jag kommer</ToggleButton>
                <ToggleButton value="maybe">Kanske</ToggleButton>
                <ToggleButton value="no">Kan inte</ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{display: "flex", gap: 1}}>
                <Button
                    href={calendarHref}
                    download="mahjong.ics"
                    startIcon={<EventIcon/>}
                    sx={{flex: 1, backgroundColor: "rgba(255,255,255,0.18)", "&:hover": {backgroundColor: "rgba(255,255,255,0.28)"}}}
                >
                    Lägg i kalendern
                </Button>
                {meetingLink && (
                    <Button
                        href={meetingLink}
                        target="_blank"
                        startIcon={<VideocamIcon/>}
                        sx={{flex: 1, backgroundColor: "white", color: "#943030", "&:hover": {backgroundColor: "white"}}}
                    >
                        Gå med
                    </Button>
                )}
            </Box>
        </Paper>
    );
}
