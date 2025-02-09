import {
  checkAuthenticatedUser,
  checkUserSubscription,
  fetchUserSession,
} from "@/app/helpers";
import { toZonedTime } from "date-fns-tz";
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

interface assignment {
  id: number;
  name: string;
  description: string;
  due_date: string;
  color: string;
  start_time: string;
  end_time: string;
  reminder: number;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  /**
   * Checking if user is signed in
   */
  const userAuthenticated = await checkAuthenticatedUser();

  if (userAuthenticated.error) {
    return NextResponse.json(
      { error: userAuthenticated.error },
      { status: 401 }
    );
  }

  /**
   * Checking if user has paid access to this feature
   */
  const userSubscription = await checkUserSubscription(
    userAuthenticated.success?.email
  );

  if (userSubscription.error === "Access denied --- Subscription required") {
    return NextResponse.json(
      { error: userSubscription.error },
      { status: 403 }
    );
  }

  if (userSubscription.error === "Error fetching user subscription status") {
    return NextResponse.json(
      { error: userSubscription.error },
      { status: 500 }
    );
  }

  /**
   * Fetching user session to get google provider token
   */
  const fetchSession = await fetchUserSession();

  if (fetchSession.error) {
    return NextResponse.json(
      { error: "Error fetching user session" },
      { status: 500 }
    );
  }

  if (!body.assignments) {
    return NextResponse.json(
      { error: "Missing assignment Data" },
      { status: 400 }
    );
  }

  const assignments: assignment[] = body.assignments;
  const providerToken: string | null | undefined =
    fetchSession.success.provider_token;
  const userTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!providerToken) {
    return NextResponse.redirect(
      new URL("/sign-in?reauth=true", request.url),
      303
    );
  }

  /**
   * Add to calendar logic here
   */

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set the Google OAuth token
    oauth2Client.setCredentials({
      access_token: providerToken,
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ].join(" "),
    });

    // Create Google Calendar instance
    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    // Format the event
    const results = await Promise.all(
      assignments.map(async (assignment) => {
        const event = {
          summary: assignment.name,
          description: `Assignment: ${assignment.name}`,
          start: {
            dateTime: formatDateTime(
              assignment.due_date,
              assignment.start_time,
              userTimeZone
            ),
            timeZone: userTimeZone,
          },
          end: {
            dateTime: formatDateTime(
              assignment.due_date,
              assignment.end_time,
              userTimeZone
            ),
            timeZone: userTimeZone,
          },
          colorId: googleCalendarIdConverter(assignment.color),
          reminders: {
            useDefault: false,
            overrides: [
              {
                method: "email",
                minutes: assignment.reminder,
              },
            ],
          },
        };

        const response = await calendar.events.insert({
          calendarId: "primary",
          requestBody: event,
        });

        if (!response.data.id) {
          return NextResponse.json(
            { error: "Unexpected Google Calendar error. Please Try again." },
            { status: 500 }
          );
        }

        return response.data.id;
      })
    );

    console.log(results);

    return NextResponse.json({ message: "Success" });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        error: `Unexpected Error adding assignments to calendar. Please Try again.`,
      },
      { status: 500 }
    );
  }
}

function googleCalendarIdConverter(hexColor: string): string {
  const colorMap: { [key: string]: string } = {
    "#7986cb": "1", // Blue
    "#33b679": "2", // Green
    "#8e24aa": "3", // Purple
    "#e67c73": "4", // Red
    "#f6c026": "5", // Yellow
    "#f5511d": "6", // Orange
    "#039be5": "7", // Turquoise
    "#616161": "8", // Gray
    "#3f51b5": "9", // Bold Blue
    "#0b8043": "10", // Bold Green
    "#d60000": "11", // Bold Red
  };

  return colorMap[hexColor] || "1";
}

function formatDateTime(date: string, time: string, timezone: string): string {
  // Create date string
  const dateTimeStr = `${date}T${time}`;

  // Convert to UTC while respecting the timezone
  const zonedDateTime = toZonedTime(dateTimeStr, timezone);

  console.log(zonedDateTime);

  return zonedDateTime.toISOString();
}