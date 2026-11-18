export async function GET() {
  // APP_ENV läses från miljön där appen körs, till exempel development.
  const environment = process.env.APP_ENV;
  const timestamp = new Date().toISOString();

  // Den här loggen syns i terminalen eller i Render-loggarna.
  console.info(
    `INFO: Health check requested in environment: ${
      environment ?? "unknown"
    }`,
  );

  if (!environment) {
    // Ett tydligt fel gör det lättare att hitta en felaktig deployment.
    console.error("ERROR: APP_ENV is missing.");

    return Response.json(
      {
        status: "degraded",
        service: "studyflow",
        environment: "unknown",
        timestamp,
        message: "APP_ENV saknas.",
      },
      {
        status: 503,
      },
    );
  }

  return Response.json({
    status: "ok",
    service: "studyflow",
    environment,
    timestamp,
  });
}
