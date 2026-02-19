import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const audioUrl = searchParams.get("url");

  if (!audioUrl) {
    return new NextResponse("URL audio manquante", { status: 400 });
  }

  if (
    !audioUrl.startsWith(
      "https://gktyodytvqurbcbyvnrj.supabase.co/storage/v1/object/public/educo-prod-storage/web-educo/"
    )
  ) {
    return new NextResponse("URL non autorisée", { status: 403 });
  }

  try {
    const response = await fetch(audioUrl, {
      headers: {
        Accept: "audio/*,*/*;q=0.1",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
console.error(error)
    ;
    return new NextResponse(
      `Erreur de chargement: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`,
      {
        status: 500,
      }
    );
  }
}
