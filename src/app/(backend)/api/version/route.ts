import { NextResponse } from 'next/server';

import pkg from '../../../../../package.json';

export interface VersionResponseData {
  version: string;
}

// Allow public access to version endpoint
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET() {
  return NextResponse.json(
    {
      version: pkg.version,
    } satisfies VersionResponseData,
    { headers: corsHeaders },
  );
}

export async function OPTIONS() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
}
