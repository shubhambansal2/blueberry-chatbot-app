import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { shop, accessToken, query } = await request.json();

    if (!shop || !accessToken || !query) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log(`🔍 Backend: Checking subscription for shop: ${shop}`);

    const graphqlUrl = `https://${shop}/admin/api/2024-01/graphql.json`;

    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error(`❌ Backend: API call failed for shop ${shop}:`, response.status, response.statusText);
      return NextResponse.json(
        { error: `Shopify API call failed: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log(`✅ Backend: Successfully fetched subscription data for shop ${shop}`);
    
    // Return the data to the frontend
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Backend: Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 