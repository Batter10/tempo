import { NextRequest, NextResponse } from 'next/server';

// Eenvoudige test-API route
export const dynamic = 'force-dynamic';

// GET route voor eenvoudig testen
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Test API route werkt!',
    timestamp: new Date().toISOString()
  });
}

// POST route voor het testen van uploads
export async function POST(request: NextRequest) {
  try {
    console.log('[TEST] POST request ontvangen op /api/test');
    
    // Test of we formdata kunnen lezen
    let hasFile = false;
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      hasFile = !!file;
      console.log('[TEST] FormData ontvangen, bevat file:', hasFile);
    } catch (formError) {
      console.error('[TEST] Fout bij formData verwerking:', formError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Test API route POST werkt!',
      receivedFile: hasFile,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[TEST] Algemene fout in test route:', error);
    return NextResponse.json(
      { error: 'Test API fout' },
      { status: 500 }
    );
  }
} 