export async function GET() {
  return Response.json(
    {
      status: 'ok',
      service: 'angadi-storefront',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}
